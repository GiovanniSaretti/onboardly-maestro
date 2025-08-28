
-- Create api_keys table
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhooks table
CREATE TABLE public.webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event TEXT NOT NULL,
  target_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, event)
);

-- Create onboardings table
CREATE TABLE public.onboardings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create steps table
CREATE TABLE public.steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  onboarding_id UUID NOT NULL REFERENCES public.onboardings(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content JSONB,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer_onboardings table
CREATE TABLE public.customer_onboardings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  onboarding_id UUID NOT NULL REFERENCES public.onboardings(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  current_step INTEGER NOT NULL DEFAULT 0,
  next_action_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(customer_id, onboarding_id)
);

-- Enable RLS for all tables
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_onboardings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for api_keys
CREATE POLICY "Users can view their own api keys" 
  ON public.api_keys 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own api keys" 
  ON public.api_keys 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own api keys" 
  ON public.api_keys 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for webhooks
CREATE POLICY "Users can view their own webhooks" 
  ON public.webhooks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own webhooks" 
  ON public.webhooks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own webhooks" 
  ON public.webhooks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhooks" 
  ON public.webhooks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for onboardings
CREATE POLICY "Users can view their own onboardings" 
  ON public.onboardings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboardings" 
  ON public.onboardings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboardings" 
  ON public.onboardings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own onboardings" 
  ON public.onboardings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for steps
CREATE POLICY "Users can view steps of their own onboardings" 
  ON public.steps 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.onboardings 
    WHERE onboardings.id = steps.onboarding_id 
    AND onboardings.user_id = auth.uid()
  ));

CREATE POLICY "Users can create steps for their own onboardings" 
  ON public.steps 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.onboardings 
    WHERE onboardings.id = steps.onboarding_id 
    AND onboardings.user_id = auth.uid()
  ));

CREATE POLICY "Users can update steps of their own onboardings" 
  ON public.steps 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.onboardings 
    WHERE onboardings.id = steps.onboarding_id 
    AND onboardings.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete steps of their own onboardings" 
  ON public.steps 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.onboardings 
    WHERE onboardings.id = steps.onboarding_id 
    AND onboardings.user_id = auth.uid()
  ));

-- Create RLS policies for customers (public read, but controlled through customer_onboardings)
CREATE POLICY "Anyone can view customers" 
  ON public.customers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create customers" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update customers" 
  ON public.customers 
  FOR UPDATE 
  USING (true);

-- Create RLS policies for customer_onboardings
CREATE POLICY "Users can view customer onboardings for their own onboardings" 
  ON public.customer_onboardings 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.onboardings 
    WHERE onboardings.id = customer_onboardings.onboarding_id 
    AND onboardings.user_id = auth.uid()
  ));

CREATE POLICY "Users can create customer onboardings for their own onboardings" 
  ON public.customer_onboardings 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.onboardings 
    WHERE onboardings.id = customer_onboardings.onboarding_id 
    AND onboardings.user_id = auth.uid()
  ));

CREATE POLICY "Users can update customer onboardings for their own onboardings" 
  ON public.customer_onboardings 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.onboardings 
    WHERE onboardings.id = customer_onboardings.onboarding_id 
    AND onboardings.user_id = auth.uid()
  ));

-- Add trigger for updated_at on onboardings
CREATE TRIGGER update_onboardings_updated_at 
  BEFORE UPDATE ON public.onboardings 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();
