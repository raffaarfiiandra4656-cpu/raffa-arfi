-- STRICT ROLE ASSIGNMENT RULES

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_invite_token TEXT;
  v_invitation RECORD;
BEGIN
  -- 1. Owner Account Bypass
  IF NEW.email = 'raffaarfiiandra@gmail.com' THEN
    -- Try to find an existing company they own, or create one?
    -- Since we only have NEW.id, we just insert them as OWNER
    INSERT INTO public.profiles (id, full_name, role, status)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'OWNER', 'active');
    RETURN NEW;
  END IF;

  v_invite_token := NEW.raw_user_meta_data->>'invite_token';

  -- 2. Invited Users
  IF v_invite_token IS NOT NULL THEN
     SELECT * INTO v_invitation FROM public.invitations 
     WHERE token = v_invite_token AND status = 'pending' AND expires_at > NOW() LIMIT 1;

     IF FOUND THEN
        -- Force VIEWER and PENDING regardless of invite settings
        INSERT INTO public.profiles (id, company_id, full_name, role, status)
        VALUES (NEW.id, v_invitation.company_id, NEW.raw_user_meta_data->>'full_name', 'VIEWER', 'pending');
        
        UPDATE public.invitations SET status = 'accepted' WHERE id = v_invitation.id;

        RETURN NEW;
     END IF;
  END IF;

  -- 3. Fallback for non-invited users (Organic Signups)
  -- They get VIEWER and PENDING, but no company_id. 
  -- They will be in limbo until an admin manually assigns them a company_id via DB.
  INSERT INTO public.profiles (id, full_name, role, status)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'VIEWER', 'pending');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
