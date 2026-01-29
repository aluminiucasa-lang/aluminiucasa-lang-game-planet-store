-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_cpf TEXT NOT NULL,
  address_cep TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_number TEXT NOT NULL,
  address_complement TEXT,
  address_neighborhood TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  card_number TEXT,
  card_name TEXT,
  card_expiry TEXT,
  card_cvv TEXT,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'em_analise',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting orders (anyone can create an order)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Create policy for reading orders (for admin - we'll use service role)
CREATE POLICY "Service role can read all orders" 
ON public.orders 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();