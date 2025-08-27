import { supabase } from '@/integrations/supabase/client';
import { apiKeyApi, customerApi, onboardingApi } from './integrations';

// External API functions that can be called by n8n or other external services
// These functions authenticate using API keys instead of user sessions

// Authenticate API request using API key
async function authenticateApiKey(apiKey: string): Promise<string | null> {
  if (!apiKey || !apiKey.startsWith('Bearer ')) {
    return null;
  }
  
  const key = apiKey.replace('Bearer ', '');
  return await apiKeyApi.validate(key);
}

// External API for adding a customer to an onboarding flow
export async function addCustomerToOnboarding(
  apiKey: string,
  customerData: { email: string; name?: string },
  onboardingId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const userId = await authenticateApiKey(apiKey);
    if (!userId) {
      return { success: false, error: 'Invalid API key' };
    }

    // Verify that the onboarding belongs to the user
    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboardings')
      .select('id')
      .eq('id', onboardingId)
      .eq('user_id', userId)
      .single();

    if (onboardingError || !onboarding) {
      return { success: false, error: 'Onboarding not found or access denied' };
    }

    // Create or update the customer
    const customer = await customerApi.upsert(customerData.email, customerData.name);

    // Add customer to the onboarding flow
    const customerOnboarding = await customerApi.addToOnboarding(customer.id, onboardingId);

    return {
      success: true,
      data: {
        customer,
        customerOnboarding
      }
    };
  } catch (error) {
    console.error('Error adding customer to onboarding:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// External API for getting onboarding details
export async function getOnboardingDetails(
  apiKey: string,
  onboardingId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const userId = await authenticateApiKey(apiKey);
    if (!userId) {
      return { success: false, error: 'Invalid API key' };
    }

    // Get onboarding with steps
    const onboarding = await onboardingApi.getById(onboardingId);
    
    if (!onboarding || onboarding.user_id !== userId) {
      return { success: false, error: 'Onboarding not found or access denied' };
    }

    return {
      success: true,
      data: onboarding
    };
  } catch (error) {
    console.error('Error getting onboarding details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// External API for getting customer progress
export async function getCustomerProgress(
  apiKey: string,
  customerEmail: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const userId = await authenticateApiKey(apiKey);
    if (!userId) {
      return { success: false, error: 'Invalid API key' };
    }

    // Find customer by email
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerEmail)
      .single();

    if (customerError || !customer) {
      return { success: false, error: 'Customer not found' };
    }

    // Get customer's onboarding progress
    const progress = await customerApi.getOnboardingProgress(customer.id);

    // Filter to only show onboardings owned by the API key user
    const filteredProgress = progress.filter((p: any) => 
      p.onboardings?.user_id === userId
    );

    return {
      success: true,
      data: {
        customer,
        progress: filteredProgress
      }
    };
  } catch (error) {
    console.error('Error getting customer progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// External API for updating customer progress (mark step as completed)
export async function updateCustomerProgress(
  apiKey: string,
  customerEmail: string,
  onboardingId: string,
  stepIndex: number
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const userId = await authenticateApiKey(apiKey);
    if (!userId) {
      return { success: false, error: 'Invalid API key' };
    }

    // Verify onboarding ownership
    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboardings')
      .select('id')
      .eq('id', onboardingId)
      .eq('user_id', userId)
      .single();

    if (onboardingError || !onboarding) {
      return { success: false, error: 'Onboarding not found or access denied' };
    }

    // Find customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customerEmail)
      .single();

    if (customerError || !customer) {
      return { success: false, error: 'Customer not found' };
    }

    // Update customer progress
    const { data, error } = await supabase
      .from('customer_onboardings')
      .update({
        current_step: stepIndex,
        next_action_at: new Date().toISOString()
      })
      .eq('customer_id', customer.id)
      .eq('onboarding_id', onboardingId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error updating customer progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

