import { 
  NeoSapienMemory, 
  NeoSapienTranscript, 
  NeoSapienReminder, 
  WorkspaceEvent, 
  WorkspaceEmail,
  CustomProjectData,
  ActionConfirmationRequest,
  AgentMeetingRecord,
  MeetingCapabilityMetrics
} from '../src/types';

export interface GitHubIssue {
  id: number;
  repo: string;
  title: string;
  author: string;
  status: 'open' | 'closed';
  priority: 'high' | 'medium' | 'low';
  labels: string[];
}

export interface SlackMessage {
  id: string;
  channel: string;
  author: string;
  content: string;
  timestamp: string;
}

export class DataStore {
  userProfile = {
    name: 'Ronak Talaviya',
    email: 'ronaktalaviya51@gmail.com',
    role: 'AI Engineer & Tech Lead',
    organization: 'TechSodh / Ornitech / SCET',
    preferredMeetingDuration: '30 mins',
    timezone: 'Asia/Kolkata (IST)'
  };

  securitySettings = {
    requireConfirmationForEmails: true,
    requireConfirmationForCalendarBooking: false,
    requireConfirmationForExternalSync: true,
    safeMode: true,
    autoRunMode: true
  };

  memories: NeoSapienMemory[] = [
    {
      id: 'mem-jay',
      category: 'contact',
      title: 'Jay Patel - TechSodh Lead',
      personName: 'Jay',
      content: 'Jay Patel is a core TechSodh team member. Email: jay@example.com. Relationship: TechSodh team. Previous Context: Collaborating on the AI Document Scanner microservice with vision OCR and LLM summarization. Available tomorrow afternoon between 2:00 PM and 3:30 PM.',
      tags: ['contact', 'jay', 'techsodh', 'ai-scanner'],
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'mem-ankit',
      category: 'contact',
      title: 'Ankit Mehta - Ornitech Lead Architect',
      personName: 'Ankit',
      content: 'Ankit Mehta is Lead Embedded Systems & IoT Architect at Ornitech. Email: ankit@ornitech.com. Collaborated with Ronak on smart gateway firmware v3.2, Edge ML inference, and MQTT broker resilience.',
      tags: ['contact', 'ankit', 'ornitech', 'iot'],
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'mem-scet',
      category: 'academic',
      title: 'SCET Document Submission Guidelines',
      personName: 'SCET Office',
      content: 'SCET (Sarvajanik College of Engineering and Technology) semester project documentation and lab audit papers. Due next Monday for departmental review. Needs signatures from Project Guide and HOD.',
      tags: ['academic', 'scet', 'submission', 'deadline'],
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'mem-prof-x',
      category: 'project',
      title: 'Glacier Monitoring Project - Professor X',
      personName: 'Professor X',
      content: 'Research project on Himalayan glacier retreat tracking. Working with Professor X. Decision from last week: build automated melt-rate detection pipeline using Gemini Vision and synthetic aperture radar (SAR) satellite data.',
      tags: ['research', 'glacier', 'professor-x', 'satellite'],
      updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'mem-rahul',
      category: 'contact',
      title: 'Rahul Sharma - Profile & Availability',
      personName: 'Rahul',
      content: 'Rahul Sharma is Lead Cloud Architect at Acme Corp. Email: rahul.sharma@example.com. Prefers meetings in the afternoon after 2:00 PM due to morning engineering focus blocks. Prefers Google Meet over Zoom.',
      tags: ['contact', 'rahul', 'preferences', 'scheduling'],
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'mem-rahul-proj',
      category: 'project',
      title: 'Active Work with Rahul - Cloud Migration',
      personName: 'Rahul',
      content: 'Collaborating on GCP Infrastructure & Kubernetes cluster setup. Rahul asked to review VPC peering and cost optimization slides before scheduling the milestone signoff.',
      tags: ['project', 'cloud-migration', 'kubernetes', 'rahul'],
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'mem-domain',
      category: 'general',
      title: 'TechSodh & MyEntryPass Domain Renewals',
      personName: 'TechSodh Infra',
      content: 'Domain registrations on Cloudflare. techsodh.com and myentrypass.in renewal notices due in 20 days. Auto-renew card needs review.',
      tags: ['infra', 'domain', 'techsodh', 'myentrypass'],
      updatedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    }
  ];

