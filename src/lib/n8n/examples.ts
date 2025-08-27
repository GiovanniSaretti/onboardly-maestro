// n8n Workflow Examples for Onboardly Integration

export const N8N_WORKFLOW_EXAMPLES = {
  
  // Example 1: Add customer to onboarding when they sign up
  CUSTOMER_SIGNUP_TO_ONBOARDING: {
    name: "Customer Signup → Onboarding",
    description: "Automatically add new customers to an onboarding flow when they sign up",
    workflow: {
      nodes: [
        {
          name: "Webhook Trigger",
          type: "n8n-nodes-base.webhook",
          description: "Receives customer signup data",
          parameters: {
            httpMethod: "POST",
            path: "customer-signup"
          }
        },
        {
          name: "Add to Onboardly",
          type: "n8n-nodes-base.httpRequest",
          description: "Adds customer to onboarding flow",
          parameters: {
            url: "https://your-onboardly.com/api/actions/add-customer-to-onboarding",
            method: "POST",
            headers: {
              "Authorization": "Bearer YOUR_API_KEY",
              "Content-Type": "application/json"
            },
            body: {
              email: "={{ $json.email }}",
              name: "={{ $json.name }}",
              onboardingId: "YOUR_ONBOARDING_ID"
            }
          }
        }
      ]
    },
    setup_instructions: [
      "1. Create a new workflow in n8n",
      "2. Add a Webhook trigger node",
      "3. Copy the webhook URL",
      "4. Add an HTTP Request node",
      "5. Configure the HTTP Request with your Onboardly API key",
      "6. Set the onboardingId to your desired flow",
      "7. Test by sending a POST request to the webhook URL"
    ]
  },

  // Example 2: Send Slack notification when onboarding completes
  ONBOARDING_COMPLETE_SLACK: {
    name: "Onboarding Complete → Slack Notification",
    description: "Send a Slack message when a customer completes onboarding",
    workflow: {
      nodes: [
        {
          name: "Onboardly Webhook",
          type: "n8n-nodes-base.webhook",
          description: "Receives onboarding completion events",
          parameters: {
            httpMethod: "POST",
            path: "onboarding-complete"
          }
        },
        {
          name: "Send Slack Message",
          type: "n8n-nodes-base.slack",
          description: "Notifies team about completion",
          parameters: {
            channel: "#customer-success",
            text: "🎉 {{ $json.payload.customer.name || $json.payload.customer.email }} completed the {{ $json.payload.onboarding.name }} onboarding!"
          }
        }
      ]
    },
    setup_instructions: [
      "1. Create a new workflow in n8n",
      "2. Add a Webhook trigger node",
      "3. Copy the webhook URL",
      "4. Go to Onboardly Integrations page",
      "5. Add a new webhook for 'onboarding.completed' event",
      "6. Paste the n8n webhook URL",
      "7. Add a Slack node and configure your channel",
      "8. Test by completing an onboarding flow"
    ]
  },

  // Example 3: Add customer to CRM when they complete onboarding
  ONBOARDING_TO_CRM: {
    name: "Onboarding Complete → Add to CRM",
    description: "Add customer to your CRM system when they complete onboarding",
    workflow: {
      nodes: [
        {
          name: "Onboardly Webhook",
          type: "n8n-nodes-base.webhook",
          description: "Receives onboarding completion events"
        },
        {
          name: "Add to HubSpot",
          type: "n8n-nodes-base.hubspot",
          description: "Creates or updates contact in HubSpot",
          parameters: {
            resource: "contact",
            operation: "upsert",
            email: "={{ $json.payload.customer.email }}",
            properties: {
              firstname: "={{ $json.payload.customer.name }}",
              onboarding_completed: "true",
              onboarding_flow: "={{ $json.payload.onboarding.name }}",
              completion_date: "={{ $json.payload.completedAt }}"
            }
          }
        }
      ]
    },
    setup_instructions: [
      "1. Create a new workflow in n8n",
      "2. Add a Webhook trigger node",
      "3. Copy the webhook URL",
      "4. Configure the webhook in Onboardly for 'onboarding.completed'",
      "5. Add your CRM node (HubSpot, Salesforce, etc.)",
      "6. Configure the CRM node with your API credentials",
      "7. Map the customer data to CRM fields",
      "8. Test the integration"
    ]
  },

  // Example 4: Multi-step automation with conditions
  ADVANCED_CUSTOMER_JOURNEY: {
    name: "Advanced Customer Journey Automation",
    description: "Complex workflow that handles different customer types and actions",
    workflow: {
      nodes: [
        {
          name: "Customer Signup Webhook",
          type: "n8n-nodes-base.webhook",
          description: "Receives customer signup data"
        },
        {
          name: "Check Customer Type",
          type: "n8n-nodes-base.if",
          description: "Routes based on customer type",
          parameters: {
            conditions: {
              string: [
                {
                  value1: "={{ $json.customer_type }}",
                  operation: "equal",
                  value2: "enterprise"
                }
              ]
            }
          }
        },
        {
          name: "Add to Enterprise Onboarding",
          type: "n8n-nodes-base.httpRequest",
          description: "For enterprise customers",
          parameters: {
            url: "https://your-onboardly.com/api/actions/add-customer-to-onboarding",
            method: "POST",
            body: {
              email: "={{ $json.email }}",
              name: "={{ $json.name }}",
              onboardingId: "ENTERPRISE_ONBOARDING_ID"
            }
          }
        },
        {
          name: "Add to Standard Onboarding",
          type: "n8n-nodes-base.httpRequest",
          description: "For standard customers",
          parameters: {
            url: "https://your-onboardly.com/api/actions/add-customer-to-onboarding",
            method: "POST",
            body: {
              email: "={{ $json.email }}",
              name: "={{ $json.name }}",
              onboardingId: "STANDARD_ONBOARDING_ID"
            }
          }
        },
        {
          name: "Notify Sales Team",
          type: "n8n-nodes-base.slack",
          description: "Notify sales for enterprise customers only"
        }
      ]
    },
    setup_instructions: [
      "1. Create a new workflow in n8n",
      "2. Add a Webhook trigger node",
      "3. Add an IF node to check customer type",
      "4. Create two branches for different onboarding flows",
      "5. Add HTTP Request nodes for each branch",
      "6. Configure different onboarding IDs for each customer type",
      "7. Add notification nodes as needed",
      "8. Test with different customer types"
    ]
  }
};

