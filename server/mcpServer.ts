import { store } from './store';

export interface JSONRPCRequest {
  jsonrpc: string;
  id?: string | number | null;
  method: string;
  params?: any;
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export const MCP_TOOLS = [
  {
    name: 'neosapien_search_memories',
    description: 'Search personal context, habits, preferences, and background knowledge in NeoSapien memory store.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query or name of the person/topic (e.g. "Rahul", "scheduling preferences")'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'neosapien_get_transcripts',
    description: 'Retrieve previous call/meeting transcripts and conversation summaries stored in NeoSapien.',
    inputSchema: {
      type: 'object',
      properties: {
        personName: {
          type: 'string',
          description: 'Name of the participant to find past syncs with (e.g. "Rahul")'
        }
      },
      required: ['personName']
    }
  },
  {
    name: 'neosapien_get_reminders',
    description: 'List existing reminders and scheduled context alerts from NeoSapien.',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Optional filter: "pending" | "completed"'
        }
      }
    }
  },
  {
    name: 'neosapien_store_reminder',
    description: 'Save a new contextual reminder into NeoSapien memory for preparation or follow-ups.',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The reminder action text (e.g. "Prep VPC peering slides for Rahul")'
        },
        dueDate: {
          type: 'string',
          description: 'Date format YYYY-MM-DD'
        },
        time: {
          type: 'string',
          description: 'Time string HH:MM'
        },
        relatedTo: {
          type: 'string',
          description: 'Person or project this reminder relates to'
        },
        category: {
          type: 'string',
          description: 'Category: "Preparation" | "Follow-up" | "General"'
        }
      },
      required: ['title']
    }
  },
  {
    name: 'neosapien_add_memory',
    description: 'Add a newly learned preference, contact detail, or context into permanent memory.',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        personName: { type: 'string' },
        category: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } }
      },
      required: ['title', 'content']
    }
  }
];

export const CUSTOM_PROJECT_TOOLS = [
  {
    name: 'custom_query_techsodh',
    description: 'Query TechSodh AI Document Intelligence platform: inspect OCR pipeline status, Gujarati/English model benchmarks, and API metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Query topic: "benchmarks", "status", or "endpoints"' }
      }
    }
  },
  {
    name: 'custom_query_myentrypass',
    description: 'Query MyEntryPass visitor credentialing & QR access control system status.',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', description: 'Action: "status" or "verify"' }
      }
    }
  },
  {
    name: 'custom_query_scet_portal',
    description: 'Query SCET (Sarvajanik College of Engineering and Technology) academic portal for submission checklists, guide signoffs, and audit deadlines.',
    inputSchema: {
      type: 'object',
      properties: {
        documentName: { type: 'string', description: 'Name of document, e.g. "semester_project"' }
      }
    }
  }
];

export const WORKSPACE_TOOLS = [
  {
    name: 'workspace_check_calendar_availability',
    description: 'Check Google Calendar for conflicting events and available time slots.',
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Target date YYYY-MM-DD' },
        preferredTime: { type: 'string', description: 'e.g. "14:00" (2 PM)' }
      },
      required: ['date']
    }
  },
  {
    name: 'workspace_create_calendar_event',
    description: 'Create an official Google Calendar event with attendees, description, and auto-generated Google Meet video conference link.',
    inputSchema: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'Meeting title' },
        description: { type: 'string', description: 'Meeting agenda and context' },
        startTime: { type: 'string', description: 'ISO string or YYYY-MM-DDTHH:MM:SSZ' },
        endTime: { type: 'string', description: 'ISO string or YYYY-MM-DDTHH:MM:SSZ' },
        attendeeName: { type: 'string' },
        attendeeEmail: { type: 'string' }
      },
      required: ['summary', 'startTime', 'endTime', 'attendeeEmail']
    }
  },
  {
    name: 'workspace_send_gmail',
    description: 'Send a professional confirmation and invitation email via Gmail with agenda and Meet link.',
    inputSchema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject line' },
        body: { type: 'string', description: 'Email body text' },
        meetLink: { type: 'string', description: 'Google Meet link' }
      },
      required: ['to', 'subject', 'body']
    }
  }
];

