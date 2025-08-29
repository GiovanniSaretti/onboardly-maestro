import { supabase } from '@/integrations/supabase/client';
import { dispatchWebhook, WEBHOOK_EVENTS } from '@/lib/api/integrations';

export interface ProcessableCustomerOnboarding {
  id: string;
  customer_id: string;
  onboarding_id: string;
  status: string;
  current_step: number;
  next_action_at: string;
  customer: {
    email: string;
    name?: string;
  };
  onboarding: {
    name: string;
    user_id: string;
    steps: Array<{
      id: string;
      type: string;
      content: any;
      order: number;
    }>;
  };
}

// Main automation engine class
export class AutomationEngine {
  
  // Process all pending actions
  static async processAllPendingActions(): Promise<void> {
    console.log('Starting automation engine processing...');
    
    try {
      const pendingActions = await this.getPendingActions();
      console.log(`Found ${pendingActions.length} pending actions to process`);
      
      for (const action of pendingActions) {
        try {
          await this.processCustomerOnboarding(action);
        } catch (error) {
          console.error(`Error processing customer onboarding ${action.id}:`, error);
          // Continue processing other actions even if one fails
        }
      }
      
      console.log('Automation engine processing completed');
    } catch (error) {
      console.error('Error in automation engine:', error);
    }
  }

