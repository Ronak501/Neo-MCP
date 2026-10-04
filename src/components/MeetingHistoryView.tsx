import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Video, 
  Clock, 
  Users, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Filter, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  Mic, 
  Terminal, 
  Copy, 
  Check,
  History,
  Activity,
  Layers,
  Award
} from 'lucide-react';
import { AgentMeetingRecord, MeetingCapabilityMetrics } from '../types';

interface Props {
  meetings: AgentMeetingRecord[];
  metrics: MeetingCapabilityMetrics | null;
  onScheduleQuickMeeting?: (prompt: string) => void;
  isRunning?: boolean;
}

export const MeetingHistoryView: React.FC<Props> = ({
  meetings,
  metrics,
  onScheduleQuickMeeting,
  isRunning = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<'all' | 'ambient_voice' | 'typed_prompt'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fallback metrics if null
  const computedMetrics = useMemo(() => {
    if (metrics) return metrics;
    const total = meetings.length;
    const autoRun = meetings.filter(m => m.autoRunBypassed).length;
    return {
      totalMeetingsSet: total,
      autoRunExecutions: autoRun,
      zeroClickRatePercent: total > 0 ? Math.round((autoRun / total) * 100) : 100,
      topCollaborators: [
        { name: 'Jay Patel', email: 'jay@example.com', count: 2, role: 'TechSodh Lead' },
        { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', count: 2, role: 'Lead Cloud Architect' },
        { name: 'Sarah Jenkins', email: 'sarah.j@example.com', count: 1, role: 'Product UI Lead' }
      ],
      avgSchedulingLatencyMs: 2450,
      estimatedTimeSavedMinutes: total * 15,
      meetLinksGenerated: total,
      invitesDispatched: total,
      remindersCreated: total
    };
  }, [metrics, meetings]);

  const filteredMeetings = useMemo(() => {
    return meetings.filter(m => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        m.summary.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.triggerPrompt.toLowerCase().includes(q) ||
        m.attendees.some(a => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
      
      const matchesSource = filterSource === 'all' || m.source === filterSource;
      return matchesSearch && matchesSource;
    });
  }, [meetings, searchQuery, filterSource]);

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner & Capability Overview */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-blue-950/40 via-neutral-900/90 to-purple-950/40 border border-blue-500/40 p-6 shadow-2xl backdrop-blur-md space-y-6 text-left">
        
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Agent Meeting History &amp; Capability Tracker
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-400" />
                  Active Audit Ledger
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Track how many meetings this agent has autonomously coordinated across Google Calendar, Meet, Gmail, and NeoSapien memory.
              </p>
            </div>
          </div>

          {/* Quick Schedule Prompt Test Button */}
          {onScheduleQuickMeeting && (
            <button
              onClick={() => onScheduleQuickMeeting('Set a meeting with Jay tomorrow afternoon to discuss TechSodh')}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Schedule New Meeting via Agent</span>
            </button>
          )}
        </div>

        {/* 4 Primary Capability Metric KPI Scorecards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          
          {/* KPI 1: Total Meetings Set */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-blue-500/30 shadow-inner space-y-1">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-mono text-[11px] uppercase tracking-wider">Total Meetings Set</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono flex items-baseline gap-2">
              <span>{computedMetrics.totalMeetingsSet}</span>
              <span className="text-xs text-emerald-400 font-semibold font-sans">Scheduled</span>
            </div>
            <p className="text-[10px] text-neutral-500">
              Coordinated via natural language &amp; ambient speech
            </p>
          </div>

          {/* KPI 2: Zero-Click Auto-Run Success */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-emerald-500/30 shadow-inner space-y-1">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-mono text-[11px] uppercase tracking-wider">Zero-Click Auto-Run</span>
              <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-mono flex items-baseline gap-2">
              <span>{computedMetrics.zeroClickRatePercent}%</span>
              <span className="text-xs text-neutral-400 font-normal">({computedMetrics.autoRunExecutions} auto)</span>
            </div>
            <p className="text-[10px] text-neutral-500">
              Bypassed manual confirmation for low-risk actions
            </p>
          </div>

          {/* KPI 3: Time Saved */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-purple-500/30 shadow-inner space-y-1">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-mono text-[11px] uppercase tracking-wider">Estimated Time Saved</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 tracking-tight font-mono flex items-baseline gap-2">
              <span>{(computedMetrics.estimatedTimeSavedMinutes / 60).toFixed(1)}h</span>
              <span className="text-xs text-neutral-400 font-normal">({computedMetrics.estimatedTimeSavedMinutes}m)</span>
            </div>
            <p className="text-[10px] text-neutral-500">
              Eliminated email back-and-forth &amp; calendar lookups
            </p>
          </div>

          {/* KPI 4: Turnaround Latency */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-amber-500/30 shadow-inner space-y-1">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-mono text-[11px] uppercase tracking-wider">Avg Scheduling Speed</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight font-mono flex items-baseline gap-2">
              <span>{(computedMetrics.avgSchedulingLatencyMs / 1000).toFixed(1)}s</span>
              <span className="text-xs text-neutral-400 font-normal">end-to-end</span>
            </div>
            <p className="text-[10px] text-neutral-500">
              Cross-MCP reasoning &amp; delivery verification
            </p>
          </div>

        </div>

        {/* Deliverables Breakdown Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Google Calendar Events: <strong className="text-white">{computedMetrics.totalMeetingsSet}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Google Meet Links Generated: <strong className="text-white">{computedMetrics.meetLinksGenerated}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Gmail Invitations Dispatched: <strong className="text-white">{computedMetrics.invitesDispatched}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>NeoSapien Vault Reminders: <strong className="text-white">{computedMetrics.remindersCreated}</strong></span>
          </div>
        </div>

      </div>

      {/* Collaborator Distribution & Capability Profiles */}
      <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl space-y-3 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Collaborators Scheduled with by Agent
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500 font-mono">Resolved via NeoSapien Personal Directory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {computedMetrics.topCollaborators.map((c, i) => (
            <div 
              key={i} 
              className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 hover:border-neutral-700 transition flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white truncate">{c.name}</div>
                  <div className="text-[10px] text-neutral-400">{c.role || 'Collaborator'}</div>
                  <div className="text-[9px] text-neutral-500 font-mono">{c.email}</div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  {c.count} meet{c.count > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search, Filter, and Chronological Audit Ledger */}
      <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl space-y-4 text-left">
        
        {/* Search & Filter Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Chronological Meeting Ledger ({filteredMeetings.length} of {meetings.length})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search attendee, agenda, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 font-mono w-56"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setFilterSource('all')}
                className={`px-2 py-0.5 rounded ${filterSource === 'all' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterSource('ambient_voice')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 ${filterSource === 'ambient_voice' ? 'bg-emerald-950 text-emerald-300 font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                <Mic className="w-2.5 h-2.5" /> Ambient Voice
              </button>
              <button
                type="button"
                onClick={() => setFilterSource('typed_prompt')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 ${filterSource === 'typed_prompt' ? 'bg-blue-950 text-blue-300 font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                <Terminal className="w-2.5 h-2.5" /> Typed Prompt
              </button>
            </div>
          </div>
        </div>

        {/* Ledger List */}
        {filteredMeetings.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <Calendar className="w-8 h-8 text-neutral-600 mx-auto" />
            <p className="text-xs text-neutral-400 font-mono">No scheduled meetings match your filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterSource('all'); }}
              className="text-xs text-blue-400 hover:underline font-mono"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="p-4 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800/90 hover:border-neutral-700 transition space-y-3"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{meeting.summary}</span>
                      {meeting.autoRunBypassed ? (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400 fill-current" />
                          Auto-Run (Zero-Click)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-amber-400" />
                          Manual HITL Approved
                        </span>
                      )}
                      {meeting.relatedProject && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                          {meeting.relatedProject}
                        </span>
                      )}
                    </div>

                    {/* Trigger Prompt & Date Info */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 font-mono">
                      <span className="flex items-center gap-1 text-blue-300">
                        <Clock className="w-3 h-3 text-blue-400" />
                        Scheduled for: <strong>{new Date(meeting.start).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(meeting.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</strong>
                      </span>
                      <span>•</span>
                      <span>Execution Speed: <strong className="text-amber-300">{meeting.latencyMs}ms</strong></span>
                      <span>•</span>
                      <span>Trigger: <em className="text-neutral-300">"{meeting.triggerPrompt}"</em></span>
                    </div>
                  </div>

                  {/* Right side actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(meeting.meetLink, meeting.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-[11px] font-mono transition"
                      title="Copy Google Meet Link"
                    >
                      {copiedId === meeting.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Meet</span>
                        </>
                      )}
                    </button>

                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meet</span>
                    </a>
                  </div>
                </div>

                {/* Attendees and Agenda Details */}
                <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-neutral-500 font-mono text-[11px]">Attendees:</span>
                    {meeting.attendees.map((att, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <strong className="text-white">{att.name}</strong>
                        <span className="text-[10px] text-neutral-500 font-mono">&lt;{att.email}&gt;</span>
                      </span>
                    ))}
                  </div>

                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meeting.summary)}&details=${encodeURIComponent(meeting.description)}&location=${encodeURIComponent(meeting.meetLink)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-mono text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Open in Google Calendar →</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
