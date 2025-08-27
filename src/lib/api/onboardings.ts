import { supabase } from '@/integrations/supabase/client';

export interface Onboarding {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Step {
  id: string;
  onboarding_id: string;
  type: string;
  content: any;
  order: number;
  created_at: string;
}

export interface OnboardingWithSteps extends Onboarding {
  steps: Step[];
}

export interface Customer {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface CustomerOnboarding {
  id: string;
  customer_id: string;
  onboarding_id: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  current_step: number;
  next_action_at: string;
  created_at: string;
  completed_at?: string;
}

// API functions for Onboardings
export const onboardingApi = {
  // Get all onboardings for the current user
  async getAll(): Promise<Onboarding[]> {
    const { data, error } = await supabase
      .from('onboardings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a specific onboarding with its steps
  async getById(id: string): Promise<OnboardingWithSteps | null> {
    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboardings')
      .select('*')
      .eq('id', id)
      .single();

    if (onboardingError) throw onboardingError;
    if (!onboarding) return null;

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

  // Create a new onboarding
  async create(name: string): Promise<Onboarding> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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

  // Update an onboarding
  async update(id: string, updates: Partial<Pick<Onboarding, 'name'>>): Promise<Onboarding> {
    const { data, error } = await supabase
      .from('onboardings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an onboarding
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('onboardings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Save steps for an onboarding (replaces all existing steps)
  async saveSteps(onboardingId: string, steps: Omit<Step, 'id' | 'onboarding_id' | 'created_at'>[]): Promise<void> {
    // Start a transaction-like operation
    // First, delete all existing steps
    const { error: deleteError } = await supabase
      .from('steps')
      .delete()
      .eq('onboarding_id', onboardingId);

    if (deleteError) throw deleteError;

    // Then, insert the new steps
    if (steps.length > 0) {
      const stepsToInsert = steps.map((step, index) => ({
        onboarding_id: onboardingId,
        type: step.type,
        content: step.content,
        order: index
      }));

      const { error: insertError } = await supabase
        .from('steps')
        .insert(stepsToInsert);

      if (insertError) throw insertError;
    }
  }
};

// API functions for Customers
export const customerApi = {
  // Get all customers for the current user (through their onboardings)
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        customer_onboardings!inner(
          onboarding_id,
          onboardings!inner(user_id)
        )
      `);

    if (error) throw error;
    return data || [];
  },

  // Create or update a customer
  async upsert(email: string, name?: string): Promise<Customer> {
    const { data, error } = await supabase
      .from('customers')
      .upsert({
        email,
        name
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add a customer to an onboarding flow
  async addToOnboarding(customerId: string, onboardingId: string): Promise<CustomerOnboarding> {
    const { data, error } = await supabase
      .from('customer_onboardings')
      .insert({
        customer_id: customerId,
        onboarding_id: onboardingId,
        status: 'ACTIVE'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get customer progress in onboardings
  async getOnboardingProgress(customerId: string): Promise<CustomerOnboarding[]> {
    const { data, error } = await supabase
      .from('customer_onboardings')
      .select(`
        *,
        onboardings(name),
        customers(email, name)
      `)
      .eq('customer_id', customerId);

    if (error) throw error;
    return data || [];
  }
};

