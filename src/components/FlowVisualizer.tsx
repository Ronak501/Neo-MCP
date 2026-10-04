import React from 'react';
import { 
  User, 
  Sparkles, 
  Cpu, 
  Database, 
  Calendar, 
  Mail, 
  Video, 
  CheckCircle2, 
  Bell, 
  FileText, 
  Compass, 
  ArrowDown,
  Layers,
  Activity,
  ShieldCheck,
  AlertTriangle,
  FolderGit2,
  Box,
  Share2
} from 'lucide-react';
import { AgentRunResponse } from '../types';

interface Props {
  currentPrompt: string;
  runResult: AgentRunResponse | null;
  isRunning: boolean;
  activeNode: string | null;
  onSelectNode: (nodeId: string) => void;
  safeMode: boolean;
  autoRunMode?: boolean;
}

export const FlowVisualizer: React.FC<Props> = ({
  currentPrompt,
  runResult,
  isRunning,
  activeNode,
  onSelectNode,
  safeMode,
  autoRunMode = true
}) => {
  const isAgentDone = !!runResult;
  const isNeoSapienDone = !!runResult?.actionResult?.reminderStored || runResult?.intentType === 'query_memory' || runResult?.intentType === 'query_transcript';
  const isWorkspaceDone = !!runResult?.actionResult?.meetingCreated;
  const isCustomDone = runResult?.flowState?.topic?.includes('TechSodh') || runResult?.flowState?.topic?.includes('SCET');

  return (
    <div className="relative w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Ronak Personal Agent: 3-Pillar MCP Architecture
              {isRunning && (
                <span className="flex items-center gap-1.5 text-[11px] font-mono font-normal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                  <Activity className="w-3 h-3 animate-spin" /> Live Routing
                </span>
              )}
            </h3>
            <p className="text-xs text-neutral-400">
              User (Ronak) → Gemini Agent (Interactions API) → MCP Router → NeoSapien + Workspace + Custom MCP → Security Guardrail → Action Result
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> NeoSapien MCP
          </span>
          <span className="text-neutral-600">|</span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-blue-400" /> Workspace MCP
          </span>
          <span className="text-neutral-600">|</span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Custom MCP (TechSodh/SCET)
          </span>
        </div>
      </div>

      {/* Diagram Layout */}
      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        
        {/* NODE 1: User (Ronak) */}
        <div 
          onClick={() => onSelectNode('user')}
          className={`w-full max-w-sm rounded-xl border p-4 transition-all duration-300 cursor-pointer text-left relative ${
            activeNode === 'user' 
              ? 'border-indigo-400 bg-indigo-950/40 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/50' 
              : 'border-neutral-700 bg-neutral-950/80 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">User (Ronak Talaviya)</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-300/80 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/40">
              Natural Language Request
            </span>
          </div>
          <div className="bg-neutral-900/90 rounded-lg p-2.5 border border-neutral-800 font-mono text-xs text-white flex items-center gap-2 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate font-semibold">"{currentPrompt}"</span>
          </div>
        </div>

        {/* Connector 1 -> 2 */}
        <div className="flex flex-col items-center my-2 relative">
          <div className={`w-0.5 h-7 transition-colors duration-500 ${isRunning || isAgentDone ? 'bg-indigo-400' : 'bg-neutral-800'}`} />
          <ArrowDown className={`w-3.5 h-3.5 -mt-1 transition-colors duration-500 ${isRunning || isAgentDone ? 'text-indigo-400' : 'text-neutral-700'}`} />
        </div>

        {/* NODE 2: Gemini Agent (Interactions API) */}
        <div 
          onClick={() => onSelectNode('agent')}
          className={`w-full max-w-md rounded-xl border p-4 transition-all duration-300 cursor-pointer text-left relative ${
            activeNode === 'agent'
              ? 'border-purple-400 bg-purple-950/40 shadow-xl shadow-purple-500/20 ring-1 ring-purple-400/50'
              : isRunning 
                ? 'border-purple-500/80 bg-purple-950/20 animate-pulse'
                : 'border-neutral-700 bg-neutral-950/80 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/30">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Gemini Agent (Interactions API)</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40">
              Reasoning Engine
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs mt-2">
            <div className="bg-neutral-900/90 rounded-lg p-2 border border-neutral-800">
              <span className="text-[9px] text-neutral-400 block mb-0.5">Intent</span>
              <span className="font-semibold text-purple-300 text-[10px]">Understand Goal</span>
            </div>
            <div className="bg-neutral-900/90 rounded-lg p-2 border border-neutral-800">
              <span className="text-[9px] text-neutral-400 block mb-0.5">Context</span>
              <span className="font-semibold text-emerald-300 text-[10px]">Check Memories</span>
            </div>
            <div className="bg-neutral-900/90 rounded-lg p-2 border border-neutral-800">
              <span className="text-[9px] text-neutral-400 block mb-0.5">Action</span>
              <span className="font-semibold text-blue-300 text-[10px]">Orchestrate Tools</span>
            </div>
          </div>
        </div>

        {/* Connector to Router */}
        <div className="flex flex-col items-center my-2 relative">
          <div className={`w-0.5 h-6 transition-colors duration-500 ${isRunning || isAgentDone ? 'bg-purple-400' : 'bg-neutral-800'}`} />
          <ArrowDown className={`w-3.5 h-3.5 -mt-1 transition-colors duration-500 ${isRunning || isAgentDone ? 'text-purple-400' : 'text-neutral-700'}`} />
        </div>

        {/* NODE 2.5: MCP / Tool Router */}
        <div 
          onClick={() => onSelectNode('router')}
          className="w-full max-w-sm rounded-lg border border-neutral-700 bg-neutral-950 p-2.5 text-center cursor-pointer hover:border-neutral-500 transition"
        >
          <div className="flex items-center justify-center gap-2">
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">MCP / Tool Router</span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-0.5">Decides order, dependencies, and dispatches JSON-RPC payloads</p>
        </div>

        {/* 3-WAY SPLIT SVG WIRES */}
        <div className="w-full max-w-3xl h-12 relative flex justify-center">
          <svg className="w-full h-full" viewBox="0 0 600 50" preserveAspectRatio="none">
            {/* Center line down to router split */}
            <path d="M 300 0 L 300 20" stroke={isRunning || isAgentDone ? '#a855f7' : '#334155'} strokeWidth="2" fill="none" />
            
            {/* Left wire to NeoSapien MCP */}
            <path
              d="M 300 20 L 100 20 L 100 50"
              stroke={isRunning || isNeoSapienDone ? '#10b981' : '#334155'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isRunning ? '4 2' : 'none'}
            />
            {/* Middle wire to Google Workspace MCP */}
            <path
              d="M 300 20 L 300 50"
              stroke={isRunning || isWorkspaceDone ? '#3b82f6' : '#334155'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isRunning ? '4 2' : 'none'}
            />
            {/* Right wire to Custom MCP */}
            <path
              d="M 300 20 L 500 20 L 500 50"
              stroke={isRunning || isCustomDone ? '#f59e0b' : '#334155'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={isRunning ? '4 2' : 'none'}
            />
          </svg>
        </div>

        {/* 3 PARALLEL MCP NODES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          
          {/* 1. NeoSapien MCP */}
          <div
            onClick={() => onSelectNode('neosapien')}
            className={`rounded-xl border p-3.5 transition-all cursor-pointer text-left ${
              activeNode === 'neosapien'
                ? 'border-emerald-400 bg-emerald-950/40 shadow-lg ring-1 ring-emerald-400/50'
                : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-neutral-800">
              <Database className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white">NeoSapien MCP</h4>
                <span className="text-[10px] text-neutral-400 font-mono">Personal Vault</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-neutral-300">
              <div className="p-1 rounded bg-neutral-900/90 flex justify-between">
                <span>Memories:</span> <span className="font-mono text-emerald-400">Jay, Rahul, SCET</span>
              </div>
              <div className="p-1 rounded bg-neutral-900/90 flex justify-between">
                <span>Transcripts:</span> <span className="font-mono text-emerald-400">Glacier / TechSodh</span>
              </div>
              <div className="p-1 rounded bg-neutral-900/90 flex justify-between">
                <span>Reminders:</span> <span className="font-mono text-emerald-400">Contextual Prep</span>
              </div>
            </div>
          </div>

          {/* 2. Google Workspace MCP */}
          <div
            onClick={() => onSelectNode('workspace')}
            className={`rounded-xl border p-3.5 transition-all cursor-pointer text-left ${
              activeNode === 'workspace'
                ? 'border-blue-400 bg-blue-950/40 shadow-lg ring-1 ring-blue-400/50'
                : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-neutral-800">
              <Calendar className="w-4 h-4 text-blue-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Google Workspace</h4>
                <span className="text-[10px] text-neutral-400 font-mono">1P Tooling MCP</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-neutral-300">
              <div className="p-1 rounded bg-neutral-900/90 flex justify-between">
                <span>Calendar:</span> <span className="font-mono text-blue-400">Check Availability</span>
              </div>
              <div className="p-1 rounded bg-neutral-900/90 flex justify-between">
                <span>Google Meet:</span> <span className="font-mono text-blue-400">Conference Links</span>
              </div>
              <div className="p-1 rounded bg-neutral-900/90 flex justify-between">
                <span>Gmail:</span> <span className="font-mono text-blue-400">Invitations / Drafts</span>
              </div>
            </div>
          </div>

          {/* 3. Custom MCP (Your Own MCP) */}
          <div
            onClick={() => onSelectNode('custom')}
            className={`rounded-xl border p-3.5 transition-all cursor-pointer text-left ${
              activeNode === 'custom'
                ? 'border-amber-400 bg-amber-950/40 shadow-lg ring-1 ring-amber-400/50'
                : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-neutral-800">
              <Box className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Custom MCP Tools</h4>
                <span className="text-[10px] text-neutral-400 font-mono">Your Own Ecosystem</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-neutral-300">
              <div className="p-1 rounded bg-neutral-900/90 flex justify-between">
                <span>TechSodh:</span> <span className="font-mono text-amber-400">AI Scanner API</span>
              </div>
              <div className="p-1 rounded bg-neutral-900/90 flex justify-between">
                <span>MyEntryPass:</span> <span className="font-mono text-amber-400">Access Tokens</span>
              </div>
              <div className="p-1 rounded bg-neutral-900/90 flex justify-between">
                <span>SCET Portal:</span> <span className="font-mono text-amber-400">Academic Docs</span>
              </div>
            </div>
          </div>

        </div>

        {/* CONVERGE SVG WIRES */}
        <div className="w-full max-w-3xl h-10 relative flex justify-center">
          <svg className="w-full h-full" viewBox="0 0 600 40" preserveAspectRatio="none">
            <path d="M 100 0 L 100 20 L 300 20" stroke={runResult ? '#10b981' : '#334155'} strokeWidth="2" fill="none" />
            <path d="M 300 0 L 300 20" stroke={runResult ? '#3b82f6' : '#334155'} strokeWidth="2" fill="none" />
            <path d="M 500 0 L 500 20 L 300 20" stroke={runResult ? '#f59e0b' : '#334155'} strokeWidth="2" fill="none" />
            <path d="M 300 20 L 300 40" stroke={runResult ? '#10b981' : '#334155'} strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* SECURITY GUARDRAIL (Human-in-the-Loop & Auto-Run Policy) */}
        <div 
          onClick={() => onSelectNode('security')}
          className={`w-full max-w-md rounded-xl border p-3 mb-2 flex items-center justify-between cursor-pointer transition ${
            autoRunMode
              ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/30 to-neutral-950 hover:border-emerald-400'
              : 'border-amber-600/40 bg-gradient-to-r from-amber-950/30 to-neutral-950 hover:border-amber-500'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className={`w-4 h-4 ${autoRunMode ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div className="text-left">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Security Guardrail</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {autoRunMode ? '(Auto-Run Active)' : '(Manual HITL Mode)'}
                </span>
              </span>
              <span className="text-[10px] text-neutral-400">
                {autoRunMode 
                  ? 'Low-risk actions bypass confirm & execute immediately from ambient voice' 
                  : 'All sensitive & low-risk actions pause for explicit human review'}
              </span>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            runResult?.actionResult?.confirmation?.autoRunBypassed
              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
              : autoRunMode
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                : 'bg-amber-950 text-amber-300 border-amber-800'
          }`}>
            {runResult?.actionResult?.confirmation?.autoRunBypassed
              ? '⚡ Auto-Bypassed'
              : autoRunMode
                ? '⚡ Auto-Run ON'
                : '🛡️ Manual HITL'}
          </span>
        </div>

        {/* Connector to Action Result */}
        <div className="flex flex-col items-center my-1 relative">
          <ArrowDown className={`w-3.5 h-3.5 transition-colors duration-500 ${runResult ? 'text-emerald-400' : 'text-neutral-700'}`} />
        </div>

        {/* NODE 5: Action Result */}
        <div
          onClick={() => onSelectNode('result')}
          className={`w-full max-w-md rounded-xl border p-4 transition-all duration-300 cursor-pointer text-left relative ${
            activeNode === 'result'
              ? 'border-emerald-400 bg-emerald-950/40 shadow-xl shadow-emerald-500/20 ring-1 ring-emerald-400/50'
              : runResult
                ? 'border-emerald-500/80 bg-neutral-950/90'
                : 'border-neutral-700 bg-neutral-950/80 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">Action Result</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
              Verified Deliverables
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs mt-2 text-center">
            <div className="bg-neutral-900/90 rounded-lg p-2 border border-neutral-800">
              <Calendar className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
              <span className="font-semibold text-white text-[10px] block">Meeting created</span>
              <span className="text-[9px] text-neutral-400">Google Calendar</span>
            </div>
            <div className="bg-neutral-900/90 rounded-lg p-2 border border-neutral-800">
              <Bell className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
              <span className="font-semibold text-white text-[10px] block">Reminder stored</span>
              <span className="text-[9px] text-neutral-400">NeoSapien Vault</span>
            </div>
            <div className="bg-neutral-900/90 rounded-lg p-2 border border-neutral-800">
              <Mail className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
              <span className="font-semibold text-white text-[10px] block">Email sent</span>
              <span className="text-[9px] text-neutral-400">Gmail API</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