  transcripts: NeoSapienTranscript[] = [
    {
      id: 'trans-prof-x',
      title: 'Glacier Project Research Sync with Professor X',
      date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
      duration: '40 mins',
      participants: ['Ronak Talaviya', 'Professor X'],
      summary: 'Discussed Himalayan glacier retreat tracking methodology. Reviewed radar satellite feeds. Decided to build the automated melt-rate pipeline utilizing Gemini Vision for optical cloud masking and Sentinel-1 SAR imagery for ice elevation profiles. Agreed to submit initial Python benchmarks by next Wednesday.',
      keyTakeaways: [
        'Decided on Sentinel-1 SAR dataset to eliminate cloud cover occlusion',
        'Use Gemini Vision for morphological boundary classification',
        'Initial benchmark script to be completed by Ronak before Wednesday'
      ],
      actionItems: [
        'Download Sentinel-1 test geotiff slices for Siachen glacier',
        'Prepare Python benchmark report for Professor X review'
      ]
    },
    {
      id: 'trans-jay-sync',
      title: 'TechSodh AI Document Scanner Sprint with Jay Patel',
      date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
      duration: '28 mins',
      participants: ['Ronak Talaviya', 'Jay Patel'],
      summary: 'Jay reported 98.4% OCR accuracy on multi-column Gujarati and English PDF invoices. Discussed latency bottlenecks on AWS Lambda and planned to migrate inference to Cloud Run GPU. Decided to sync tomorrow afternoon to run end-to-end integration tests.',
      keyTakeaways: [
        'AI Scanner accuracy reached 98.4%',
        'Jay free tomorrow afternoon 2:00 PM for integration testing',
        'Google Meet preferred for screen sharing'
      ],
      actionItems: [
        'Schedule follow-up meeting with Jay tomorrow afternoon',
        'Prepare API benchmark payload for TechSodh scanner'
      ]
    },
    {
      id: 'trans-rahul-sync',
      title: '1-on-1 Catchup with Rahul (Architecture Sync)',
      date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      duration: '32 mins',
      participants: ['Ronak Talaviya', 'Rahul Sharma'],
      summary: 'Reviewed preliminary migration benchmarks. Rahul highlighted that the network latency was within SLA, but wanted a dedicated follow-up session tomorrow or early this week to finalize the VPC peering setup.',
      keyTakeaways: [
        'VPC peering configuration needs final validation',
        'Rahul available tomorrow afternoon around 2:00 PM or 3:00 PM',
        'Send calendar invite with Google Meet link'
      ],
      actionItems: [
        'Schedule follow-up meeting with Rahul for tomorrow afternoon',
        'Store reminder to prep VPC diagrams 15 minutes before the call'
      ]
    }
  ];

  reminders: NeoSapienReminder[] = [
    {
      id: 'rem-scet',
      title: 'Submit the SCET document to department office',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      time: '11:00',
      relatedTo: 'SCET Project',
      status: 'pending',
      category: 'Academic',
      createdAt: new Date().toISOString()
    },
    {
      id: 'rem-techsodh',
      title: 'Review TechSodh OCR benchmarks before meeting Jay',
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '13:45',
      relatedTo: 'Jay Patel',
      status: 'pending',
      category: 'TechSodh',
      createdAt: new Date().toISOString()
    }
  ];

  events: WorkspaceEvent[] = [
    {
      id: 'evt-standup',
      summary: 'Morning Engineering Standup',
      description: 'Daily team sync, blocker resolution and sprint checkin',
      start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T09:00:00Z',
      end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T09:30:00Z',
      meetLink: 'https://meet.google.com/ron-tech-mcp',
      attendees: [{ name: 'TechSodh Core Team', email: 'team@techsodh.com' }],
      status: 'confirmed'
    },
    {
      id: 'evt-scet-review',
      summary: 'SCET Project Review Work',
      description: 'Departmental review of project documentation with Guide',
      start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T11:30:00Z',
      end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T12:15:00Z',
      meetLink: 'https://meet.google.com/sct-audit-rvw',
      attendees: [{ name: 'SCET Guide', email: 'guide@scet.ac.in' }],
      status: 'confirmed'
    }
  ];

  emails: WorkspaceEmail[] = [
    {
      id: 'email-1',
      to: ['team@techsodh.com'],
      subject: 'TechSodh Scanner Release v2.1 Candidate',
      body: 'Hi team, test builds are ready on staging. Please review OCR confidence scores before our sync.',
      sentAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'email-2',
      to: ['ronaktalaviya51@gmail.com'],
      subject: 'Ornitech Gateway Firmware v3.2 Client Signoff',
      body: 'Hi Ronak, firmware passed cold storage testing. Awaiting your approval to push OTA to 50 field devices.',
      sentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    }
  ];

