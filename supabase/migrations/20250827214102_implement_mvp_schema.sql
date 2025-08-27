-- Create Onboarding table
CREATE TABLE public.onboardings (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Step table
CREATE TABLE public.steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  onboarding_id UUID NOT NULL REFERENCES public.onboardings(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- e.g., 'EMAIL', 'DELAY', 'WHATSAPP_MSG'
  content JSONB NOT NULL, -- e.g., { "subject": "...", "body": "...", "delayInDays": 2 }
  "order" INTEGER NOT NULL, -- Order of the step in the flow
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Customer table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create CustomerOnboarding table (junction table for customer progress in an onboarding flow)
CREATE TABLE public.customer_onboardings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  onboarding_id UUID NOT NULL REFERENCES public.onboardings(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- e.g., 'ACTIVE', 'PAUSED', 'COMPLETED'
  current_step INTEGER NOT NULL DEFAULT 0, -- Index of the current step the customer is on
  next_action_at TIMESTAMP WITH TIME ZONE DEFAULT now(), -- When the next action should be executed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(customer_id, onboarding_id)
);

-- Create ApiKey table
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Webhook table
CREATE TABLE public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event TEXT NOT NULL, -- e.g., 'onboarding.completed', 'customer.added'
  target_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, event)
);

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE public.onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables

-- Onboardings
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

-- Steps
CREATE POLICY "Users can view steps of their own onboardings" 
ON public.steps 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.onboardings WHERE id = onboarding_id AND user_id = auth.uid()));

CREATE POLICY "Users can create steps for their own onboardings" 
ON public.steps 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.onboardings WHERE id = onboarding_id AND user_id = auth.uid()));

CREATE POLICY "Users can update steps of their own onboardings" 
ON public.steps 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.onboardings WHERE id = onboarding_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete steps of their own onboardings" 
ON public.steps 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.onboardings WHERE id = onboarding_id AND user_id = auth.uid()));

-- Customers (assuming customers are associated with onboardings owned by the user)
CREATE POLICY "Users can view their own customers" 
ON public.customers 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.customer_onboardings co JOIN public.onboardings o ON co.onboarding_id = o.id WHERE co.customer_id = id AND o.user_id = auth.uid()));

CREATE POLICY "Users can create customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (true); -- Allow creation, association will be handled by customer_onboardings

CREATE POLICY "Users can update their own customers" 
ON public.customers 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.customer_onboardings co JOIN public.onboardings o ON co.onboarding_id = o.id WHERE co.customer_id = id AND o.user_id = auth.uid()));

CREATE POLICY "Users can delete their own customers" 
ON public.customers 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.customer_onboardings co JOIN public.onboardings o ON co.onboarding_id = o.id WHERE co.customer_id = id AND o.user_id = auth.uid()));

-- CustomerOnboardings
CREATE POLICY "Users can view their own customer onboardings" 
ON public.customer_onboardings 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.onboardings WHERE id = onboarding_id AND user_id = auth.uid()));

CREATE POLICY "Users can create customer onboardings for their own onboardings" 
ON public.customer_onboardings 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.onboardings WHERE id = onboarding_id AND user_id = auth.uid()));

CREATE POLICY "Users can update their own customer onboardings" 
ON public.customer_onboardings 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.onboardings WHERE id = onboarding_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete their own customer onboardings" 
ON public.customer_onboardings 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.onboardings WHERE id = onboarding_id AND user_id = auth.uid()));

-- ApiKeys
CREATE POLICY "Users can view their own API keys" 
ON public.api_keys 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys" 
ON public.api_keys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" 
ON public.api_keys 
FOR DELETE 
USING (auth.uid() = user_id);

-- Webhooks
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

-- Add updated_at triggers for new tables
CREATE TRIGGER update_onboardings_updated_at
BEFORE UPDATE ON public.onboardings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_onboardings_updated_at
BEFORE UPDATE ON public.customer_onboardings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at
BEFORE UPDATE ON public.api_keys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at
BEFORE UPDATE ON public.webhooks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();


