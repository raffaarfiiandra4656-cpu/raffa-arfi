-- Add production_date and expiration_date to stock_transactions
ALTER TABLE public.stock_transactions 
ADD COLUMN production_date DATE,
ADD COLUMN expiration_date DATE;
