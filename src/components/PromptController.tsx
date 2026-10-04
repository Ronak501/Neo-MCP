import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Play, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  HelpCircle,
  FileQuestion,
  SunMedium,
  History,
  Award
} from 'lucide-react';

interface Props {
  onRunFlow: (prompt: string, autoApprove: boolean) => Promise<void>;
  isRunning: boolean;
  onResetData: () => Promise<void>;
  safeMode: boolean;
  onToggleSafeMode: () => void;
  autoRunMode: boolean;
  onToggleAutoRun: () => void;
  onViewHistory?: () => void;
  meetingCount?: number;
}

export const PRESET_SCENARIOS = [
  {
    category: 'Meeting',
    label: 'Meeting with Jay (TechSodh)',
    prompt: 'Set a meeting with Jay tomorrow afternoon to discuss TechSodh',
    desc: 'Queries NeoSapien for Jay Patel → Checks Calendar → Books Meet'
  },
  {
    category: 'Reminder',
    label: 'SCET Document Reminder',
    prompt: 'Remind me next Monday to submit the SCET document',
    desc: 'Stores contextual reminder in NeoSapien memory & Calendar'
  },
  {
    category: 'Memory',
    label: 'Memory Query: Work with Jay',
    prompt: 'What was I working on with Jay?',
    desc: 'Semantic search over NeoSapien personal memory graph'
  },
  {
    category: 'Transcript',
    label: 'Glacier Project with Prof X',
    prompt: 'I discussed the glacier project with Professor X last week. What did we decide?',
    desc: 'Retrieves meeting transcript & decision takeaways'
  },
  {
    category: 'Briefing',
    label: '8:00 AM Morning Briefing',
    prompt: "What's my schedule tomorrow and daily briefing?",
    desc: 'Aggregates Calendar + NeoSapien reminders + priority emails'
  },
  {
    category: 'Infra',
    label: 'Domain Renewal Reminder',
    prompt: 'Remind me to renew the domain in 20 days',
    desc: 'Commits domain renewal reminder for techsodh.com'
  },
  {
    category: 'Capability',
    label: 'Meeting History & Audit',
    prompt: 'Show meeting history and agent capability report',
    desc: 'Audit total meetings set, zero-click automation rate, and time saved'
  }
];

export const PromptController: React.FC<Props> = ({
  onRunFlow,
  isRunning,
  onResetData,
  safeMode,
  onToggleSafeMode,
  autoRunMode,
  onToggleAutoRun,
  onViewHistory,
  meetingCount
}) => {
  const [prompt, setPrompt] = useState('Set a meeting with Jay tomorrow afternoon to discuss TechSodh');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isRunning) return;
    onRunFlow(prompt.trim(), safeMode);
  };

  const handleSelectScenario = (p: string) => {
    setPrompt(p);
    onRunFlow(p, safeMode);
  };

  return (
    <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl backdrop-blur-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Ronak's Agent Dispatcher
            </span>
            <span className="text-[10px] text-neutral-400">Gemini Interactions API + Dual/Triple MCP Router</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Meeting History Ledger Shortcut */}
          {onViewHistory && (
            <button
              type="button"
              onClick={onViewHistory}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition bg-blue-950/70 text-blue-300 border-blue-800/80 hover:border-blue-500 hover:text-white"
              title="Audit and track agent capabilities: View all meetings scheduled by the agent"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>Meeting History ({meetingCount ?? 5})</span>
            </button>
          )}
          {/* Auto-Run Mode Toggle */}
          <button
            type="button"
            onClick={onToggleAutoRun}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition ${
              autoRunMode
                ? 'bg-gradient-to-r from-amber-950/80 to-emerald-950/80 text-emerald-300 border-emerald-600 font-semibold shadow-sm shadow-emerald-950/50'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
            title="When Auto-Run is enabled, low-risk actions bypass manual confirmation and execute immediately"
          >
            <Zap className={`w-3.5 h-3.5 ${autoRunMode ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-neutral-500'}`} />
            <span>Auto-Run: {autoRunMode ? 'ON (Zero-Click)' : 'OFF (Manual)'}</span>
          </button>

          {/* Security Guardrail Toggle */}
          <button
            type="button"
            onClick={onToggleSafeMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition ${
              safeMode
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                : 'bg-amber-950/60 text-amber-300 border-amber-800'
            }`}
            title="Toggle Human-in-the-Loop approval prompt"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HITL Guardrail: {safeMode ? 'Auto-Approve' : 'Confirm Sensitive'}</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-800 text-[11px] font-mono text-purple-300 border border-purple-800/40">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Gemini 3.8 Flash</span>
          </div>

          <button
            type="button"
            onClick={onResetData}
            title="Reset store to clean demo seed"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-400 hover:text-white transition border border-neutral-700"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main input form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "Set a meeting with Jay tomorrow afternoon to discuss TechSodh"'
          disabled={isRunning}
          className="w-full bg-neutral-950 border border-neutral-700/80 rounded-xl px-4 py-3.5 pr-32 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 shadow-inner font-mono disabled:opacity-50"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          <button
            type="submit"
            disabled={isRunning || !prompt.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-[0.98] disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Zap className="w-3.5 h-3.5 animate-spin" />
                <span>Routing...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Agent</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset scenario chips */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> One-Click Scenarios from your Architecture Brief:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.label}
              type="button"
              onClick={() => handleSelectScenario(scenario.prompt)}
              disabled={isRunning}
              className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-left transition disabled:opacity-50 group"
            >
              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mb-1">
                <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-semibold">{scenario.category}</span>
                <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">Run →</span>
              </div>
              <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                "{scenario.prompt}"
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                {scenario.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
