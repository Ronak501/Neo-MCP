import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Play, 
  Calendar, 
  Clock, 
  Mail, 
  Database, 
  FileText, 
  Users, 
  Sun, 
  Moon, 
  Target, 
  BookOpen, 
  Code, 
  GitPullRequest, 
  Bell, 
  MessageSquare, 
  Table, 
  DollarSign, 
  Ticket, 
  Globe, 
  Briefcase, 
  Compass, 
  Repeat, 
  Inbox, 
  CheckSquare, 
  GraduationCap, 
  Rocket, 
  TrendingUp, 
  Eye
} from 'lucide-react';

export interface AgentFeatureItem {
  id: string;
  name: string;
  icon: string;
  category: 'calendar' | 'memory' | 'briefing' | 'startup' | 'engineering' | 'tasks';
  command: string;
  description: string;
  mcpPill: 'NeoSapien' | 'Workspace' | 'Custom MCP' | 'Multi-MCP';
}

export const ALL_31_FEATURES: AgentFeatureItem[] = [
  {
    id: '1',
    name: 'Smart Calendar',
    icon: '📅',
    category: 'calendar',
    command: 'Schedule a meeting with Rahul tomorrow',
    description: 'Finds Rahul in NeoSapien → checks availability → creates Meet & Gmail invite',
    mcpPill: 'Workspace'
  },
  {
    id: '2',
    name: 'Intelligent Reminders',
    icon: '⏰',
    category: 'tasks',
    command: 'Remind me to submit the proposal before Friday',
    description: 'Creates contextual reminder in NeoSapien memory & reserves Calendar slot',
    mcpPill: 'NeoSapien'
  },
  {
    id: '3',
    name: 'Email Agent',
    icon: '📧',
    category: 'tasks',
    command: 'Reply to the latest email from Rahul',
    description: 'Reads context from NeoSapien & Gmail → drafts reply → triggers security approval',
    mcpPill: 'Workspace'
  },
  {
    id: '4',
    name: 'Personal Memory',
    icon: '🧠',
    category: 'memory',
    command: 'What did I discuss with Rahul?',
    description: 'Searches NeoSapien personal memory vault and past call transcripts',
    mcpPill: 'NeoSapien'
  },
  {
    id: '5',
    name: 'Meeting Assistant',
    icon: '📝',
    category: 'calendar',
    command: 'Prepare me for my 3 PM meeting',
    description: 'Synthesizes Google Calendar + NeoSapien context into an actionable prep briefing',
    mcpPill: 'Multi-MCP'
  },
  {
    id: '6',
    name: 'Meeting Follow-up',
    icon: '📋',
    category: 'calendar',
    command: "Follow up with everyone from yesterday's meeting",
    description: 'Finds meeting → identifies attendees → drafts and sends follow-up emails',
    mcpPill: 'Workspace'
  },
  {
    id: '7',
    name: 'Morning Briefing',
    icon: '🌅',
    category: 'briefing',
    command: 'Give me my morning briefing',
    description: 'Aggregates Google Calendar + NeoSapien reminders + unread priority emails',
    mcpPill: 'Multi-MCP'
  },
  {
    id: '8',
    name: 'End-of-Day Review',
    icon: '🌙',
    category: 'briefing',
    command: 'What did I accomplish today?',
    description: 'Summarizes completed calendar events, discussions, code commits, and tasks',
    mcpPill: 'Multi-MCP'
  },
  {
    id: '9',
    name: 'Personal Search',
    icon: '🔍',
    category: 'memory',
    command: 'Find everything about the glacier project',
    description: 'Searches across NeoSapien memories, research transcripts, SCET docs & GitHub',
    mcpPill: 'NeoSapien'
  },
  {
    id: '10',
    name: 'Goal Tracker',
    icon: '🎯',
    category: 'startup',
    command: 'How am I progressing on TechSodh?',
    description: 'Collects relevant OCR metrics, GPU benchmarks, and summarizes milestone progress',
    mcpPill: 'Custom MCP'
  },
  {
    id: '11',
    name: 'Research Assistant',
    icon: '📚',
    category: 'engineering',
    command: 'Research the latest glacier segmentation methods',
    description: 'Synthesizes multi-modal satellite SAR and Gemini boundary classification research',
    mcpPill: 'Multi-MCP'
  },
  {
    id: '12',
    name: 'Coding Assistant',
    icon: '💻',
    category: 'engineering',
    command: 'Check my GitHub issues and tell me what I should fix',
    description: 'Queries GitHub MCP → prioritizes urgent bugs and memory leaks',
    mcpPill: 'Custom MCP'
  },
  {
    id: '13',
    name: 'GitHub Agent',
    icon: '🐙',
    category: 'engineering',
    command: 'Create an issue for this bug',
    description: 'Creates and tags a new GitHub issue in techsodh/ai-scanner',
    mcpPill: 'Custom MCP'
  },
  {
    id: '14',
    name: 'GitHub Monitor',
    icon: '🔔',
    category: 'engineering',
    command: 'Tell me if someone opens an important issue',
    description: 'Monitors repositories for high-priority or critical bug alerts',
    mcpPill: 'Custom MCP'
  },
  {
    id: '15',
    name: 'Slack Assistant',
    icon: '💬',
    category: 'engineering',
    command: 'What did the team discuss yesterday?',
    description: 'Searches #techsodh-dev and #ornitech-ops Slack channels for highlights',
    mcpPill: 'Custom MCP'
  },
  {
    id: '16',
    name: 'Document Agent',
    icon: '📄',
    category: 'engineering',
    command: 'Summarize the latest project proposal',
    description: 'Finds document → summarizes value proposition, commercials & architecture',
    mcpPill: 'Workspace'
  },
  {
    id: '17',
    name: 'Spreadsheet Agent',
    icon: '📊',
    category: 'startup',
    command: "Analyze this month's event data",
    description: 'Reads Google Sheets → analyzes 14,250 check-ins and QR scan speeds',
    mcpPill: 'Workspace'
  },
  {
    id: '18',
    name: 'Finance Tracker',
    icon: '💰',
    category: 'startup',
    command: 'How much did I spend on this project?',
    description: 'Calculates Cloud Run, GPU inference, and domain service monthly expenditures',
    mcpPill: 'Custom MCP'
  },
  {
    id: '19',
    name: 'MyEntryPass Agent',
    icon: '🎟️',
    category: 'startup',
    command: 'How many events are running this month?',
    description: 'Queries your own MyEntryPass MCP for active visitor and event stats',
    mcpPill: 'Custom MCP'
  },
  {
    id: '20',
    name: 'TechSodh Agent',
    icon: '🌐',
    category: 'startup',
    command: 'What new documents were uploaded?',
    description: 'Calls TechSodh MCP to inspect newly ingested invoices and legal agreements',
    mcpPill: 'Custom MCP'
  },
  {
    id: '21',
    name: 'Business Assistant',
    icon: '🏢',
    category: 'startup',
    command: "Prepare today's Ornitech priorities",
    description: 'Combines calendar, IoT telemetry tasks, firmware signoffs, and memory',
    mcpPill: 'Multi-MCP'
  },
  {
    id: '22',
    name: 'Contact Intelligence',
    icon: '🤝',
    category: 'memory',
    command: 'Who is Ankit and what have I worked with him on?',
    description: 'NeoSapien memory graph builds complete relationship & project context',
    mcpPill: 'NeoSapien'
  },
  {
    id: '23',
    name: 'Workflow Automation',
    icon: '🔄',
    category: 'tasks',
    command: 'When someone emails me about a meeting, handle it',
    description: 'Email triage → calendar free/busy lookup → prepares meeting invite with Meet link',
    mcpPill: 'Workspace'
  },
  {
    id: '24',
    name: 'Inbox Agent',
    icon: '🧹',
    category: 'tasks',
    command: 'Clean up my inbox',
    description: 'Categorizes emails, identifies priority messages, and archives spam',
    mcpPill: 'Workspace'
  },
  {
    id: '25',
    name: 'Schedule Optimizer',
    icon: '🗓️',
    category: 'calendar',
    command: 'Find me 3 hours this week for research',
    description: 'Analyzes Google Calendar schedule → blocks an optimal 3-hour focus window',
    mcpPill: 'Workspace'
  },
  {
    id: '26',
    name: 'Context-Aware Agent',
    icon: '🧠',
    category: 'memory',
    command: 'Continue the glacier work',
    description: 'Recovers previous research context, active scripts & SAR datasets automatically',
    mcpPill: 'NeoSapien'
  },
  {
    id: '27',
    name: 'Follow-up Tracker',
    icon: '📌',
    category: 'tasks',
    command: 'Who am I waiting for?',
    description: 'Searches emails and memories → identifies pending signoffs and replies',
    mcpPill: 'Multi-MCP'
  },
  {
    id: '28',
    name: 'College Assistant',
    icon: '🎓',
    category: 'engineering',
    command: 'What do I need to finish for SCET this week?',
    description: 'Synthesizes academic guidelines, project guide signoffs, and lab deadlines',
    mcpPill: 'Custom MCP'
  },
  {
    id: '29',
    name: 'Startup Assistant',
    icon: '🚀',
    category: 'startup',
    command: 'Prepare my startup priorities for this week',
    description: 'Aggregates TechSodh, MyEntryPass, and infrastructure priorities',
    mcpPill: 'Custom MCP'
  },
  {
    id: '30',
    name: 'Weekly Review',
    icon: '📈',
    category: 'briefing',
    command: 'Give me my weekly review',
    description: 'Calendar events + GitHub velocity + client emails + NeoSapien memory growth',
    mcpPill: 'Multi-MCP'
  },
  {
    id: '31',
    name: 'Proactive Assistant',
    icon: '🔮',
    category: 'briefing',
    command: 'Tell me anything important I might be missing',
    description: 'Proactively scans connected systems for unresolved deadlines and pending items',
    mcpPill: 'Multi-MCP'
  }
];

