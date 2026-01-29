-- Allow anyone to delete orders (admin panel uses password protection)
CREATE POLICY "Anyone can delete orders" 
ON public.orders 
FOR DELETE 
USING (true);