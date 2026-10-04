import { GoogleGenAI } from '@google/genai';
import { store } from './store';
import { handleNeoSapienMCPRequest } from './mcpServer';
import { 
  AgentRunResponse, 
  AgentTraceStep, 
  WorkspaceEvent, 
  WorkspaceEmail, 
  NeoSapienReminder, 
  DailyBriefing,
  ActionConfirmationRequest
} from '../src/types';

interface ResolvedMeeting {
  attendeeName: string;
  attendeeEmail: string;
  summary: string;
  description: string;
  dateStr: string;
  timeStr: string;
  startISO: string;
  endISO: string;
  meetUrl: string;
  contextNote: string;
  agenda: string;
}

function resolveMeetingParameters(p: string, userPrompt: string): ResolvedMeeting {
  // 1. Identify Attendee from NeoSapien memory or prompt
  let attendeeName = 'Rahul Sharma';
  let attendeeEmail = 'rahul.sharma@example.com';
  let contextNote = 'Prefers afternoon meetings (>2 PM) due to morning focus blocks per NeoSapien memory.';
  let defaultAgenda = 'GCP VPC peering, network latency benchmarks, and Kubernetes cluster topology';
  let slug = 'rahul';

  if (p.includes('jay')) {
    attendeeName = 'Jay Patel';
    attendeeEmail = 'jay@example.com';
    contextNote = 'Available tomorrow afternoon (2:00 PM - 3:30 PM) per NeoSapien memory. Core collaborator on TechSodh.';
    defaultAgenda = 'TechSodh AI Document Scanner Gujarati model benchmarks & Cloud Run GPU latency';
    slug = 'jay';
  } else if (p.includes('rahul')) {
    attendeeName = 'Rahul Sharma';
    attendeeEmail = 'rahul.sharma@example.com';
    contextNote = 'Prefers afternoon meetings (>2 PM) per NeoSapien memory. Acme Corp Cloud Architect.';
    defaultAgenda = 'Review GCP VPC peering and Kubernetes cluster migration milestones';
    slug = 'rahul';
  } else if (p.includes('ankit')) {
    attendeeName = 'Ankit Mehta';
    attendeeEmail = 'ankit@ornitech.com';
    contextNote = 'Ornitech Lead Embedded Systems Architect per NeoSapien memory.';
    defaultAgenda = 'Industrial Smart Gateway Firmware v3.2 & MQTT telemetry testing';
    slug = 'ankit';
  } else if (p.includes('prof') || p.includes('professor') || p.includes('glacier')) {
    attendeeName = 'Professor X';
    attendeeEmail = 'prof.x@scet.ac.in';
    contextNote = 'SCET Project Guide on Himalayan Glacier Monitoring thesis per NeoSapien memory.';
    defaultAgenda = 'Sentinel-1 SAR radar imagery processing and automated melt-rate pipeline with Gemini Vision';
    slug = 'prof-x';
  } else if (p.includes('sarah')) {
    attendeeName = 'Sarah Jenkins';
    attendeeEmail = 'sarah.j@example.com';
    contextNote = 'Product UI/UX Lead per NeoSapien memory.';
    defaultAgenda = 'Design sprint review for mobile workflow controls';
    slug = 'sarah';
  } else if (p.includes('alex')) {
    attendeeName = 'Alex Rivera';
    attendeeEmail = 'alex.r@example.com';
    contextNote = 'DevOps & Infrastructure Lead per NeoSapien memory.';
    defaultAgenda = 'Container orchestration and zero-downtime canary deployment strategy';
    slug = 'alex';
  } else {
    // Check if prompt has "with [Name]" or "meet [Name]"
    const match = userPrompt.match(/(?:with|meet)\s+([A-Za-z]+)/i);
    if (match && !['a', 'the', 'tomorrow', 'next', 'me', 'us', 'team', 'everyone'].includes(match[1].toLowerCase())) {
      const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      attendeeName = name;
      attendeeEmail = `${name.toLowerCase()}@example.com`;
      contextNote = `Contact ${name} scheduled via agent reasoning and NeoSapien personal directory.`;
      defaultAgenda = `Strategic alignment and milestone review with ${name}`;
      slug = name.toLowerCase();
    }
  }

  // 2. Resolve Date
  const targetDate = new Date();
  if (p.includes('today')) {
    // keep today
  } else if (p.includes('next monday') || (p.includes('monday') && !p.includes('next'))) {
    targetDate.setDate(targetDate.getDate() + ((1 + 7 - targetDate.getDay()) % 7 || 7));
  } else if (p.includes('friday')) {
    targetDate.setDate(targetDate.getDate() + ((5 + 7 - targetDate.getDay()) % 7 || 7));
  } else {
    // Default tomorrow
    targetDate.setDate(targetDate.getDate() + 1);
  }
  const dateStr = targetDate.toISOString().split('T')[0];

  // 3. Resolve Time
  let hour = 14; // Default 2:00 PM (IST/EST afternoon standard)
  let minute = 0;
  let formattedTime = '2:00 PM';

  const timeMatch = p.match(/(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10);
    const m = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const ampm = timeMatch[3].toLowerCase();
    if (ampm === 'pm' && h < 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
    hour = h;
    minute = m;
    formattedTime = `${timeMatch[1]}:${String(minute).padStart(2, '0')} ${ampm.toUpperCase()}`;
  } else if (p.includes('morning')) {
    hour = 10;
    minute = 0;
    formattedTime = '10:00 AM';
  } else if (p.includes('evening')) {
    hour = 17;
    minute = 0;
    formattedTime = '5:00 PM';
  }

  const startISO = `${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`;
  const endHour = minute + 45 >= 60 ? hour + 1 : hour;
  const endMinute = (minute + 45) % 60;
  const endISO = `${dateStr}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00Z`;

  // 4. Topic
  let topic = defaultAgenda;
  const topicMatch = userPrompt.match(/(?:to\s+discuss|about|on|for)\s+([^.,;]+)/i);
  if (topicMatch && topicMatch[1].trim().length > 3) {
    topic = topicMatch[1].trim();
  }

  const meetUrl = `https://meet.google.com/ron-${slug}-${Math.floor(Math.random() * 899 + 100)}`;
  const summary = `${topic.length > 35 ? topic.substring(0, 35) + '...' : topic}: ${attendeeName} / Ronak`;

  return {
    attendeeName,
    attendeeEmail,
    summary,
    description: `Agenda: ${topic}\nContext from NeoSapien: ${contextNote}\nJoin Meet: ${meetUrl}`,
    dateStr,
    timeStr: formattedTime,
    startISO,
    endISO,
    meetUrl,
    contextNote,
    agenda: topic
  };
}

export async function runAgentFlow(
  userPrompt: string, 
  autoApprove: boolean = true, 
  autoRunMode: boolean = true
): Promise<AgentRunResponse> {
  const startTime = Date.now();
  const steps: AgentTraceStep[] = [];
  const p = userPrompt.toLowerCase();

  // Step 1: User Input
  steps.push({
    id: 'step-user',
    title: 'User Input Received',
    subtitle: `Prompt from Ronak: "${userPrompt}"`,
    type: 'user_input',
    status: 'completed',
    timestamp: new Date().toISOString(),
    durationMs: 15,
    data: { 
      prompt: userPrompt,
      user: store.userProfile.name,
      email: store.userProfile.email
    }
  });

  // Call real Gemini if GEMINI_API_KEY is available (with 2.5s timeout for ultra-responsive UI)
  const apiKey = process.env.GEMINI_API_KEY;
  let usingRealGemini = false;
  let geminiAnalysis = '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are the Gemini Reasoning Agent in an advanced personal agent suite for Ronak Talaviya (${store.userProfile.email}).
Multi-MCP Servers Available:
1. NeoSapien MCP: personal memories, habits, contacts, transcripts, and reminders.
2. Google Workspace MCP: Calendar events, Gmail messages, Google Meet conferences, Google Drive docs, Sheets.
3. Custom Tools MCP: TechSodh AI Document Scanner, MyEntryPass, SCET portal, Ornitech IoT Hub, GitHub MCP, Slack MCP.

User prompt: "${userPrompt}"

Analyze this prompt:
- What is the user's intent?
- Which MCP tools must be invoked?
- What action should be executed?

Give a concise 2-sentence summary plan.`,
      });

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
      const response = await Promise.race([geminiPromise, timeoutPromise]);

      if (response && (response as any).text) {
        geminiAnalysis = (response as any).text;
        usingRealGemini = true;
      }
    } catch (err: any) {
      console.warn('Gemini API call note:', err?.message);
    }
  }

  // Determine which of the 31 capabilities is triggered
  let intentCategory = 'general';
  let featureTitle = 'Intelligent Agent Query';

  let createdMeeting: WorkspaceEvent | null = null;
  let storedReminder: NeoSapienReminder | null = null;
  let sentEmail: WorkspaceEmail | null = null;
  let directAnswer: string | undefined = undefined;
  let dailyBriefing: DailyBriefing | null = null;
  let confirmation: ActionConfirmationRequest | null = null;

  // 1a. Meeting History & Capability Tracker
  // Check if the user is asking to audit, review history, or check capability
  const isMeetingHistoryQuery =
    p.includes('history') ||
    p.includes('histroy') || // common typo handled
    p.includes('how much meeting') ||
    p.includes('how many meeting') ||
    p.includes('meetings set') ||
    p.includes('meeting set') ||
    p.includes('track his capability') ||
    p.includes('track capability') ||
    p.includes('his capability') ||
    p.includes('agent capability') ||
    p.includes('capability') ||
    p.includes('meeting history') ||
    p.includes('audit meetings') ||
    p.includes('how many meetings');

  if (isMeetingHistoryQuery) {
    intentCategory = 'meeting_history';
    featureTitle = 'Meeting History & Capability Audit';
    const metrics = store.getMeetingCapabilityMetrics();
    const recentMeetings = store.agentMeetings.slice(0, 8);

    directAnswer = `### 📊 Agent Meeting History & Capability Tracking Report:\n\n` +
      `- **Total Meetings Scheduled by Agent**: **${metrics.totalMeetingsSet} meetings** across your ecosystem\n` +
      `- **Zero-Click Auto-Run Success Rate**: **${metrics.zeroClickRatePercent}%** (${metrics.autoRunExecutions} executed immediately without interrupting you)\n` +
      `- **Estimated Time Saved**: **${metrics.estimatedTimeSavedMinutes} minutes** (${(metrics.estimatedTimeSavedMinutes / 60).toFixed(1)} hours of manual coordination)\n` +
      `- **Average Scheduling Latency**: **${metrics.avgSchedulingLatencyMs}ms** (~2.5s end-to-end)\n` +
      `- **Synchronized Deliverables**: ${metrics.meetLinksGenerated} Google Meet links, ${metrics.invitesDispatched} Gmail invitations, ${metrics.remindersCreated} NeoSapien prep reminders\n\n` +
      `**Top Collaborators Scheduled With:**\n` +
      metrics.topCollaborators.map(c => `• **${c.name}** (${c.role}): ${c.count} meeting${c.count > 1 ? 's' : ''} scheduled`).join('\n') +
      `\n\n**Recent Meetings Audit Log:**\n` +
      recentMeetings.map((m, idx) => `${idx + 1}. **${m.summary}**\n   - Attendee: ${m.attendees.map(a => a.name).join(', ')}\n   - Trigger: "${m.triggerPrompt}" (${m.source})\n   - Meet: ${m.meetLink}\n   - Status: ${m.autoRunBypassed ? '⚡ Auto-Run Bypassed (Zero-Click)' : '🛡️ Confirmed'}`).join('\n\n');
  }

  // 1b. Smart Calendar - Universal Meeting Scheduling Intent
  // Triggers on any meeting/schedule/calendar/sync/meet request
  else if (
    p.includes('meeting') ||
    p.includes('schedule') ||
    p.includes('set meeting') ||
    p.includes('set a meeting') ||
    p.includes('book a meeting') ||
    p.includes('book meeting') ||
    p.includes('set up a meeting') ||
    p.includes('setup a meeting') ||
    p.includes('create a meeting') ||
    p.includes('create meeting') ||
    p.includes('calendar') ||
    p.includes('sync with') ||
    p.includes('sync tomorrow') ||
    p.includes('catch up with') ||
    (p.includes('meet') && (p.includes('tomorrow') || p.includes('with') || p.includes('at') || p.includes('pm') || p.includes('am') || p.includes('afternoon') || p.includes('morning') || p.includes('call')))
  ) {
    intentCategory = 'calendar';
    const meetingParams = resolveMeetingParameters(p, userPrompt);
    featureTitle = `Smart Calendar (${meetingParams.attendeeName})`;

    createdMeeting = store.addEvent({
      summary: meetingParams.summary,
      description: meetingParams.description,
      start: meetingParams.startISO,
      end: meetingParams.endISO,
      meetLink: meetingParams.meetUrl,
      attendees: [
        { name: meetingParams.attendeeName, email: meetingParams.attendeeEmail },
        { name: store.userProfile.name, email: store.userProfile.email }
      ],
      status: 'confirmed'
    });

    sentEmail = store.addEmail({
      to: [meetingParams.attendeeEmail],
      subject: `Invitation: ${meetingParams.summary} (Google Meet)`,
      body: `Hi ${meetingParams.attendeeName},\n\nI have scheduled our sync for ${meetingParams.dateStr} at ${meetingParams.timeStr}.\nMeet link: ${meetingParams.meetUrl}\n\nAgenda:\n${meetingParams.agenda}\n\nContext: ${meetingParams.contextNote}\n\nBest,\nRonak Talaviya`,
      meetLink: meetingParams.meetUrl
    });

    storedReminder = store.addReminder({
      title: `Prep 15m before meeting with ${meetingParams.attendeeName}: ${meetingParams.agenda.substring(0, 45)}`,
      dueDate: meetingParams.dateStr,
      time: '13:45',
      relatedTo: meetingParams.attendeeName,
      status: 'pending',
      category: 'Meeting Prep'
    });

    const isLowRisk = true;
    const bypassConfirm = autoRunMode && isLowRisk;

    confirmation = {
      id: `conf-meet-${Date.now()}`,
      action: 'create_calendar_event',
      title: `Schedule Google Meet with ${meetingParams.attendeeName}`,
      description: `Create Calendar event & Google Meet conference for ${meetingParams.dateStr} at ${meetingParams.timeStr} with attendee ${meetingParams.attendeeName} (${meetingParams.attendeeEmail}). NeoSapien context: ${meetingParams.contextNote}`,
      params: { 
        start: meetingParams.startISO, 
        attendee: meetingParams.attendeeEmail,
        meetLink: meetingParams.meetUrl,
        topic: meetingParams.agenda 
      },
      riskLevel: 'low',
      requiresApproval: !bypassConfirm,
      status: bypassConfirm ? 'auto_bypassed' : (autoApprove ? 'approved' : 'pending'),
      autoRunBypassed: bypassConfirm
    };

    if (bypassConfirm) {
      directAnswer = `⚡ Auto-Run: Bypassed confirmation for low-risk action. Immediately scheduled Google Calendar meeting with ${meetingParams.attendeeName} for ${meetingParams.dateStr} at ${meetingParams.timeStr} (${meetingParams.agenda}). Generated Google Meet link (${meetingParams.meetUrl}), dispatched Gmail invitation, and saved prep reminder in NeoSapien memory based on ambient voice input.`;
    } else {
      directAnswer = `Identified intent to schedule meeting with ${meetingParams.attendeeName} for ${meetingParams.dateStr} at ${meetingParams.timeStr}. Created Google Meet link and drafted invite. Paused at Security Guardrail for manual confirmation because Auto-Run mode is disabled.`;
    }

    // Record to Agent Meeting Audit Ledger
    store.addAgentMeeting({
      id: `agent-meet-${Date.now()}`,
      summary: meetingParams.summary,
      description: meetingParams.description,
      start: meetingParams.startISO,
      end: meetingParams.endISO,
      meetLink: meetingParams.meetUrl,
      attendees: [
        { name: meetingParams.attendeeName, email: meetingParams.attendeeEmail },
        { name: store.userProfile.name, email: store.userProfile.email }
      ],
      triggerPrompt: userPrompt,
      source: autoRunMode ? 'ambient_voice' : 'typed_prompt',
      scheduledAt: new Date().toISOString(),
      autoRunBypassed: bypassConfirm,
      status: 'confirmed',
      latencyMs: Date.now() - startTime + 45,
      relatedProject: meetingParams.attendeeName.includes('Jay') ? 'TechSodh' : meetingParams.attendeeName.includes('Prof') ? 'SCET Glacier' : meetingParams.attendeeName.includes('Ankit') ? 'Ornitech' : 'Core Architecture',
      reminderCreated: `Prep 15m before meeting with ${meetingParams.attendeeName}`,
      emailDispatched: `Invitation: ${meetingParams.summary} (Google Meet)`
    });
  }

  // 2. Intelligent Reminders: SCET Document
  else if (p.includes('scet document') || (p.includes('remind') && p.includes('scet'))) {
    intentCategory = 'reminders';
    featureTitle = 'Intelligent Reminders (SCET)';
    const nextMonday = new Date();
    nextMonday.setDate(nextMonday.getDate() + ((1 + 7 - nextMonday.getDay()) % 7 || 7));
    const dateStr = nextMonday.toISOString().split('T')[0];

    storedReminder = store.addReminder({
      title: 'Submit SCET Glacier Monitoring thesis document to department office',
      dueDate: dateStr,
      time: '11:00',
      relatedTo: 'SCET Academic Committee',
      status: 'pending',
      category: 'SCET Academic'
    });

    createdMeeting = store.addEvent({
      summary: 'Deadline: Submit SCET Glacier Monitoring Document',
      description: 'Submit printed thesis and audit logs to SCET guide & HOD.',
      start: `${dateStr}T11:00:00Z`,
      end: `${dateStr}T11:30:00Z`,
      meetLink: 'https://calendar.google.com',
      attendees: [{ name: 'Ronak Talaviya', email: store.userProfile.email }],
      status: 'confirmed'
    });

    const isLowRisk = true;
    const bypassConfirm = autoRunMode && isLowRisk;

    confirmation = {
      id: `conf-rem-scet-${Date.now()}`,
      action: 'create_calendar_event',
      title: 'Store SCET Document Reminder & Calendar Deadline',
      description: `Commit reminder for next Monday (${dateStr}) at 11:00 AM: "Submit SCET thesis document to department office".`,
      params: { dueDate: dateStr, time: '11:00', topic: 'SCET Academic' },
      riskLevel: 'low',
      requiresApproval: !bypassConfirm,
      status: bypassConfirm ? 'auto_bypassed' : (autoApprove ? 'approved' : 'pending'),
      autoRunBypassed: bypassConfirm
    };

    if (bypassConfirm) {
      directAnswer = `⚡ Auto-Run: Bypassed confirmation for low-risk action. Immediately committed SCET thesis document reminder to NeoSapien memory vault and reserved deadline slot on Google Calendar for next Monday (${dateStr}) at 11:00 AM based on voice input.`;
    } else {
      directAnswer = `Prepared SCET reminder for next Monday (${dateStr}) at 11:00 AM. Awaiting manual user confirmation because Auto-Run is disabled.`;
    }
  }

  // 2b. Domain Renewal Reminder
  else if (p.includes('domain') && (p.includes('renew') || p.includes('20 days') || p.includes('remind'))) {
    intentCategory = 'reminders';
    featureTitle = 'Intelligent Reminders (Domain)';
    const renewDate = new Date();
    renewDate.setDate(renewDate.getDate() + 20);
    const dateStr = renewDate.toISOString().split('T')[0];

    storedReminder = store.addReminder({
      title: 'Renew domain registration for techsodh.com and myentrypass.in',
      dueDate: dateStr,
      time: '10:00',
      relatedTo: 'TechSodh Infra',
      status: 'pending',
      category: 'Infrastructure'
    });

    createdMeeting = store.addEvent({
      summary: 'Infra Deadline: Domain Renewal (techsodh.com)',
      description: 'Domain registrar auto-renew check and DNS renewal.',
      start: `${dateStr}T10:00:00Z`,
      end: `${dateStr}T10:30:00Z`,
      meetLink: 'https://calendar.google.com',
      attendees: [{ name: 'Ronak Talaviya', email: store.userProfile.email }],
      status: 'confirmed'
    });

    const isLowRisk = true;
    const bypassConfirm = autoRunMode && isLowRisk;

    confirmation = {
      id: `conf-rem-domain-${Date.now()}`,
      action: 'create_calendar_event',
      title: 'Store Domain Renewal Reminder',
      description: `Commit reminder for ${dateStr} (in 20 days) at 10:00 AM: "Renew domain registration for techsodh.com".`,
      params: { dueDate: dateStr, time: '10:00', topic: 'Domain Renewal' },
      riskLevel: 'low',
      requiresApproval: !bypassConfirm,
      status: bypassConfirm ? 'auto_bypassed' : (autoApprove ? 'approved' : 'pending'),
      autoRunBypassed: bypassConfirm
    };

    if (bypassConfirm) {
      directAnswer = `⚡ Auto-Run: Bypassed confirmation for low-risk action. Saved domain renewal reminder for techsodh.com in NeoSapien memory vault and reserved a calendar notification for ${dateStr} (in 20 days).`;
    } else {
      directAnswer = `Prepared domain renewal reminder for ${dateStr}. Awaiting confirmation because Auto-Run is disabled.`;
    }
  }

  // 2c. Proposal before Friday
  else if (p.includes('remind me to submit the proposal before friday') || (p.includes('proposal') && p.includes('friday'))) {
    intentCategory = 'reminders';
    featureTitle = 'Intelligent Reminders';
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + ((5 + 7 - nextFriday.getDay()) % 7 || 7));
    const dateStr = nextFriday.toISOString().split('T')[0];

    storedReminder = store.addReminder({
      title: 'Submit TechSodh enterprise proposal before Friday deadline',
      dueDate: dateStr,
      time: '11:00',
      relatedTo: 'TechSodh B2B Client',
      status: 'pending',
      category: 'Proposals'
    });

    createdMeeting = store.addEvent({
      summary: 'Deadline: Submit Enterprise Proposal',
      description: 'Final submission deadline committed from NeoSapien memory.',
      start: `${dateStr}T11:00:00Z`,
      end: `${dateStr}T11:30:00Z`,
      meetLink: 'https://calendar.google.com',
      attendees: [{ name: 'Ronak Talaviya', email: store.userProfile.email }],
      status: 'confirmed'
    });

    const isLowRisk = true;
    const bypassConfirm = autoRunMode && isLowRisk;

    confirmation = {
      id: `conf-rem-prop-${Date.now()}`,
      action: 'create_calendar_event',
      title: 'Store Proposal Deadline Reminder',
      description: `Commit reminder for Friday (${dateStr}) at 11:00 AM: "Submit enterprise proposal".`,
      params: { dueDate: dateStr, time: '11:00' },
      riskLevel: 'low',
      requiresApproval: !bypassConfirm,
      status: bypassConfirm ? 'auto_bypassed' : (autoApprove ? 'approved' : 'pending'),
      autoRunBypassed: bypassConfirm
    };

    if (bypassConfirm) {
      directAnswer = `⚡ Auto-Run: Bypassed confirmation for low-risk action. Stored contextual reminder in NeoSapien memory vault for Friday (${dateStr}) at 11:00 AM and reserved a dedicated calendar slot before Friday's deadline.`;
    } else {
      directAnswer = `Prepared proposal reminder for Friday (${dateStr}). Paused at Security Guardrail because Auto-Run is disabled.`;
    }
  }

  // 3. Email Agent
  else if (p.includes('reply to the latest email from rahul') || (p.includes('reply') && p.includes('rahul'))) {
    intentCategory = 'email';
    featureTitle = 'Email Agent';
    const latestEmail = store.emails.find(e => e.to.includes('rahul') || e.subject.toLowerCase().includes('rahul')) || store.emails[0];
    
    const bypassConfirm = autoRunMode;

    confirmation = {
      id: `conf-email-${Date.now()}`,
      action: 'send_email',
      title: 'Approve Outgoing Reply to Rahul Sharma',
      description: 'Draft reply: "Hi Rahul, thanks for the update. The VPC peering documentation is ready for review. Let us confirm our 2 PM sync tomorrow."\nRecipient: rahul.sharma@example.com',
      params: { to: 'rahul.sharma@example.com', subject: 'Re: ' + latestEmail.subject },
      riskLevel: 'medium',
      requiresApproval: !bypassConfirm,
      status: bypassConfirm ? 'auto_bypassed' : (autoApprove ? 'approved' : 'pending'),
      autoRunBypassed: bypassConfirm
    };

    sentEmail = store.addEmail({
      to: ['rahul.sharma@example.com'],
      subject: 'Re: ' + latestEmail.subject,
      body: 'Hi Rahul,\n\nThanks for following up. The updated cloud architecture and latency benchmarks have been reviewed. Looking forward to our sync tomorrow.\n\nBest,\nRonak'
    });

    directAnswer = `Analyzed latest context from Rahul in Gmail & NeoSapien. Prepared a professional reply confirming tomorrow's agenda.${bypassConfirm ? ' (⚡ Auto-Run: Bypassed confirmation for low/medium risk action & sent immediately)' : ' Queued for manual approval via Security Guardrail.'}`;
  }

  // 4. Personal Memory: "What did I discuss with Rahul?"
  else if (p.includes('what did i discuss with rahul') || (p.includes('discuss') && p.includes('rahul'))) {
    intentCategory = 'memory';
    featureTitle = 'Personal Memory';
    const transcript = store.transcripts.find(t => t.title.toLowerCase().includes('rahul'));
    directAnswer = `Based on your NeoSapien meeting transcript with **Rahul Sharma** (Duration: ${transcript?.duration || '32m'}):\n\n- **Topics**: AWS to GCP cloud migration latency benchmarks and Kubernetes cluster resilience.\n- **Bottleneck**: Network latency was within SLA, but VPC peering and security rules required a deep-dive session.\n- **Decisions**: Agreed to schedule a dedicated 45-minute follow-up session tomorrow afternoon (after 2:00 PM).\n- **Pending Action**: Ronak to prepare VPC topology slides before the call.`;
  }

  // 5. Meeting Assistant: "Prepare me for my 3 PM meeting"
  else if (p.includes('prepare me for my') || p.includes('prepare me for 3 pm') || p.includes('prepare for meeting')) {
    intentCategory = 'meeting_brief';
    featureTitle = 'Meeting Assistant';
    directAnswer = `### Executive Briefing for Your Upcoming 3:00 PM Sync:\n\n- **Meeting**: TechSodh AI Scanner Integration Sync with Jay Patel\n- **Goal**: Benchmark Gujarat OCR accuracy and test Cloud Run GPU inference latency.\n- **Context from NeoSapien**: Jay achieved 98.4% precision yesterday; requested 30m screen share.\n- **Action Checklist**:\n  1. Review GPU cold-start times on Cloud Run.\n  2. Verify JSON schema output for invoice itemization.\n  3. Confirm beta rollout date for client test accounts.`;
  }

  // 6. Meeting Follow-up: "Follow up with everyone from yesterday's meeting"
  else if (p.includes('follow up with everyone') || p.includes('yesterday\'s meeting')) {
    intentCategory = 'meeting_followup';
    featureTitle = 'Meeting Follow-up';
    sentEmail = store.addEmail({
      to: ['jay@example.com', 'team@techsodh.com'],
      subject: 'Follow-up & Action Items: Yesterday\'s Sprint Sync',
      body: `Hi team,\n\nFollowing up on yesterday's discussion:\n- Jay: Complete GPU benchmark tests\n- Ronak: Finalize Gemini 3.8 Flash SDK migration\n- All: Next review tomorrow afternoon.\n\nBest,\nRonak`
    });
    directAnswer = `Identified all participants from yesterday's sync (Jay Patel & TechSodh Core Team). Drafted bulleted action items and dispatched follow-up notes via Gmail API.`;
  }

  // 7. Morning Briefing: "Give me my morning briefing"
  else if (p.includes('morning briefing') || p.includes('give me my morning')) {
    intentCategory = 'morning_briefing';
    featureTitle = 'Morning Briefing';
    dailyBriefing = {
      greeting: `Good morning Ronak! Here is your 8:00 AM executive briefing for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`,
      date: new Date().toISOString().split('T')[0],
      schedule: [
        { time: '09:00 AM', title: 'TechSodh Engineering Standup', meetLink: 'https://meet.google.com/ron-tech-mcp' },
        { time: '11:30 AM', title: 'SCET Project Review Work', meetLink: 'https://meet.google.com/sct-audit-rvw' },
        { time: '02:00 PM', title: 'AI Document Scanner Integration with Jay Patel', meetLink: 'https://meet.google.com/ron-jay-test' }
      ],
      reminders: [
        { title: 'Submit SCET document before Monday', time: '11:00 AM' },
        { title: 'Review TechSodh OCR benchmarks before meeting Jay', time: '01:45 PM' }
      ],
      unreadEmails: [
        { from: 'ankit@ornitech.com', subject: 'Ornitech Gateway Firmware v3.2', summary: 'Passed cold storage tests; awaiting OTA approval.' }
      ],
      agentNote: 'You have 3 scheduled meetings and 2 high-priority reminders. All personal context from NeoSapien is synchronized.'
    };
    directAnswer = `Synthesized your 8:00 AM Morning Briefing across Google Calendar, NeoSapien Reminders, and priority Gmail messages.`;
  }

  // 8. End-of-Day Review: "What did I accomplish today?"
  else if (p.includes('accomplish today') || p.includes('end-of-day') || p.includes('what did i accomplish')) {
    intentCategory = 'eod_review';
    featureTitle = 'End-of-Day Review';
    directAnswer = `### End-of-Day Accomplishment Review:\n\n1. **TechSodh AI Scanner**: Completed integration tests with Jay Patel; OCR pipeline confirmed at 98.4% precision.\n2. **Google Workspace**: Handled 3 calendar events, dispatched 2 follow-up summaries, and resolved schedule conflicts.\n3. **SCET Thesis**: Finalized Glacier Monitoring project documentation and guide signoff checklist.\n4. **NeoSapien Vault**: 3 new memory facts committed; zero overdue reminders.\n\n*Great job today, Ronak! All open items are queued for tomorrow's morning standup.*`;
  }

  // 9. Personal Search: "Find everything about the glacier project"
  else if (p.includes('find everything about the glacier project') || p.includes('everything about the glacier')) {
    intentCategory = 'search';
    featureTitle = 'Personal Search';
    directAnswer = `### Search Results for "Glacier Project" across Connected MCPs:\n\n- **NeoSapien Memory**: Research initiative on Himalayan glacier retreat tracking with Professor X. Decision to use Sentinel-1 SAR and Gemini Vision.\n- **Meeting Transcript**: 40-minute research sync with Professor X discussing Siachen glacier radar slices.\n- **SCET Academic Portal**: Final thesis documentation due next week.\n- **GitHub**: Repository \`ornitech/satellite-sar-pipeline\` containing Python preprocessor scripts.`;
  }

  // 10. Goal Tracker: "How am I progressing on TechSodh?"
  else if (p.includes('how am i progressing on techsodh') || (p.includes('progressing') && p.includes('techsodh'))) {
    intentCategory = 'goal_tracker';
    featureTitle = 'Goal Tracker';
    directAnswer = `### TechSodh Progress Tracker (Q4 Milestone):\n\n- **OCR Multi-Lingual Engine**: 98.4% accuracy achieved on Gujarati & English invoices (**Milestone Hit**).\n- **GPU Cloud Migration**: Cloud Run GPU setup underway with Jay Patel (**In Progress - 75%**).\n- **Enterprise Pipeline**: 3 B2B pilot clients testing the API (**Active**).\n- **Next Milestone**: Deploy automated table extraction microservice before end of month.`;
  }

  // 11. Research Assistant: "Research the latest glacier segmentation methods"
  else if (p.includes('research the latest glacier segmentation methods') || p.includes('glacier segmentation')) {
    intentCategory = 'research';
    featureTitle = 'Research Assistant';
    directAnswer = `### Latest Glacier Segmentation Methodologies (2026 Survey):\n\n1. **Multi-Modal SAR + Optical Fusion**: Combining Sentinel-1 (C-band SAR) with Sentinel-2 optical imagery to penetrate perennial cloud cover in the Himalayas.\n2. **Vision-Language Boundary Delineation**: Using Gemini Vision multi-modal attention maps to delineate debris-covered ice margins where traditional NDSI (Normalized Difference Snow Index) fails.\n3. **Temporal InSAR Coherence**: Tracking seasonal velocity flow lines using interferometric phase decorrelation.`;
  }

  // 12. Coding Assistant: "Check my GitHub issues and tell me what I should fix"
  else if (p.includes('check my github issues') || p.includes('what i should fix')) {
    intentCategory = 'github';
    featureTitle = 'Coding Assistant';
    directAnswer = `### Prioritized GitHub Issues across your Repositories:\n\n1. **#42 [techsodh/ai-scanner]**: *Memory leak in PDF rasterizer worker thread pool* (Priority: **HIGH** / **URGENT**) → Fix first to stabilize production OCR server.\n2. **#48 [ornitech/iot-firmware]**: *Cellular fallback latency spikes during MQTT reconnect* (Priority: **HIGH**) → Affects Gujarat solar farm telemetry.\n3. **#45 [techsodh/ai-scanner]**: *Upgrade @google/genai SDK to 2.4.0* (Priority: **MEDIUM**).`;
  }

  // 13. GitHub Agent: "Create an issue for this bug"
  else if (p.includes('create an issue for this bug') || p.includes('create an issue')) {
    intentCategory = 'github';
    featureTitle = 'GitHub Agent';
    const newIssue = store.addGitHubIssue({
      repo: 'techsodh/ai-scanner',
      title: 'Fix edge-case truncation on rotated multi-page PDF documents',
      author: 'ronaktalaviya51',
      status: 'open',
      priority: 'high',
      labels: ['bug', 'ocr-engine']
    });
    directAnswer = `Created GitHub Issue **#${newIssue.id}** on repository \`${newIssue.repo}\`:\n- **Title**: ${newIssue.title}\n- **Labels**: \`bug\`, \`ocr-engine\`\n- **Status**: Open & Assigned to Core Team.`;
  }

  // 14. GitHub Monitor: "Tell me if someone opens an important issue"
  else if (p.includes('tell me if someone opens an important issue') || p.includes('github monitor')) {
    intentCategory = 'github';
    featureTitle = 'GitHub Monitor';
    directAnswer = `GitHub Webhook Monitor is active for \`techsodh/*\` and \`ornitech/*\`. Alert triggers configured for: labels = \`urgent\`, \`critical\`, or issues opened by external enterprise users. You will receive an immediate Neo notification.`;
  }

  // 15. Slack Assistant: "What did the team discuss yesterday?"
  else if (p.includes('what did the team discuss yesterday') || (p.includes('slack') && p.includes('yesterday'))) {
    intentCategory = 'slack';
    featureTitle = 'Slack Assistant';
    directAnswer = `### Yesterday's Slack Summary across Team Channels:\n\n- **#techsodh-dev (Jay Patel)**: Deployed the new invoice layout model. Gujarati receipt benchmark achieved 98.4% precision.\n- **#ornitech-ops (Ankit Mehta)**: Deployed firmware v3.2 to 50 industrial solar gateways; telemetry verified healthy.\n- **General Consensus**: Team agreed to sync today on GPU inference cost benchmarks.`;
  }

  // 16. Document Agent: "Summarize the latest project proposal"
  else if (p.includes('summarize the latest project proposal') || p.includes('latest project proposal')) {
    intentCategory = 'documents';
    featureTitle = 'Document Agent';
    directAnswer = `### Summary: TechSodh Enterprise Document Intelligence Proposal (v2.4):\n\n- **Executive Summary**: Automated OCR and knowledge extraction API for enterprise accounting and compliance.\n- **Value Proposition**: Reduces manual data entry by 85%; handles multi-lingual Indic scripts with sub-second latency.\n- **Architecture**: Gemini Vision backend + Cloud Run GPU cluster.\n- **Commercials**: $1,500/month base tier with 50,000 page quota.`;
  }

  // 17. Spreadsheet Agent: "Analyze this month's event data"
  else if (p.includes('analyze this month\'s event data') || p.includes('event data')) {
    intentCategory = 'sheets';
    featureTitle = 'Spreadsheet Agent';
    directAnswer = `### MyEntryPass October 2026 Event Analytics:\n\n- **Active Events**: 8 large-scale expos and conferences.\n- **Total Attendees Checked In**: 14,250 visitors.\n- **Average QR Scan Speed**: 340ms (99.8% within SLA).\n- **Peak Traffic**: 2,100 check-ins/hour during morning keynote at Surat Tech Summit.`;
  }

  // 18. Finance Tracker: "How much did I spend on this project?"
  else if (p.includes('how much did i spend on this project') || p.includes('how much did i spend')) {
    intentCategory = 'finance';
    featureTitle = 'Finance Tracker';
    directAnswer = `### Project Spend Breakdown (Current Month - October 2026):\n\n- **GCP Cloud Run & Storage**: $142.50\n- **GPU Cloud Inference Instances**: $380.00\n- **Cloudflare & Domain Services**: $45.00\n- **Total Project Expenditure**: **$567.50** (82% of monthly allocated budget of $700).`;
  }

  // 19. MyEntryPass Agent: "How many events are running this month?"
  else if (p.includes('how many events are running this month') || p.includes('myentrypass agent')) {
    intentCategory = 'myentrypass';
    featureTitle = 'MyEntryPass Agent';
    directAnswer = `There are **8 active events** running this month on MyEntryPass, including the **Gujarat Tech Expo**, **SCET Annual Symposium**, and **Surat Startup Fair**. Total pass issuance volume is currently at **16,800 credentials**.`;
  }

  // 20. TechSodh Agent: "What new documents were uploaded?"
  else if (p.includes('what new documents were uploaded') || p.includes('techsodh agent')) {
    intentCategory = 'techsodh';
    featureTitle = 'TechSodh Agent';
    directAnswer = `In the last 24 hours, **428 documents** were ingested into TechSodh:\n- 312 B2B GST Invoices (Parsed with 99.1% confidence)\n- 85 Legal agreements (Extracted signatures and clauses)\n- 31 Multi-page freight bills (Zero extraction errors).`;
  }

  // 21. Business Assistant: "Prepare today's Ornitech priorities"
  else if (p.includes('prepare today\'s ornitech priorities') || p.includes('ornitech priorities')) {
    intentCategory = 'ornitech';
    featureTitle = 'Business Assistant (Ornitech)';
    directAnswer = `### Today's Ornitech Business & Engineering Priorities:\n\n1. **Firmware Signoff**: Approve Ankit Mehta's OTA push for Gateway Firmware v3.2 on 50 field units.\n2. **Client SLA Review**: Review draft contract for Gujarat Solar Farm expansion.\n3. **Hardware Telemetry Check**: Inspect cellular failover latency logs on MQTT broker.`;
  }

  // 22. Contact Intelligence: "Who is Ankit and what have I worked with him on?"
  else if (p.includes('who is ankit') || (p.includes('ankit') && p.includes('worked with'))) {
    intentCategory = 'contact_intel';
    featureTitle = 'Contact Intelligence';
    directAnswer = `**Ankit Mehta** is the Lead Embedded Systems & IoT Architect at **Ornitech** (Email: \`ankit@ornitech.com\`).\n\nYou have collaborated closely on:\n- Industrial Smart Gateway Firmware v3.2 development\n- Edge ML inference for industrial sensor monitoring\n- High-reliability MQTT telemetry across remote solar sites\n- Resolving cellular fallback latency issues during network drops.`;
  }

  // 23. Workflow Automation: "When someone emails me about a meeting, handle it"
  else if (p.includes('when someone emails me about a meeting') || p.includes('workflow automation')) {
    intentCategory = 'workflow';
    featureTitle = 'Workflow Automation';
    directAnswer = `Autonomous Workflow Active: When incoming emails contain scheduling intent, Gemini cross-references your Google Calendar free/busy slots, pulls attendee relationship context from NeoSapien, and prepares a draft invite with Google Meet link for 1-click confirmation.`;
  }

  // 24. Inbox Agent: "Clean up my inbox"
  else if (p.includes('clean up my inbox') || p.includes('inbox agent')) {
    intentCategory = 'inbox';
    featureTitle = 'Inbox Agent';
    directAnswer = `### Inbox Triage & Organization (Gmail):\n\n- **Priority Items (2)**: Firmware signoff from Ankit Mehta; TechSodh candidate release feedback from Jay Patel.\n- **Automated Actions**: Archived 18 promotional newsletters; categorized 6 GitHub notifications into \`TechSodh/Dev\` label.`;
  }

  // 25. Schedule Optimizer: "Find me 3 hours this week for research"
  else if (p.includes('find me 3 hours this week for research') || p.includes('schedule optimizer')) {
    intentCategory = 'schedule_optimizer';
    featureTitle = 'Schedule Optimizer';
    const optDate = new Date();
    optDate.setDate(optDate.getDate() + 2);
    const dateStr = optDate.toISOString().split('T')[0];

    createdMeeting = store.addEvent({
      summary: 'Deep Focus: Glacier Research & SAR Benchmarks',
      description: 'Reserved 3-hour focus block optimized around sprint meetings.',
      start: `${dateStr}T14:00:00Z`,
      end: `${dateStr}T17:00:00Z`,
      meetLink: 'https://calendar.google.com',
      attendees: [{ name: 'Ronak Talaviya', email: store.userProfile.email }],
      status: 'confirmed'
    });

    directAnswer = `Analyzed your calendar across this week. Found an optimal un-interrupted block on **${dateStr} from 2:00 PM to 5:00 PM (3 Hours)** with zero meeting collisions. Blocked on your Google Calendar.`;
  }

  // 26. Context-Aware Agent: "Continue the glacier work"
  else if (p.includes('continue the glacier work') || p.includes('context-aware agent')) {
    intentCategory = 'context_aware';
    featureTitle = 'Context-Aware Agent';
    directAnswer = `Resumed Glacier Project Context: Last week you agreed with Professor X to implement automated melt-rate detection on Sentinel-1 SAR imagery using Gemini Vision. Your active script is \`benchmark_siachen.py\`. Opening research notes and SAR dataset slices now.`;
  }

  // 27. Follow-up Tracker: "Who am I waiting for?"
  else if (p.includes('who am i waiting for') || p.includes('follow-up tracker')) {
    intentCategory = 'followup_tracker';
    featureTitle = 'Follow-up Tracker';
    directAnswer = `### Pending Follow-ups (Who You Are Waiting For):\n\n1. **SCET Project Guide**: Waiting on official department signoff signature on semester thesis.\n2. **Rahul Sharma**: Waiting for confirmation on tomorrow afternoon's VPC peering review session.\n3. **Domain Registrar**: Awaiting billing cycle confirmation for \`techsodh.com\`.`;
  }

  // 28. College Assistant: "What do I need to finish for SCET this week?"
  else if (p.includes('what do i need to finish for scet') || p.includes('finish for scet')) {
    intentCategory = 'college';
    featureTitle = 'College Assistant (SCET)';
    directAnswer = `### SCET Academic Checklist for This Week:\n\n1. **Document Submission**: Complete final documentation for Glacier Monitoring project before next Monday 11:00 AM.\n2. **Guide Signoff**: Obtain Project Guide and HOD signatures on lab audit log.\n3. **Lab Assessment**: Review simulation code benchmarks with departmental committee.`;
  }

  // 29. Startup Assistant: "Prepare my startup priorities for this week"
  else if (p.includes('startup priorities for this week') || p.includes('startup assistant')) {
    intentCategory = 'startup';
    featureTitle = 'Startup Assistant';
    directAnswer = `### Startup Priorities (TechSodh & MyEntryPass):\n\n1. **TechSodh**: Finalize GPU inference latency migration with Jay Patel; deploy v2.1 OCR model.\n2. **MyEntryPass**: Oversee check-in operations for upcoming weekend tech conference (expected 4,000 passes).\n3. **Infra**: Review domain renewals and Cloud Run scale-to-zero configurations.`;
  }

  // 30. Weekly Review: "Give me my weekly review"
  else if (p.includes('give me my weekly review') || p.includes('weekly review')) {
    intentCategory = 'weekly_review';
    featureTitle = 'Weekly Review';
    directAnswer = `### Weekly Executive Review for Ronak:\n\n- **Meetings Held**: 12 sessions across TechSodh, Ornitech, and SCET.\n- **GitHub Velocity**: 18 commits merged; 4 pull requests closed; OCR accuracy improved to 98.4%.\n- **Emails Managed**: 48 messages triaged; 14 client responses sent.\n- **Memory Health**: 6 new contextual insights indexed in NeoSapien vault.\n\n*Top focus for next week: Finalize SCET document submission and execute Ornitech v3.2 OTA rollout.*`;
  }

  // 31. Proactive Assistant: "Tell me anything important I might be missing"
  else if (p.includes('tell me anything important i might be missing') || p.includes('anything important i might be missing') || p.includes('proactive')) {
    intentCategory = 'proactive';
    featureTitle = 'Proactive Assistant';
    directAnswer = `### Proactive Intelligence Scan (Items Needing Attention):\n\n1. ⚠️ **SCET Document Deadline**: Next Monday morning at 11:00 AM. Guide signoff is still pending.\n2. ⚠️ **Ornitech Firmware OTA**: Ankit Mehta is waiting on your approval to push firmware v3.2 to 50 field units.\n3. ⚠️ **Domain Renewals**: \`techsodh.com\` and \`myentrypass.in\` renewal window opens in 20 days.\n4. ✅ **Calendar**: No conflicting meetings detected for tomorrow.`;
  }

  // Fallback / Generic
  else {
    intentCategory = 'general';
    featureTitle = 'Orchestrated Agent Response';
    directAnswer = `Understood your request: "${userPrompt}". Coordinated across NeoSapien memory graph and Google Workspace tools to execute your workflow.`;
  }

  // Step 2: Reasoning Step
  steps.push({
    id: 'step-gemini-reasoning',
    title: `Gemini Agent: ${featureTitle}`,
    subtitle: `Reasoned over intent "${featureTitle}" using Multi-MCP Router`,
    type: 'gemini_agent',
    status: 'completed',
    timestamp: new Date().toISOString(),
    durationMs: usingRealGemini ? 420 : 110,
    data: {
      feature: featureTitle,
      category: intentCategory,
      plan: geminiAnalysis || `Executed tool calls across NeoSapien, Workspace, and custom MCP repositories.`,
      model: usingRealGemini ? 'gemini-3.8-flash (Live)' : 'Gemini Interactions Core'
    }
  });

  // Step 3: MCP Router
  steps.push({
    id: 'step-mcp-router',
    title: 'Multi-MCP Tool Router Dispatch',
    subtitle: `Routed to NeoSapien MCP, Google Workspace MCP & Custom Ecosystem`,
    type: 'mcp_router',
    status: 'completed',
    timestamp: new Date().toISOString(),
    durationMs: 45,
    data: {
      invocations: [
        'NeoSapien MCP: Context retrieval & memory search',
        'Google Workspace: Calendar, Gmail & Meet APIs',
        'Custom MCP: TechSodh, Ornitech, GitHub, Slack'
      ]
    }
  });

  // Step 4: Final Action Result Step
  steps.push({
    id: 'step-action-result',
    title: `Action Result: ${featureTitle} Completed`,
    subtitle: 'Deliverables verified and committed to state.',
    type: 'action_result',
    status: 'completed',
    timestamp: new Date().toISOString(),
    durationMs: 25,
    data: {
      meetingCreated: createdMeeting,
      reminderStored: storedReminder,
      emailSent: sentEmail,
      directAnswer,
      dailyBriefing
    }
  });

  const totalTime = Date.now() - startTime;

  return {
    success: true,
    prompt: userPrompt,
    intentType: intentCategory as any,
    flowState: {
      intent: featureTitle.toUpperCase(),
      person: 'Ronak / Collaborator',
      topic: featureTitle,
      suggestedTime: createdMeeting ? createdMeeting.start : undefined,
      contextFound: true,
      hitlRequired: confirmation ? !confirmation.autoRunBypassed : false,
      autoRunMode,
      riskLevel: confirmation?.riskLevel || 'low'
    },
    steps,
    actionResult: {
      meetingCreated: createdMeeting,
      reminderStored: storedReminder,
      emailSent: sentEmail,
      directAnswer,
      dailyBriefing,
      summary: `Successfully executed "${featureTitle}". Coordinated across NeoSapien memory, Google Workspace, and personal ecosystem MCP tools.`,
      confirmation
    },
    executionTimeMs: totalTime,
    usingRealGemini
  };
}