  // Get all customer onboardings that need processing
  private static async getPendingActions(): Promise<ProcessableCustomerOnboarding[]> {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('customer_onboardings')
      .select(`
        *,
        customers!inner(email, name),
        onboardings!inner(
          name,
          user_id,
          steps(id, type, content, "order")
        )
      `)
      .eq('status', 'ACTIVE')
      .lte('next_action_at', now);

    if (error) {
      console.error('Error fetching pending actions:', error);
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      customer_id: item.customer_id,
      onboarding_id: item.onboarding_id,
      status: item.status as 'ACTIVE' | 'PAUSED' | 'COMPLETED',
      current_step: item.current_step,
      next_action_at: item.next_action_at,
      created_at: item.created_at,
      completed_at: item.completed_at,
      customer: item.customers,
      onboarding: item.onboardings
    })) as ProcessableCustomerOnboarding[];
  }

  // Process a single customer onboarding
  private static async processCustomerOnboarding(customerOnboarding: ProcessableCustomerOnboarding): Promise<void> {
    const { onboarding, customer, current_step } = customerOnboarding;
    const steps = onboarding.steps.sort((a, b) => a.order - b.order);
    
    // Check if we've completed all steps
    if (current_step >= steps.length) {
      await this.completeOnboarding(customerOnboarding);
      return;
    }

    const currentStepData = steps[current_step];
    if (!currentStepData) {
      console.error(`Step ${current_step} not found for onboarding ${onboarding.name}`);
      return;
    }

    console.log(`Processing step ${current_step + 1}/${steps.length} for customer ${customer.email}`);

    // Execute the current step
    await this.executeStep(currentStepData, customer, customerOnboarding);

    // Move to next step
    const nextStepIndex = current_step + 1;
    let nextActionAt = new Date();

    if (nextStepIndex < steps.length) {
      const nextStep = steps[nextStepIndex];
      
      // If next step is a delay, calculate when to execute it
      if (nextStep.type === 'DELAY') {
        const delayDays = nextStep.content.delayInDays || 1;
        nextActionAt.setDate(nextActionAt.getDate() + delayDays);
      }
      // For other step types, execute immediately (or after a small buffer)
      else {
        nextActionAt.setMinutes(nextActionAt.getMinutes() + 1);
      }

      // Update progress
      await supabase
        .from('customer_onboardings')
        .update({
          current_step: nextStepIndex,
          next_action_at: nextActionAt.toISOString()
        })
        .eq('id', customerOnboarding.id);
    } else {
      // No more steps, complete the onboarding
      await this.completeOnboarding(customerOnboarding);
    }
  }

  // Execute a specific step
  private static async executeStep(
    step: any, 
    customer: { email: string; name?: string }, 
    customerOnboarding: ProcessableCustomerOnboarding
  ): Promise<void> {
    console.log(`Executing step ${step.order}: ${step.type}`);
    
    const content = step.content || {};
    
    switch (step.type) {
      case 'EMAIL':
        await this.sendNotification({
          type: 'EMAIL',
          recipient: customer.email,
          subject: this.replaceVariables(content.subject || 'Welcome!', customer),
          message: this.replaceVariables(content.body || content.message || '', customer)
        });
        break;
        
      case 'SMS':
        await this.sendNotification({
          type: 'SMS',
          recipient: content.phone || '',
          message: this.replaceVariables(content.message || '', customer)
        });
        break;
        
      case 'WHATSAPP_MSG':
        await this.sendNotification({
          type: 'SMS', // Using SMS for WhatsApp for now
          recipient: content.phone || '',
          message: this.replaceVariables(content.message || '', customer)
        });
        break;
        
      case 'TELEGRAM':
        await this.sendNotification({
          type: 'TELEGRAM',
          recipient: content.chat_id || '',
          message: this.replaceVariables(content.message || '', customer)
        });
        break;
        
      case 'PUSH':
        await this.sendNotification({
          type: 'PUSH',
          recipient: content.token || '',
          subject: this.replaceVariables(content.title || 'Notification', customer),
          message: this.replaceVariables(content.message || '', customer),
          data: content.data
        });
        break;
        
      case 'DELAY':
        // Delay steps are handled in the scheduling logic, no action needed here
        console.log(`Delay step processed for customer ${customer.email}`);
        break;
        
      default:
        console.warn(`Unknown step type: ${step.type}`);
    }

    // Dispatch webhook for step completion
    await dispatchWebhook(
      customerOnboarding.onboarding.user_id,
      WEBHOOK_EVENTS.STEP_COMPLETED,
      {
        customer,
        onboarding: customerOnboarding.onboarding,
        step: {
          type: step.type,
          content: step.content,
          order: step.order
        },
        completedAt: new Date().toISOString()
      }
    );
  }

  // Send notification using the edge function
  private static async sendNotification(notification: {
    type: 'EMAIL' | 'SMS' | 'TELEGRAM' | 'PUSH';
    recipient: string;
    subject?: string;
    message: string;
    data?: any;
  }) {
    try {
      const response = await fetch(`https://nunapqmqfyaujfdihwjb.supabase.co/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51bmFwcW1xZnlhdWpmZGlod2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNDg3NDMsImV4cCI6MjA3MTgyNDc0M30.0StNZxk_sURwBpqlVND416BoTUSYdWjyyjpWuq_V99I`,
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`Failed to send ${notification.type} notification: ${response.statusText}`);
      }

      console.log(`${notification.type} notification sent successfully to ${notification.recipient}`);
    } catch (error) {
      console.error(`Error sending ${notification.type} notification:`, error);
      throw error;
    }
  }

  // Complete an onboarding flow
  private static async completeOnboarding(customerOnboarding: ProcessableCustomerOnboarding): Promise<void> {
    console.log(`Completing onboarding for customer ${customerOnboarding.customer.email}`);

    // Update status to completed
    await supabase
      .from('customer_onboardings')
      .update({
        status: 'COMPLETED',
        completed_at: new Date().toISOString()
      })
      .eq('id', customerOnboarding.id);

    // Dispatch webhook for onboarding completion
    await dispatchWebhook(
      customerOnboarding.onboarding.user_id,
      WEBHOOK_EVENTS.ONBOARDING_COMPLETED,
      {
        customer: customerOnboarding.customer,
        onboarding: {
          id: customerOnboarding.onboarding_id,
          name: customerOnboarding.onboarding.name
        },
        completedAt: new Date().toISOString()
      }
    );
  }

  // Replace variables in text content
  private static replaceVariables(text: string, customer: { email: string; name?: string }): string {
    return text
      .replace(/\{\{nome_do_cliente\}\}/g, customer.name || customer.email)
      .replace(/\{\{name\}\}/g, customer.name || customer.email)
      .replace(/\{\{email_do_cliente\}\}/g, customer.email)
      .replace(/\{\{email\}\}/g, customer.email)
      .replace(/\{\{telefone_do_cliente\}\}/g, 'N/A'); // TODO: Add phone field to customer
  }

  // Add a customer to an onboarding flow (helper method)
  static async addCustomerToFlow(
    customerEmail: string, 
    customerName: string | undefined, 
    onboardingId: string
  ): Promise<void> {
    // Create or update customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert({
        email: customerEmail,
        name: customerName
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (customerError) throw customerError;

    // Add customer to onboarding flow
    const { error: onboardingError } = await supabase
      .from('customer_onboardings')
      .insert({
        customer_id: customer.id,
        onboarding_id: onboardingId,
        status: 'ACTIVE',
        current_step: 0,
        next_action_at: new Date().toISOString() // Start immediately
      });

    if (onboardingError) throw onboardingError;

    console.log(`Customer ${customerEmail} added to onboarding flow ${onboardingId}`);
  }
}

// Export a simple function that can be called by cron jobs or API endpoints
export async function processAutomations(): Promise<{ success: boolean; message: string }> {
  try {
    await AutomationEngine.processAllPendingActions();
    return { success: true, message: 'Automations processed successfully' };
  } catch (error) {
    console.error('Error processing automations:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

