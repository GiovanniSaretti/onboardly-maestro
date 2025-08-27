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

