-- 1. ADD COMPANY SLUG
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS company_slug TEXT UNIQUE;

-- Function to generate slug
CREATE OR REPLACE FUNCTION public.slugify(value TEXT)
RETURNS TEXT AS $$
  SELECT trim(both '-' from regexp_replace(lower(value), '[^a-z0-9]+', '-', 'g'))
$$ LANGUAGE sql IMMUTABLE STRICT;

-- Automatically update existing companies with a slug if it doesn't have one
UPDATE public.companies SET company_slug = slugify(name) || '-' || substr(id::text, 1, 8) WHERE company_slug IS NULL;

-- 2. CREATE INVITATIONS TABLE
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role public.app_role NOT NULL DEFAULT 'STAFF',
    token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, revoked
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + interval '7 days')
);

-- 3. CREATE ACTIVITY LOGS TABLE
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g., 'Product Created', 'Stock Added', 'User Approved'
    entity_type TEXT NOT NULL, -- e.g., 'product', 'stock_transaction', 'profile'
    entity_id UUID, -- ID of the affected entity
    details JSONB, -- Additional info
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RLS POLICIES FOR INVITATIONS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company users can view invitations" ON public.invitations 
FOR SELECT USING (company_id = public.get_auth_company_id());

CREATE POLICY "OWNER can manage invitations" ON public.invitations 
FOR ALL USING (company_id = public.get_auth_company_id() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'OWNER');

-- 5. RLS POLICIES FOR ACTIVITY LOGS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company users can view activity logs" ON public.activity_logs 
FOR SELECT USING (company_id = public.get_auth_company_id());

CREATE POLICY "System can insert activity logs" ON public.activity_logs 
FOR INSERT WITH CHECK (company_id = public.get_auth_company_id());

-- 6. UPDATE TRIGGER FOR NEW USER INVITATION LOGIC
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_invite_token TEXT;
  v_invitation RECORD;
BEGIN
  -- Extract invite token from metadata if provided during signup
  v_invite_token := NEW.raw_user_meta_data->>'invite_token';

  IF v_invite_token IS NOT NULL THEN
     -- Look up the invitation
     SELECT * INTO v_invitation FROM public.invitations 
     WHERE token = v_invite_token AND status = 'pending' AND expires_at > NOW() LIMIT 1;

     IF FOUND THEN
        -- Insert profile with company_id and role from invitation, status active
        INSERT INTO public.profiles (id, company_id, full_name, role, status)
        VALUES (NEW.id, v_invitation.company_id, NEW.raw_user_meta_data->>'full_name', v_invitation.role, 'active');
        
        -- Mark invitation as accepted
        UPDATE public.invitations SET status = 'accepted' WHERE id = v_invitation.id;

        RETURN NEW;
     END IF;
  END IF;

  -- Default fallback for direct signups without an invite
  -- For strict SaaS, we might block this or create a new company.
  -- Here we assume they are creating a new company if no invite token.
  INSERT INTO public.profiles (id, full_name, role, status)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'OWNER', 'active');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