interface Props {
  onRunFeature: (command: string) => Promise<void>;
  isRunning: boolean;
}

export const AgentFeatureSuite: React.FC<Props> = ({ onRunFeature, isRunning }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFeatures = ALL_31_FEATURES.filter((f) => {
    const matchesCat = filterCategory === 'all' || f.category === filterCategory;
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-2xl backdrop-blur-sm space-y-5 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Complete 31-Feature Agent Capability Suite
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
              31 / 31 Active
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Click any command or speak it aloud — the Gemini Agent orchestrates NeoSapien, Google Workspace, and Custom MCPs automatically.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features & commands..."
            className="bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-neutral-500 w-64 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-800/80 pb-3">
        {[
          { id: 'all', label: 'All 31 Features' },
          { id: 'calendar', label: '📅 Calendar & Meetings' },
          { id: 'memory', label: '🧠 Memory & Context' },
          { id: 'briefing', label: '🌅 Briefings & Reviews' },
          { id: 'startup', label: '🚀 Startups (TechSodh/MyEntryPass)' },
          { id: 'engineering', label: '💻 GitHub & Research' },
          { id: 'tasks', label: '⏰ Reminders & Email' }
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilterCategory(c.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              filterCategory === c.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredFeatures.map((f) => (
          <div
            key={f.id}
            className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-neutral-700 transition flex flex-col justify-between space-y-2 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="text-base">{f.icon}</span>
                  {f.name}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                  f.mcpPill === 'NeoSapien'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : f.mcpPill === 'Workspace'
                      ? 'bg-blue-950 text-blue-300 border-blue-800'
                      : f.mcpPill === 'Custom MCP'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-purple-950 text-purple-300 border-purple-800'
                }`}>
                  {f.mcpPill}
                </span>
              </div>

              {/* Command text */}
              <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800/80 font-mono text-[11px] text-emerald-300 font-semibold mb-1.5 leading-snug">
                "{f.command}"
              </div>

              {/* Description */}
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {f.description}
              </p>
            </div>

            {/* Run Button */}
            <div className="pt-2 border-t border-neutral-900 flex justify-end">
              <button
                type="button"
                onClick={() => onRunFeature(f.command)}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-emerald-600 text-neutral-200 hover:text-white rounded-lg text-[11px] font-medium transition shadow disabled:opacity-50 group-hover:bg-emerald-600 group-hover:text-white"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Run Command</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
