import { processAutomations } from './engine';

// Cron job handler that can be called by external services or scheduled tasks
export async function handleCronJob(): Promise<Response> {
  console.log('Cron job started at:', new Date().toISOString());
  
  try {
    const result = await processAutomations();
    
    console.log('Cron job completed:', result);
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Cron job error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Manual trigger function for testing
export async function triggerAutomationManually(): Promise<void> {
  console.log('Manual automation trigger started');
  const result = await processAutomations();
  console.log('Manual automation result:', result);
}

// Schedule configuration for different environments
export const CRON_SCHEDULES = {
  // Every 5 minutes in production
  PRODUCTION: '*/5 * * * *',
  
  // Every minute in development (for testing)
  DEVELOPMENT: '* * * * *',
  
  // Every 15 minutes (conservative approach)
  CONSERVATIVE: '*/15 * * * *'
};

// Helper function to determine if we should process automations
// This can be used to implement rate limiting or business hours restrictions
export function shouldProcessAutomations(): boolean {
  const now = new Date();
  const hour = now.getHours();
  
  // Example: Only process during business hours (9 AM to 6 PM)
  // Uncomment the line below to enable this restriction
  // return hour >= 9 && hour < 18;
  
  // For now, always process
  return true;
}

// Wrapper function that respects business rules
export async function processAutomationsWithRules(): Promise<{ success: boolean; message: string }> {
  if (!shouldProcessAutomations()) {
    return {
      success: true,
      message: 'Skipped processing due to business rules (e.g., outside business hours)'
    };
  }
  
  return await processAutomations();
}