  githubIssues: GitHubIssue[] = [
    {
      id: 42,
      repo: 'techsodh/ai-scanner',
      title: 'Memory leak in PDF rasterizer worker thread pool',
      author: 'jay-patel',
      status: 'open',
      priority: 'high',
      labels: ['bug', 'ocr-engine', 'urgent']
    },
    {
      id: 45,
      repo: 'techsodh/ai-scanner',
      title: 'Upgrade @google/genai SDK to 2.4.0 for multi-modal inference',
      author: 'ronaktalaviya51',
      status: 'open',
      priority: 'medium',
      labels: ['enhancement', 'gemini-api']
    },
    {
      id: 48,
      repo: 'ornitech/iot-firmware',
      title: 'Cellular fallback latency spikes during MQTT reconnect',
      author: 'ankit-mehta',
      status: 'open',
      priority: 'high',
      labels: ['firmware', 'hardware', 'ornitech']
    }
  ];

  slackMessages: SlackMessage[] = [
    {
      id: 'slack-1',
      channel: '#techsodh-dev',
      author: 'Jay Patel',
      content: 'Deployed the latest fine-tuned Gemini model for invoice layout detection. Gujarati receipt parsing benchmark hit 98.4%!',
      timestamp: 'Yesterday at 4:32 PM'
    },
    {
      id: 'slack-2',
      channel: '#ornitech-ops',
      author: 'Ankit Mehta',
      content: 'The industrial gateways for the Gujarat solar farm are online. 50 devices pinging telemetry successfully.',
      timestamp: 'Yesterday at 6:15 PM'
    }
  ];

  customProjects: CustomProjectData[] = [
    {
      id: 'proj-techsodh',
      name: 'TechSodh',
      description: 'AI Document Intelligence & Computer Vision Platform founded by Ronak.',
      status: 'Production / v2.1 Active',
      recentActivity: 'Integrated Gemini Vision with multi-lingual invoice parser; 98.4% precision.',
      endpoints: ['https://api.techsodh.com/v1/ocr', 'https://api.techsodh.com/v1/summarize']
    },
    {
      id: 'proj-myentrypass',
      name: 'MyEntryPass',
      description: 'Next-gen QR access control & automated visitor credentialing system.',
      status: 'Deployed in Beta (8 Active Events This Month)',
      recentActivity: '14,250 attendees checked in across tech conferences and campus expos.',
      endpoints: ['https://api.myentrypass.in/auth/verify', 'https://api.myentrypass.in/pass/issue']
    },
    {
      id: 'proj-scet',
      name: 'SCET',
      description: 'Sarvajanik College of Engineering and Technology academic coursework & labs.',
      status: 'Active Semester Review',
      recentActivity: 'Final semester project report and Glacier Monitoring thesis documentation.',
      endpoints: ['https://portal.scet.ac.in/student/docs']
    }
  ];

  pendingConfirmations: ActionConfirmationRequest[] = [];
  connectedToNeoSapien: boolean = true;
  connectedToGoogleWorkspace: boolean = true;
  connectedToCustomMcp: boolean = true;

