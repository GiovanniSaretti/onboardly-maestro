import { supabase } from '@/integrations/supabase/client';

export interface ApiKey {
  id: string;
  key: string;
  user_id: string;
  created_at: string;
}

export interface Webhook {
  id: string;
  user_id: string;
  event: string;
  target_url: string;
  created_at: string;
}

// Generate a random API key
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'onboardly_prod_';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// API functions for API Keys
export const apiKeyApi = {
  // Get the user's API key
  async get(): Promise<ApiKey | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data || null;
  },

  // Generate a new API key (replaces existing one)
  async generate(): Promise<ApiKey> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Delete existing API key
    await supabase
      .from('api_keys')
      .delete()
      .eq('user_id', user.id);

    // Create new API key
    const newKey = generateApiKey();
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        key: newKey,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete the user's API key
  async delete(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  },

  // Validate an API key (for use in API endpoints)
  async validate(key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key', key)
      .single();

    if (error) return null;
    return data?.user_id || null;
  }
};

// API functions for Webhooks
export const webhookApi = {
  // Get all webhooks for the current user
  async getAll(): Promise<Webhook[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Create or update a webhook for a specific event
  async upsert(event: string, targetUrl: string): Promise<Webhook> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('webhooks')
      .upsert({
        user_id: user.id,
        event,
        target_url: targetUrl
      }, {
        onConflict: 'user_id,event'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a webhook
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get webhook for a specific event and user (for internal use)
  async getByEvent(userId: string, event: string): Promise<Webhook | null> {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('user_id', userId)
      .eq('event', event)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }
};

// Webhook dispatcher function
export async function dispatchWebhook(userId: string, event: string, payload: any): Promise<void> {
  try {
    const webhook = await webhookApi.getByEvent(userId, event);
    
    if (webhook) {
      const response = await fetch(webhook.target_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event,
          payload,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.error(`Failed to dispatch webhook for event ${event}:`, response.statusText);
      }
    }
  } catch (error) {
    console.error(`Error dispatching webhook for event ${event}:`, error);
  }
}

// Available webhook events
export const WEBHOOK_EVENTS = {
  ONBOARDING_COMPLETED: 'onboarding.completed',
  CUSTOMER_ADDED: 'customer.added',
  STEP_COMPLETED: 'step.completed'
} as const;

export type WebhookEvent = typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS];

// Data types for onboarding system
export interface Customer {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface Onboarding {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Step {
  id: string;
  onboarding_id: string;
  type: string;
  content?: any;
  order: number;
  created_at: string;
}

export interface OnboardingWithSteps extends Onboarding {
  steps: Step[];
}

export interface CustomerOnboarding {
  id: string;
  customer_id: string;
  onboarding_id: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  current_step: number;
  next_action_at?: string;
  created_at: string;
  completed_at?: string;
}

// Customer API
export const customerApi = {
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async upsert(email: string, name?: string): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .upsert(
        { email, name },
        { onConflict: 'email' }
      )
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async addToOnboarding(customerId: string, onboardingId: string): Promise<CustomerOnboarding> {
    const { data, error } = await supabase
      .from('customer_onboardings')
      .upsert(
        {
          customer_id: customerId,
          onboarding_id: onboardingId,
          status: 'ACTIVE',
          current_step: 0,
          next_action_at: new Date().toISOString()
        },
        { onConflict: 'customer_id,onboarding_id' }
      )
      .select()
      .single();
    
    if (error) throw error;
    return (data as CustomerOnboarding) || null;
  },

  async getOnboardingProgress(customerId: string): Promise<CustomerOnboarding[]> {
    const { data, error } = await supabase
      .from('customer_onboardings')
      .select(`
        *,
        onboardings (
          id,
          name,
          user_id
        )
      `)
      .eq('customer_id', customerId);
    
    if (error) throw error;
    return (data as CustomerOnboarding[]) || [];
  }
};

// Onboarding API
export const onboardingApi = {
  async getAll(): Promise<Onboarding[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('onboardings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<OnboardingWithSteps | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboardings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (onboardingError) return null;

    const { data: steps, error: stepsError } = await supabase
      .from('steps')
      .select('*')
      .eq('onboarding_id', id)
      .order('order', { ascending: true });
    
    if (stepsError) throw stepsError;

    return {
      ...onboarding,
      steps: steps || []
    };
  },

  async create(name: string): Promise<Onboarding> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('onboardings')
      .insert({
        name,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Pick<Onboarding, 'name'>>): Promise<Onboarding> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('onboardings')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('onboardings')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) throw error;
  },

  async saveSteps(onboardingId: string, steps: Omit<Step, 'id' | 'onboarding_id' | 'created_at'>[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // First, delete existing steps
    await supabase
      .from('steps')
      .delete()
      .eq('onboarding_id', onboardingId);

    // Then insert new steps
    if (steps.length > 0) {
      const stepsToInsert = steps.map(step => ({
        ...step,
        onboarding_id: onboardingId
      }));

      const { error } = await supabase
        .from('steps')
        .insert(stepsToInsert);
      
      if (error) throw error;
    }
  }
};

