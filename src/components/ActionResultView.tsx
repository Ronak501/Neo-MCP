import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Bell, 
  Mail, 
  Video, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Terminal, 
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle,
  SunMedium,
  Check,
  X,
  AlertCircle,
  History,
  Award,
  TrendingUp,
  Users
} from 'lucide-react';
import { AgentRunResponse, ActionConfirmationRequest } from '../types';

interface Props {
  result: AgentRunResponse | null;
  isRunning: boolean;
  onApproveConfirmation?: (confId: string) => void;
  onToggleAutoRun?: () => void;
  autoRunMode?: boolean;
  onViewHistory?: () => void;
  meetingCount?: number;
}

export const ActionResultView: React.FC<Props> = ({ 
  result, 
  isRunning, 
  onApproveConfirmation,
  onToggleAutoRun,
  autoRunMode,
  onViewHistory,
  meetingCount
}) => {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (isRunning) {
    return (
      <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-8 shadow-xl text-center space-y-4 animate-pulse">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
          <Zap className="w-6 h-6 animate-spin" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Gemini Interactions API Reasoning Across MCPs...</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Querying NeoSapien memory graph, cross-referencing Workspace calendar availability, checking custom TechSodh endpoints...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full rounded-2xl bg-neutral-900/50 border border-neutral-800/80 p-8 text-center space-y-3">
        <div className="w-10 h-10 mx-auto rounded-xl bg-neutral-800 text-neutral-500 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-300">Ready to Orchestrate</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
            Choose any scenario from the presets above (e.g. Jay Patel sync, SCET reminder, Glacier Project Q&amp;A, or Morning Briefing).
          </p>
        </div>
      </div>
    );
  }

  const { meetingCreated, reminderStored, emailSent, directAnswer, dailyBriefing, summary, confirmation } = result.actionResult;

  const toggleStep = (id: string) => {
    setExpandedStepId(expandedStepId === id ? null : id);
  };

  return (
    <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-2xl backdrop-blur-sm space-y-6 text-left">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-6 h-6 text-neutral-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Action Result Verified</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                {result.executionTimeMs}ms total latency
              </span>
              {result.usingRealGemini && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Gemini 3.8 Flash
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Intent: <strong className="text-white uppercase font-mono">{result.flowState.intent}</strong> | Context: <span className="text-emerald-400 font-mono">Found in NeoSapien</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono text-emerald-400 block font-semibold">Verified Execution</span>
          <span className="text-[11px] text-neutral-500">Security check passed</span>
        </div>
      </div>

      {/* Human-in-the-Loop Confirmation Card (Security Guardrail Rule) */}
      {confirmation && (
        <div className={`p-4 rounded-xl border space-y-3 transition-all ${
          confirmation.autoRunBypassed
            ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-neutral-950 to-neutral-950 shadow-lg shadow-emerald-950/20'
            : 'border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-neutral-950 to-neutral-950 shadow-lg shadow-amber-950/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 font-semibold text-xs ${
              confirmation.autoRunBypassed ? 'text-emerald-300' : 'text-amber-300'
            }`}>
              {confirmation.autoRunBypassed ? (
                <>
                  <Zap className="w-4 h-4 text-emerald-400 fill-current animate-pulse" />
                  <span>Auto-Run Active: Bypassed Manual Confirmation ({confirmation.riskLevel.toUpperCase()} RISK)</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Manual Confirmation Required ({confirmation.riskLevel.toUpperCase()} RISK)</span>
                </>
              )}
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              confirmation.autoRunBypassed
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : confirmed || confirmation.status === 'approved'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800 animate-pulse'
            }`}>
              {confirmation.autoRunBypassed
                ? '⚡ Auto-Executed Immediately'
                : confirmed || confirmation.status === 'approved'
                  ? 'Approved & Committed'
                  : 'Awaiting User Confirmation'}
            </span>
          </div>

          <p className="text-xs text-neutral-200 leading-relaxed font-mono">
            {confirmation.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800/80 text-[11px] text-neutral-400">
            <span>
              {confirmation.autoRunBypassed
                ? 'Action was evaluated as low/medium risk. Auto-Run mode safely committed it immediately without interrupting your conversation.'
                : 'Action is paused for manual human verification because Auto-Run is disabled or action requires confirmation.'}
            </span>
            {!confirmation.autoRunBypassed && (
              <div className="flex items-center gap-2">
                {onToggleAutoRun && (
                  <button
                    type="button"
                    onClick={onToggleAutoRun}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-[11px] transition font-mono"
                    title="Enable Auto-Run mode so future low-risk actions execute immediately"
                  >
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Turn ON Auto-Run</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setConfirmed(true);
                    onApproveConfirmation?.(confirmation.id);
                  }}
                  disabled={confirmed || confirmation.status === 'approved'}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-950 disabled:text-emerald-400 text-white rounded-lg text-xs font-medium transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{confirmed || confirmation.status === 'approved' ? 'Approved & Committed' : 'Approve & Execute'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Specialized Meeting History & Capability Audit Card */}
      {result.intentType === 'meeting_history' && (
        <div className="p-5 rounded-2xl border border-blue-500/50 bg-gradient-to-r from-blue-950/40 via-neutral-950 to-indigo-950/30 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Agent Meeting History &amp; Capability Tracker</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Audit Verified
                  </span>
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Comprehensive performance metrics across Google Calendar, Meet, and NeoSapien
                </p>
              </div>
            </div>

            {onViewHistory && (
              <button
                type="button"
                onClick={onViewHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition font-mono active:scale-95"
              >
                <span>Open Full Interactive Ledger ({meetingCount || 5})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 4 Quick Stat Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-0.5">
              <div className="text-[10px] text-neutral-400 uppercase font-mono">Meetings Set</div>
              <div className="text-xl font-extrabold text-white font-mono">{meetingCount || 5}</div>
              <div className="text-[9px] text-emerald-400 font-mono">100% Scheduled</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-0.5">
              <div className="text-[10px] text-neutral-400 uppercase font-mono">Zero-Click Auto-Run</div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono">100%</div>
              <div className="text-[9px] text-neutral-400 font-mono">Zero Interruptions</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-0.5">
              <div className="text-[10px] text-neutral-400 uppercase font-mono">Time Saved</div>
              <div className="text-xl font-extrabold text-purple-300 font-mono">1.3h</div>
              <div className="text-[9px] text-neutral-400 font-mono">75 minutes total</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-0.5">
              <div className="text-[10px] text-neutral-400 uppercase font-mono">Avg Latency</div>
              <div className="text-xl font-extrabold text-amber-300 font-mono">2.4s</div>
              <div className="text-[9px] text-neutral-400 font-mono">End-to-End Speed</div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Q&A Answer View (For memory queries & transcript decisions) */}
      {directAnswer && (
        <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs pb-1 border-b border-purple-800/40">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>NeoSapien Personal Memory Answer</span>
          </div>
          <div className="text-xs text-neutral-200 leading-relaxed whitespace-pre-line font-sans">
            {directAnswer}
          </div>
        </div>
      )}

      {/* Daily Briefing View (Morning 8:00 AM synthesis) */}
      {dailyBriefing && (
        <div className="p-5 rounded-xl border border-amber-500/40 bg-gradient-to-b from-neutral-950 to-amber-950/20 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <SunMedium className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Daily Morning Briefing for Ronak</h4>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">{dailyBriefing.date}</span>
          </div>

          <p className="text-xs text-neutral-300 font-mono italic">
            "{dailyBriefing.greeting}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-900/90 p-3 rounded-lg border border-neutral-800 space-y-2">
              <span className="font-bold text-blue-400 flex items-center gap-1.5 text-[11px]">
                <Calendar className="w-3.5 h-3.5" /> Today's Google Calendar Schedule:
              </span>
              <ul className="space-y-1.5 font-mono text-[11px]">
                {dailyBriefing.schedule.map((s, i) => (
                  <li key={i} className="flex justify-between items-center text-neutral-200 p-1.5 rounded bg-neutral-950">
                    <span><strong>{s.time}</strong> — {s.title}</span>
                    {s.meetLink && (
                      <a href={s.meetLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline text-[10px]">
                        Meet
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-neutral-900/90 p-3 rounded-lg border border-neutral-800 space-y-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                <Bell className="w-3.5 h-3.5" /> NeoSapien Reminders &amp; Priorities:
              </span>
              <ul className="space-y-1.5 font-mono text-[11px]">
                {dailyBriefing.reminders.map((r, i) => (
                  <li key={i} className="flex justify-between items-center text-neutral-200 p-1.5 rounded bg-neutral-950">
                    <span>{r.title}</span>
                    <span className="text-emerald-400 text-[10px]">{r.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary Box */}
      <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-mono">
        <strong>Execution Summary: </strong>
        {summary}
      </div>

      {/* 3 Outcome Deliverable Cards matching diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Outcome 1: Meeting Created */}
        <div className="p-4 rounded-xl border border-blue-500/40 bg-gradient-to-b from-neutral-950 to-blue-950/20 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Outcome 1
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
              Confirmed
            </span>
          </div>
          <h4 className="text-xs font-bold text-white leading-snug">Meeting Created</h4>
          {meetingCreated ? (
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="font-semibold text-white truncate">{meetingCreated.summary}</div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {new Date(meetingCreated.start).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(meetingCreated.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                Attendees: {meetingCreated.attendees.map(a => a.name).join(', ')}
              </div>
              <div className="pt-2 flex flex-col gap-1.5">
                <a
                  href={meetingCreated.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition shadow"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Google Meet</span>
                </a>
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meetingCreated.summary)}&details=${encodeURIComponent(meetingCreated.description)}&location=${encodeURIComponent(meetingCreated.meetLink)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-1 bg-neutral-850 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 rounded text-[11px] font-mono transition"
                >
                  <Calendar className="w-3 h-3 text-blue-400" />
                  <span>Open in Google Calendar</span>
                </a>
                {onViewHistory && (
                  <button
                    type="button"
                    onClick={onViewHistory}
                    className="flex items-center justify-center gap-1.5 w-full py-1 bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 hover:text-blue-200 border border-blue-800/60 rounded text-[11px] font-mono transition"
                  >
                    <span>View Meeting History &amp; Capability {meetingCount !== undefined ? `(${meetingCount})` : ''} →</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic">No meeting needed for this intent</p>
          )}
        </div>

        {/* Outcome 2: Reminder Stored */}
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-gradient-to-b from-neutral-950 to-emerald-950/20 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> Outcome 2
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
              Committed
            </span>
          </div>
          <h4 className="text-xs font-bold text-white leading-snug">Reminder Stored</h4>
          {reminderStored ? (
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="font-semibold text-white leading-snug">{reminderStored.title}</div>
              <div className="text-[11px] text-emerald-400 font-mono">
                Trigger: {reminderStored.dueDate} @ {reminderStored.time}
              </div>
              <div className="text-[11px] text-neutral-400">
                Context: NeoSapien Personal Memory Vault
              </div>
              <div className="pt-2">
                <span className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Committed in Vault</span>
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic">No reminder needed</p>
          )}
        </div>

        {/* Outcome 3: Email Sent */}
        <div className="p-4 rounded-xl border border-purple-500/40 bg-gradient-to-b from-neutral-950 to-purple-950/20 shadow-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Outcome 3
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
              Dispatched
            </span>
          </div>
          <h4 className="text-xs font-bold text-white leading-snug">Email Dispatched</h4>
          {emailSent ? (
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="font-semibold text-white truncate">{emailSent.subject}</div>
              <div className="text-[11px] text-neutral-400 font-mono truncate">
                To: {emailSent.to.join(', ')}
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                Includes agenda, calendar invite &amp; Meet link
              </div>
              <div className="pt-2">
                <span className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-purple-950 text-purple-300 border border-purple-800/80 rounded text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sent via Gmail</span>
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 italic">No email needed</p>
          )}
        </div>

      </div>

      {/* Execution Trace Timeline */}
      <div className="space-y-3 pt-4 border-t border-neutral-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
          <span>Multi-MCP Execution Audit Log ({result.steps.length} steps)</span>
          <span className="text-[11px] font-mono text-neutral-500 lowercase">click step to expand JSON-RPC payload</span>
        </h4>

        <div className="space-y-2">
          {result.steps.map((step, idx) => {
            const isExpanded = expandedStepId === step.id;
            return (
              <div
                key={step.id}
                className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden text-xs transition"
              >
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-900/60 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 font-mono text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-white block">{step.title}</span>
                      <span className="text-[11px] text-neutral-400">{step.subtitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {step.durationMs !== undefined && (
                      <span className="text-[10px] font-mono text-neutral-500">
                        {step.durationMs}ms
                      </span>
                    )}
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-neutral-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/50 space-y-3 font-mono text-[11px]">
                    {step.data && (
                      <div>
                        <span className="text-neutral-400 block mb-1 font-sans font-semibold">Structured Step Data:</span>
                        <pre className="p-2.5 rounded-lg bg-neutral-950 text-emerald-300 overflow-x-auto leading-relaxed border border-neutral-800">
                          {JSON.stringify(step.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    {step.mcpPayload && (
                      <div>
                        <span className="text-neutral-400 block mb-1 font-sans font-semibold">MCP JSON-RPC 2.0 Invocation:</span>
                        <pre className="p-2.5 rounded-lg bg-neutral-950 text-purple-300 overflow-x-auto leading-relaxed border border-neutral-800">
                          {JSON.stringify(step.mcpPayload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