export function handleNeoSapienMCPRequest(req: JSONRPCRequest): JSONRPCResponse {
  const id = req.id !== undefined ? req.id : null;

  try {
    switch (req.method) {
      case 'ping':
        return { jsonrpc: '2.0', id, result: { status: 'ok', server: 'NeoSapien MCP Server v1.4.2' } };

      case 'tools/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            tools: [...MCP_TOOLS, ...CUSTOM_PROJECT_TOOLS, ...WORKSPACE_TOOLS]
          }
        };

      case 'tools/call': {
        const { name, arguments: args } = req.params || {};
        let toolResult: any = null;

        if (name === 'neosapien_search_memories') {
          const query = args?.query || '';
          toolResult = store.searchMemories(query);
        } else if (name === 'neosapien_get_transcripts') {
          const person = args?.personName || '';
          toolResult = store.getTranscriptsForPerson(person);
        } else if (name === 'neosapien_get_reminders') {
          const status = args?.status;
          toolResult = status ? store.reminders.filter(r => r.status === status) : store.reminders;
        } else if (name === 'neosapien_store_reminder') {
          toolResult = store.addReminder({
            title: args.title,
            dueDate: args.dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
            time: args.time || '13:45',
            relatedTo: args.relatedTo || 'Rahul',
            status: 'pending',
            category: args.category || 'Preparation'
          });
        } else if (name === 'neosapien_add_memory') {
          toolResult = store.addMemory({
            title: args.title,
            content: args.content,
            personName: args.personName,
            category: args.category || 'general',
            tags: args.tags || ['general']
          });
        } else if (name === 'custom_query_techsodh') {
          toolResult = store.customProjects.find(p => p.name === 'TechSodh');
        } else if (name === 'custom_query_myentrypass') {
          toolResult = store.customProjects.find(p => p.name === 'MyEntryPass');
        } else if (name === 'custom_query_scet_portal') {
          toolResult = {
            portal: 'SCET Academic Review',
            project: 'Glacier Monitoring & AI Automation',
            nextDeadline: 'Next Monday 11:00 AM (Document Submission)',
            documentsRequired: ['Project Synopsis', 'Faculty Guide Signoff', 'Lab Attendance Log']
          };
        } else {
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32601, message: `Tool not found: ${name}` }
          };
        }

        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(toolResult, null, 2)
              }
            ]
          }
        };
      }

      case 'resources/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            resources: [
              {
                uri: 'neosapien://memories/recent',
                name: 'Recent Personal Context & Memories',
                mimeType: 'application/json'
              },
              {
                uri: 'neosapien://transcripts/recent',
                name: 'Recent Meeting Transcripts',
                mimeType: 'application/json'
              },
              {
                uri: 'neosapien://reminders/active',
                name: 'Active Reminders',
                mimeType: 'application/json'
              }
            ]
          }
        };

      case 'resources/read': {
        const uri = req.params?.uri;
        let content = '';
        if (uri === 'neosapien://memories/recent') {
          content = JSON.stringify(store.memories.slice(0, 5), null, 2);
        } else if (uri === 'neosapien://transcripts/recent') {
          content = JSON.stringify(store.transcripts.slice(0, 3), null, 2);
        } else if (uri === 'neosapien://reminders/active') {
          content = JSON.stringify(store.reminders.filter(r => r.status === 'pending'), null, 2);
        } else {
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: `Resource URI not found: ${uri}` }
          };
        }
        return {
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: content
              }
            ]
          }
        };
      }

      case 'prompts/list':
        return {
          jsonrpc: '2.0',
          id,
          result: {
            prompts: [
              {
                name: 'schedule_meeting_with_context',
                description: 'Orchestrates meeting scheduling by reading NeoSapien context before Google Calendar booking.',
                arguments: [
                  { name: 'person', description: 'Person to schedule with', required: true },
                  { name: 'timeframe', description: 'Target date or relative timeframe', required: false }
                ]
              }
            ]
          }
        };

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not supported: ${req.method}` }
        };
    }
  } catch (err: any) {
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32603, message: err?.message || 'Internal MCP Error' }
    };
  }
}