// Helper function to generate n8n workflow JSON
export function generateN8nWorkflow(example: keyof typeof N8N_WORKFLOW_EXAMPLES) {
  const workflowExample = N8N_WORKFLOW_EXAMPLES[example];
  
  return {
    name: workflowExample.name,
    nodes: workflowExample.workflow.nodes.map((node, index) => ({
      ...node,
      id: `node_${index}`,
      position: [index * 200, 100],
      typeVersion: 1
    })),
    connections: generateConnections(workflowExample.workflow.nodes.length),
    active: false,
    settings: {},
    staticData: null
  };
}

// Generate connections between nodes
function generateConnections(nodeCount: number) {
  const connections: any = {};
  
  for (let i = 0; i < nodeCount - 1; i++) {
    connections[`node_${i}`] = {
      main: [[{ node: `node_${i + 1}`, type: "main", index: 0 }]]
    };
  }
  
  return connections;
}

// API endpoint examples for documentation
export const API_EXAMPLES = {
  ADD_CUSTOMER_TO_ONBOARDING: {
    method: "POST",
    url: "/api/actions/add-customer-to-onboarding",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    },
    body: {
      email: "customer@example.com",
      name: "John Doe",
      onboardingId: "uuid-of-onboarding-flow"
    },
    response: {
      success: true,
      data: {
        customer: {
          id: "customer-uuid",
          email: "customer@example.com",
          name: "John Doe"
        },
        customerOnboarding: {
          id: "customer-onboarding-uuid",
          status: "ACTIVE",
          current_step: 0
        }
      }
    }
  },

  GET_ONBOARDING_DETAILS: {
    method: "GET",
    url: "/api/actions/onboarding/{onboardingId}",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY"
    },
    response: {
      success: true,
      data: {
        id: "onboarding-uuid",
        name: "Welcome Flow",
        steps: [
          {
            type: "EMAIL",
            content: {
              subject: "Welcome!",
              body: "Welcome to our platform..."
            },
            order: 0
          }
        ]
      }
    }
  },

  GET_CUSTOMER_PROGRESS: {
    method: "GET",
    url: "/api/actions/customer-progress?email=customer@example.com",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY"
    },
    response: {
      success: true,
      data: {
        customer: {
          email: "customer@example.com",
          name: "John Doe"
        },
        progress: [
          {
            onboarding_name: "Welcome Flow",
            status: "ACTIVE",
            current_step: 2,
            total_steps: 5,
            progress_percentage: 40
          }
        ]
      }
    }
  }
};

// Webhook payload examples
export const WEBHOOK_PAYLOAD_EXAMPLES = {
  ONBOARDING_COMPLETED: {
    event: "onboarding.completed",
    payload: {
      customer: {
        email: "customer@example.com",
        name: "John Doe"
      },
      onboarding: {
        id: "onboarding-uuid",
        name: "Welcome Flow"
      },
      completedAt: "2024-01-15T10:30:00Z"
    },
    timestamp: "2024-01-15T10:30:00Z"
  },

  CUSTOMER_ADDED: {
    event: "customer.added",
    payload: {
      customer: {
        email: "customer@example.com",
        name: "John Doe"
      },
      onboarding: {
        id: "onboarding-uuid",
        name: "Welcome Flow"
      },
      addedAt: "2024-01-15T10:00:00Z"
    },
    timestamp: "2024-01-15T10:00:00Z"
  },

  STEP_COMPLETED: {
    event: "step.completed",
    payload: {
      customer: {
        email: "customer@example.com",
        name: "John Doe"
      },
      onboarding: {
        id: "onboarding-uuid",
        name: "Welcome Flow"
      },
      step: {
        type: "EMAIL",
        content: {
          subject: "Welcome!",
          body: "Welcome to our platform..."
        },
        order: 0
      },
      completedAt: "2024-01-15T10:15:00Z"
    },
    timestamp: "2024-01-15T10:15:00Z"
  }
};

