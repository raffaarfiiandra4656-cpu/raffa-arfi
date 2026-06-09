-- Fix Infinite Recursion in RLS Policies

-- Create a security definer function to get the current user's role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS public.app_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Drop all existing policies that use direct subqueries on profiles
DROP POLICY IF EXISTS "OWNER can update their company" ON public.companies;
DROP POLICY IF EXISTS "OWNER can manage profiles in company" ON public.profiles;
DROP POLICY IF EXISTS "OWNER/ADMIN can manage warehouses" ON public.warehouses;
DROP POLICY IF EXISTS "OWNER/ADMIN can manage suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "OWNER/ADMIN can manage products" ON public.products;
DROP POLICY IF EXISTS "OWNER/ADMIN/STAFF can insert stock transactions" ON public.stock_transactions;
DROP POLICY IF EXISTS "OWNER can delete stock transactions" ON public.stock_transactions;

-- Recreate them using the new get_auth_role() function
CREATE POLICY "OWNER can update their company" ON public.companies FOR UPDATE USING (id = public.get_auth_company_id() AND public.get_auth_role() = 'OWNER');

CREATE POLICY "OWNER can manage profiles in company" ON public.profiles FOR ALL USING (company_id = public.get_auth_company_id() AND public.get_auth_role() = 'OWNER');

CREATE POLICY "OWNER/ADMIN can manage warehouses" ON public.warehouses FOR ALL USING (company_id = public.get_auth_company_id() AND public.get_auth_role() IN ('OWNER', 'ADMIN'));

CREATE POLICY "OWNER/ADMIN can manage suppliers" ON public.suppliers FOR ALL USING (company_id = public.get_auth_company_id() AND public.get_auth_role() IN ('OWNER', 'ADMIN'));

CREATE POLICY "OWNER/ADMIN can manage products" ON public.products FOR ALL USING (company_id = public.get_auth_company_id() AND public.get_auth_role() IN ('OWNER', 'ADMIN'));

CREATE POLICY "OWNER/ADMIN/STAFF can insert stock transactions" ON public.stock_transactions FOR INSERT WITH CHECK (company_id = public.get_auth_company_id() AND public.get_auth_role() IN ('OWNER', 'ADMIN', 'STAFF'));

CREATE POLICY "OWNER can delete stock transactions" ON public.stock_transactions FOR DELETE USING (company_id = public.get_auth_company_id() AND public.get_auth_role() = 'OWNER');

