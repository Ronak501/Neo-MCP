export type MemoryCategory = 'contact' | 'habit' | 'preference' | 'project' | 'general' | 'academic';

export interface NeoSapienMemory {
  id: string;
  category: MemoryCategory;
  title: string;
  content: string;
  personName?: string;
  tags: string[];
  updatedAt: string;
}

export interface NeoSapienTranscript {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
}

export interface NeoSapienReminder {
  id: string;
  title: string;
  dueDate: string;
  time: string;
  relatedTo?: string;
  status: 'pending' | 'completed';
  category: string;
  createdAt: string;
}

export interface WorkspaceEvent {
  id: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  location?: string;
  meetLink: string;
  attendees: Array<{ name: string; email: string }>;
  status: 'confirmed' | 'tentative';
}

export interface WorkspaceEmail {
  id: string;
  to: string[];
  subject: string;
  body: string;
  sentAt: string;
  meetLink?: string;
}

export interface CustomProjectData {
  id: string;
  name: 'TechSodh' | 'MyEntryPass' | 'SCET' | 'GlacierProject';
  description: string;
  status: string;
  recentActivity: string;
  endpoints: string[];
}

export type StepType = 
  | 'user_input'
  | 'gemini_agent'
  | 'mcp_router'
  | 'neosapien_mcp'
  | 'workspace_mcp'
  | 'custom_mcp'
  | 'security_guardrail'
  | 'action_result';

export interface AgentTraceStep {
  id: string;
  title: string;
  subtitle: string;
  type: StepType;
  status: 'idle' | 'running' | 'completed' | 'error';
  timestamp: string;
  durationMs?: number;
  data?: any;
  mcpPayload?: {
    method: string;
    params?: any;
    result?: any;
  };
}

export interface ActionConfirmationRequest {
  id: string;
  action: 'send_email' | 'create_calendar_event' | 'delete_event' | 'external_sync';
  title: string;
  description: string;
  params: Record<string, any>;
  requiresApproval: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'auto_bypassed';
  riskLevel: 'low' | 'medium' | 'high';
  autoRunBypassed?: boolean;
}

export interface AgentMeetingRecord {
  id: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  meetLink: string;
  attendees: Array<{ name: string; email: string }>;
  triggerPrompt: string;
  source: 'ambient_voice' | 'typed_prompt' | 'one_click_scenario' | 'skill_suite';
  scheduledAt: string;
  autoRunBypassed: boolean;
  status: 'confirmed' | 'scheduled' | 'approved';
  latencyMs: number;
  relatedProject?: string;
  reminderCreated?: string;
  emailDispatched?: string;
}

export interface MeetingCapabilityMetrics {
  totalMeetingsSet: number;
  autoRunExecutions: number;
  zeroClickRatePercent: number;
  topCollaborators: Array<{ name: string; email: string; count: number; role?: string }>;
  avgSchedulingLatencyMs: number;
  estimatedTimeSavedMinutes: number;
  meetLinksGenerated: number;
  invitesDispatched: number;
  remindersCreated: number;
}

export interface DailyBriefing {
  greeting: string;
  date: string;
  schedule: Array<{ time: string; title: string; meetLink?: string }>;
  reminders: Array<{ title: string; time: string }>;
  unreadEmails: Array<{ from: string; subject: string; summary: string }>;
  agentNote: string;
}

export interface AgentRunResponse {
  success: boolean;
  prompt: string;
  intentType: 'schedule_meeting' | 'create_reminder' | 'query_memory' | 'query_transcript' | 'daily_briefing' | 'general' | 'meeting_history' | 'calendar';
  flowState: {
    intent: string;
    person?: string;
    topic?: string;
    suggestedTime?: string;
    contextFound: boolean;
    hitlRequired: boolean;
    autoRunMode?: boolean;
    riskLevel?: 'low' | 'medium' | 'high';
  };
  steps: AgentTraceStep[];
  actionResult: {
    meetingCreated: WorkspaceEvent | null;
    reminderStored: NeoSapienReminder | null;
    emailSent: WorkspaceEmail | null;
    directAnswer?: string;
    dailyBriefing?: DailyBriefing | null;
    summary: string;
    confirmation?: ActionConfirmationRequest | null;
  };
  executionTimeMs: number;
  usingRealGemini: boolean;
}

export interface MCPToolDeclaration {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}
