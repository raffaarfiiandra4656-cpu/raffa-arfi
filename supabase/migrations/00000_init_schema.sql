-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROFILES (extends auth.users)
CREATE TYPE public.app_role AS ENUM ('OWNER', 'ADMIN', 'STAFF', 'VIEWER');
CREATE TYPE public.app_status AS ENUM ('pending', 'active', 'suspended');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  full_name TEXT,
  role public.app_role NOT NULL DEFAULT 'VIEWER',
  status public.app_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Function to get current user's company_id for RLS
CREATE OR REPLACE FUNCTION public.get_auth_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. CATEGORIES
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. UNITS
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  abbreviation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. WAREHOUSES
CREATE TABLE public.warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SUPPLIERS
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCTS
CREATE TYPE public.product_status AS ENUM ('In Stock', 'Low Stock', 'Out Of Stock');

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  unit_id UUID REFERENCES public.units(id) ON DELETE RESTRICT,
  warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
  min_stock INTEGER NOT NULL DEFAULT 0,
  current_stock INTEGER NOT NULL DEFAULT 0,
  status public.product_status NOT NULL DEFAULT 'Out Of Stock',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(company_id, sku)
);

-- 8. STOCK TRANSACTIONS
CREATE TYPE public.transaction_type AS ENUM ('IN', 'OUT');

CREATE TABLE public.stock_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  destination TEXT, -- for stock out
  type public.transaction_type NOT NULL,
  quantity INTEGER NOT NULL,
  before_stock INTEGER NOT NULL,
  after_stock INTEGER NOT NULL,
  unit_cost DECIMAL(12,2),
  notes TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_company_updated BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_profile_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_category_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_unit_updated BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_warehouse_updated BEFORE UPDATE ON public.warehouses FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_supplier_updated BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_product_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger for new users -> insert profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, status)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'OWNER', 'active');
  -- Note: We initially set new signups as OWNER and active if we rely on a single signup. 
  -- For invite flows, logic can be modified.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to update product stock and status on stock transaction
CREATE OR REPLACE FUNCTION public.handle_stock_transaction()
RETURNS TRIGGER AS $$
DECLARE
  new_stock INTEGER;
  min_stock_val INTEGER;
  new_status public.product_status;
BEGIN
  SELECT current_stock, min_stock INTO new_stock, min_stock_val FROM public.products WHERE id = NEW.product_id;
  
  NEW.before_stock = new_stock;
  
  IF NEW.type = 'IN' THEN
    new_stock := new_stock + NEW.quantity;
  ELSIF NEW.type = 'OUT' THEN
    new_stock := new_stock - NEW.quantity;
  END IF;
  
  NEW.after_stock := new_stock;
  
  IF new_stock <= 0 THEN
    new_status := 'Out Of Stock';
  ELSIF new_stock <= min_stock_val THEN
    new_status := 'Low Stock';
  ELSE
    new_status := 'In Stock';
  END IF;

  UPDATE public.products 
  SET current_stock = new_stock, status = new_status
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_stock_transaction_inserted
  BEFORE INSERT ON public.stock_transactions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_stock_transaction();

-------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------------------------------

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;

-- COMPANIES
CREATE POLICY "Users can view their company" ON public.companies FOR SELECT USING (id = public.get_auth_company_id());
CREATE POLICY "OWNER can update their company" ON public.companies FOR UPDATE USING (id = public.get_auth_company_id() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'OWNER');
CREATE POLICY "Anyone can insert company" ON public.companies FOR INSERT WITH CHECK (true);

-- PROFILES
CREATE POLICY "Users can view profiles in their company" ON public.profiles FOR SELECT USING (company_id = public.get_auth_company_id() OR id = auth.uid());
CREATE POLICY "User can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "OWNER can manage profiles in company" ON public.profiles FOR ALL USING (company_id = public.get_auth_company_id() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'OWNER');

-- CATEGORIES
CREATE POLICY "Company users can view categories" ON public.categories FOR SELECT USING (company_id = public.get_auth_company_id());
CREATE POLICY "Company users can manage categories" ON public.categories FOR ALL USING (company_id = public.get_auth_company_id());

-- UNITS
CREATE POLICY "Company users can view units" ON public.units FOR SELECT USING (company_id = public.get_auth_company_id());
CREATE POLICY "Company users can manage units" ON public.units FOR ALL USING (company_id = public.get_auth_company_id());

-- WAREHOUSES
CREATE POLICY "Company users can view warehouses" ON public.warehouses FOR SELECT USING (company_id = public.get_auth_company_id());
CREATE POLICY "OWNER/ADMIN can manage warehouses" ON public.warehouses FOR ALL USING (company_id = public.get_auth_company_id() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('OWNER', 'ADMIN'));

-- SUPPLIERS
CREATE POLICY "Company users can view suppliers" ON public.suppliers FOR SELECT USING (company_id = public.get_auth_company_id());
CREATE POLICY "OWNER/ADMIN can manage suppliers" ON public.suppliers FOR ALL USING (company_id = public.get_auth_company_id() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('OWNER', 'ADMIN'));

-- PRODUCTS
CREATE POLICY "Company users can view products" ON public.products FOR SELECT USING (company_id = public.get_auth_company_id());
CREATE POLICY "OWNER/ADMIN can manage products" ON public.products FOR ALL USING (company_id = public.get_auth_company_id() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('OWNER', 'ADMIN'));

-- STOCK TRANSACTIONS
CREATE POLICY "Company users can view stock transactions" ON public.stock_transactions FOR SELECT USING (company_id = public.get_auth_company_id());
CREATE POLICY "OWNER/ADMIN/STAFF can insert stock transactions" ON public.stock_transactions FOR INSERT WITH CHECK (company_id = public.get_auth_company_id() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('OWNER', 'ADMIN', 'STAFF'));
CREATE POLICY "OWNER can delete stock transactions" ON public.stock_transactions FOR DELETE USING (company_id = public.get_auth_company_id() AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'OWNER');