  searchMemories(query: string): NeoSapienMemory[] {
    const q = query.toLowerCase();
    return this.memories.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.content.toLowerCase().includes(q) ||
      (m.personName && m.personName.toLowerCase().includes(q)) ||
      m.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  getTranscriptsForPerson(person: string): NeoSapienTranscript[] {
    const p = person.toLowerCase();
    return this.transcripts.filter(t => 
      t.participants.some(part => part.toLowerCase().includes(p)) ||
      t.title.toLowerCase().includes(p) ||
      t.summary.toLowerCase().includes(p)
    );
  }

  addReminder(reminder: Omit<NeoSapienReminder, 'id' | 'createdAt'>): NeoSapienReminder {
    const newRem: NeoSapienReminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.reminders.unshift(newRem);
    return newRem;
  }

  addEvent(event: Omit<WorkspaceEvent, 'id'>): WorkspaceEvent {
    const newEvt: WorkspaceEvent = {
      ...event,
      id: `evt-${Date.now()}`
    };
    this.events.unshift(newEvt);
    return newEvt;
  }

  addEmail(email: Omit<WorkspaceEmail, 'id' | 'sentAt'>): WorkspaceEmail {
    const newEmail: WorkspaceEmail = {
      ...email,
      id: `email-${Date.now()}`,
      sentAt: new Date().toISOString()
    };
    this.emails.unshift(newEmail);
    return newEmail;
  }

  addMemory(memory: Omit<NeoSapienMemory, 'id' | 'updatedAt'>): NeoSapienMemory {
    const newMem: NeoSapienMemory = {
      ...memory,
      id: `mem-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    this.memories.unshift(newMem);
    return newMem;
  }

  addGitHubIssue(issue: Omit<GitHubIssue, 'id'>): GitHubIssue {
    const newIssue: GitHubIssue = {
      ...issue,
      id: Math.floor(Math.random() * 900) + 100
    };
    this.githubIssues.unshift(newIssue);
    return newIssue;
  }

  agentMeetings: AgentMeetingRecord[] = [
    {
      id: 'agent-meet-101',
      summary: 'TechSodh OCR Sync: Jay Patel / Ronak',
      description: 'Review TechSodh AI Document Scanner Gujarati model benchmarks and Cloud Run GPU latency.\nContext from NeoSapien: Jay is available tomorrow afternoon (2:00 PM - 3:30 PM).\nJoin Meet: https://meet.google.com/ron-jay-test',
      start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:00:00Z',
      end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:45:00Z',
      meetLink: 'https://meet.google.com/ron-jay-test',
      attendees: [
        { name: 'Jay Patel', email: 'jay@example.com' },
        { name: 'Ronak Talaviya', email: 'ronaktalaviya51@gmail.com' }
      ],
      triggerPrompt: 'Set a meeting with Jay tomorrow afternoon to discuss TechSodh',
      source: 'ambient_voice',
      scheduledAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      autoRunBypassed: true,
      status: 'confirmed',
      latencyMs: 2310,
      relatedProject: 'TechSodh',
      reminderCreated: 'Review TechSodh OCR benchmarks 15m before meeting Jay',
      emailDispatched: 'Invitation: TechSodh OCR Sync (Google Meet)'
    },
    {
      id: 'agent-meet-102',
      summary: 'Architecture Sync: Rahul Sharma / Cloud Migration',
      description: 'Review GCP VPC peering, latency benchmarks, and Kubernetes cluster topology.\nContext from NeoSapien: Rahul prefers afternoon slots (>2 PM).\nJoin Meet: https://meet.google.com/ron-rahul-arch',
      start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:00:00Z',
      end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:45:00Z',
      meetLink: 'https://meet.google.com/ron-rahul-arch',
      attendees: [
        { name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
        { name: 'Ronak Talaviya', email: 'ronaktalaviya51@gmail.com' }
      ],
      triggerPrompt: 'Set meeting with Rahul tomorrow',
      source: 'typed_prompt',
      scheduledAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      autoRunBypassed: true,
      status: 'confirmed',
      latencyMs: 2505,
      relatedProject: 'Cloud Migration',
      reminderCreated: 'Review VPC peering slides 15m before meeting Rahul',
      emailDispatched: 'Invitation: Architecture Sync (Google Meet)'
    },
    {
      id: 'agent-meet-103',
      summary: 'Design sprint review: Sarah Jenkins / Ronak',
      description: 'Design sprint review for mobile workflow controls\nContext from NeoSapien: Product UI/UX Lead.\nJoin Meet: https://meet.google.com/ron-sarah-618',
      start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T15:00:00Z',
      end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T15:45:00Z',
      meetLink: 'https://meet.google.com/ron-sarah-618',
      attendees: [
        { name: 'Sarah Jenkins', email: 'sarah.j@example.com' },
        { name: 'Ronak Talaviya', email: 'ronaktalaviya51@gmail.com' }
      ],
      triggerPrompt: 'meet with Sarah tomorrow at 3pm',
      source: 'typed_prompt',
      scheduledAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      autoRunBypassed: true,
      status: 'confirmed',
      latencyMs: 2501,
      relatedProject: 'MyEntryPass UI',
      reminderCreated: 'Prep 15m before meeting with Sarah Jenkins',
      emailDispatched: 'Invitation: Design sprint review (Google Meet)'
    },
    {
      id: 'agent-meet-104',
      summary: 'Glacier Monitoring SAR Pipeline: Professor X / Ronak',
      description: 'Sentinel-1 SAR radar imagery processing and automated melt-rate pipeline with Gemini Vision.\nContext from NeoSapien: SCET Project Guide.\nJoin Meet: https://meet.google.com/ron-prof-x-902',
      start: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] + 'T11:00:00Z',
      end: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] + 'T11:45:00Z',
      meetLink: 'https://meet.google.com/ron-prof-x-902',
      attendees: [
        { name: 'Professor X', email: 'prof.x@scet.ac.in' },
        { name: 'Ronak Talaviya', email: 'ronaktalaviya51@gmail.com' }
      ],
      triggerPrompt: 'Schedule meeting with Professor X to review Glacier project',
      source: 'ambient_voice',
      scheduledAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      autoRunBypassed: true,
      status: 'confirmed',
      latencyMs: 2410,
      relatedProject: 'SCET Glacier Thesis',
      reminderCreated: 'Review Sentinel-1 radar slices before Professor X sync',
      emailDispatched: 'Invitation: Glacier Monitoring SAR Pipeline (Google Meet)'
    },
    {
      id: 'agent-meet-105',
      summary: 'IoT Gateway Firmware v3.2 Review: Ankit Mehta / Ronak',
      description: 'Industrial Smart Gateway Firmware v3.2 & MQTT telemetry testing.\nContext from NeoSapien: Ornitech Architect.\nJoin Meet: https://meet.google.com/ron-ankit-744',
      start: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0] + 'T16:00:00Z',
      end: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0] + 'T16:45:00Z',
      meetLink: 'https://meet.google.com/ron-ankit-744',
      attendees: [
        { name: 'Ankit Mehta', email: 'ankit@ornitech.com' },
        { name: 'Ronak Talaviya', email: 'ronaktalaviya51@gmail.com' }
      ],
      triggerPrompt: 'Sync with Ankit on firmware v3.2',
      source: 'one_click_scenario',
      scheduledAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      autoRunBypassed: true,
      status: 'confirmed',
      latencyMs: 2600,
      relatedProject: 'Ornitech IoT',
      reminderCreated: 'Inspect MQTT broker latency logs 15m before Ankit sync',
      emailDispatched: 'Invitation: IoT Gateway Firmware Review (Google Meet)'
    }
  ];

  addAgentMeeting(meeting: AgentMeetingRecord): AgentMeetingRecord {
    this.agentMeetings.unshift(meeting);
    return meeting;
  }

  getMeetingCapabilityMetrics(): MeetingCapabilityMetrics {
    const total = this.agentMeetings.length;
    const autoRunCount = this.agentMeetings.filter(m => m.autoRunBypassed).length;
    const zeroClickRate = total > 0 ? Math.round((autoRunCount / total) * 100) : 100;
    
    // Collaborator counts
    const colabMap: Record<string, { name: string; email: string; count: number; role?: string }> = {};
    for (const m of this.agentMeetings) {
      for (const a of m.attendees) {
        if (a.email !== this.userProfile.email) {
          if (!colabMap[a.email]) {
            let role = 'Collaborator';
            const nl = a.name.toLowerCase();
            if (nl.includes('jay')) role = 'TechSodh Lead';
            else if (nl.includes('rahul')) role = 'Lead Cloud Architect';
            else if (nl.includes('ankit')) role = 'Ornitech Architect';
            else if (nl.includes('prof')) role = 'SCET Guide';
            else if (nl.includes('sarah')) role = 'Product UI Lead';
            else if (nl.includes('alex')) role = 'DevOps Lead';

            colabMap[a.email] = { name: a.name, email: a.email, count: 0, role };
          }
          colabMap[a.email].count += 1;
        }
      }
    }
    const topCollaborators = Object.values(colabMap).sort((a, b) => b.count - a.count);

    const latencies = this.agentMeetings.map(m => m.latencyMs || 2500);
    const avgLatency = Math.round(latencies.reduce((acc, v) => acc + v, 0) / (latencies.length || 1));

    return {
      totalMeetingsSet: total,
      autoRunExecutions: autoRunCount,
      zeroClickRatePercent: zeroClickRate,
      topCollaborators,
      avgSchedulingLatencyMs: avgLatency,
      estimatedTimeSavedMinutes: total * 15,
      meetLinksGenerated: total,
      invitesDispatched: total,
      remindersCreated: total
    };
  }
}

export const store = new DataStore();
