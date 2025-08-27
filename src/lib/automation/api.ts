import { supabase } from '@/integrations/supabase/client';
import { AutomationEngine, processAutomations } from './engine';

// API functions for managing automations
export const automationApi = {
  
  // Manually trigger automation processing (for testing)
  async triggerProcessing(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await processAutomations();
      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Add a customer to an onboarding flow
  async addCustomerToFlow(
    customerEmail: string,
    customerName: string | undefined,
    onboardingId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      await AutomationEngine.addCustomerToFlow(customerEmail, customerName, onboardingId);
      return {
        success: true,
        message: 'Customer added to onboarding flow successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get automation status and statistics
  async getAutomationStats(): Promise<{
    activeFlows: number;
    activeCustomers: number;
    completedOnboardings: number;
    pendingActions: number;
  }> {
    try {
      // Get active flows count
      const { count: activeFlows } = await supabase
        .from('onboardings')
        .select('*', { count: 'exact', head: true });

      // Get active customers count
      const { count: activeCustomers } = await supabase
        .from('customer_onboardings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ACTIVE');

      // Get completed onboardings count
      const { count: completedOnboardings } = await supabase
        .from('customer_onboardings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'COMPLETED');

      // Get pending actions count
      const now = new Date().toISOString();
      const { count: pendingActions } = await supabase
        .from('customer_onboardings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ACTIVE')
        .lte('next_action_at', now);

      return {
        activeFlows: activeFlows || 0,
        activeCustomers: activeCustomers || 0,
        completedOnboardings: completedOnboardings || 0,
        pendingActions: pendingActions || 0
      };
    } catch (error) {
      console.error('Error getting automation stats:', error);
      return {
        activeFlows: 0,
        activeCustomers: 0,
        completedOnboardings: 0,
        pendingActions: 0
      };
    }
  },

  // Get customer progress in onboarding flows
  async getCustomerProgress(customerEmail: string): Promise<{
    success: boolean;
    data?: Array<{
      onboarding_name: string;
      status: string;
      current_step: number;
      total_steps: number;
      progress_percentage: number;
      next_action_at: string;
    }>;
    message?: string;
  }> {
    try {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (customerError || !customer) {
        return {
          success: false,
          message: 'Customer not found'
        };
      }

      const { data: progress, error: progressError } = await supabase
        .from('customer_onboardings')
        .select(`
          *,
          onboardings!inner(
            name,
            steps(id)
          )
        `)
        .eq('customer_id', customer.id);

      if (progressError) throw progressError;

      const formattedProgress = progress?.map((p: any) => {
        const totalSteps = p.onboardings.steps.length;
        const progressPercentage = totalSteps > 0 ? Math.round((p.current_step / totalSteps) * 100) : 0;

        return {
          onboarding_name: p.onboardings.name,
          status: p.status,
          current_step: p.current_step,
          total_steps: totalSteps,
          progress_percentage: progressPercentage,
          next_action_at: p.next_action_at
        };
      }) || [];

      return {
        success: true,
        data: formattedProgress
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Pause a customer's onboarding
  async pauseCustomerOnboarding(customerEmail: string, onboardingId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (customerError || !customer) {
        return {
          success: false,
          message: 'Customer not found'
        };
      }

      const { error } = await supabase
        .from('customer_onboardings')
        .update({ status: 'PAUSED' })
        .eq('customer_id', customer.id)
        .eq('onboarding_id', onboardingId);

      if (error) throw error;

      return {
        success: true,
        message: 'Customer onboarding paused successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Resume a customer's onboarding
  async resumeCustomerOnboarding(customerEmail: string, onboardingId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (customerError || !customer) {
        return {
          success: false,
          message: 'Customer not found'
        };
      }

      const { error } = await supabase
        .from('customer_onboardings')
        .update({ 
          status: 'ACTIVE',
          next_action_at: new Date().toISOString() // Resume immediately
        })
        .eq('customer_id', customer.id)
        .eq('onboarding_id', onboardingId);

      if (error) throw error;

      return {
        success: true,
        message: 'Customer onboarding resumed successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};

