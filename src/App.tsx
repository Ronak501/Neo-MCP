import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Layers, 
  Database, 
  Calendar, 
  Cpu, 
  Sparkles, 
  ExternalLink, 
  Settings, 
  ShieldCheck, 
  RefreshCw,
  Zap,
  CheckCircle2,
  Workflow,
  Box,
  User,
  SunMedium,
  History,
  Award
} from 'lucide-react';
import { 
  NeoSapienMemory, 
  NeoSapienTranscript, 
  NeoSapienReminder, 
  WorkspaceEvent, 
  WorkspaceEmail, 
  AgentRunResponse,
  CustomProjectData,
  AgentMeetingRecord,
  MeetingCapabilityMetrics
} from './types';
import { FlowVisualizer } from './components/FlowVisualizer';
import { NeoSapienSettingsModal } from './components/NeoSapienSettingsModal';
import { NeoSapienContextView } from './components/NeoSapienContextView';
import { WorkspaceHub } from './components/WorkspaceHub';
import { ActionResultView } from './components/ActionResultView';
import { PromptController } from './components/PromptController';
import { CustomProjectsView } from './components/CustomProjectsView';
import { NeoAmbientListener } from './components/NeoAmbientListener';
import { AgentFeatureSuite } from './components/AgentFeatureSuite';
import { MeetingHistoryView } from './components/MeetingHistoryView';

export default function App() {
  const [currentPrompt, setCurrentPrompt] = useState('Set a meeting with Jay tomorrow afternoon to discuss TechSodh');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<AgentRunResponse | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'flow' | 'suite' | 'history' | 'neosapien' | 'workspace' | 'custom' | 'all'>('flow');
  const [safeMode, setSafeMode] = useState(true);
  const [autoRunMode, setAutoRunMode] = useState(true);

  // Server state
  const [memories, setMemories] = useState<NeoSapienMemory[]>([]);
  const [transcripts, setTranscripts] = useState<NeoSapienTranscript[]>([]);
  const [reminders, setReminders] = useState<NeoSapienReminder[]>([]);
  const [events, setEvents] = useState<WorkspaceEvent[]>([]);
  const [emails, setEmails] = useState<WorkspaceEmail[]>([]);
  const [customProjects, setCustomProjects] = useState<CustomProjectData[]>([]);
  const [meetingHistory, setMeetingHistory] = useState<AgentMeetingRecord[]>([]);
  const [meetingMetrics, setMeetingMetrics] = useState<MeetingCapabilityMetrics | null>(null);
  const [userProfile, setUserProfile] = useState({
    name: 'Ronak Talaviya',
    email: 'ronaktalaviya51@gmail.com',
    role: 'AI Engineer & Tech Lead',
    organization: 'TechSodh / SCET',
    timezone: 'Asia/Kolkata (IST)'
  });

  const [isNeoConnected, setIsNeoConnected] = useState(true);
  const [isWorkspaceConnected, setIsWorkspaceConnected] = useState(true);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [neoRes, wsRes, userRes, customRes, historyRes] = await Promise.all([
        fetch('/api/neosapien/state'),
        fetch('/api/workspace/state'),
        fetch('/api/user-profile'),
        fetch('/api/custom-mcp/state'),
        fetch('/api/agent/meeting-history')
      ]);

      const neoData = await neoRes.json();
      const wsData = await wsRes.json();
      const userData = await userRes.json();
      const customData = await customRes.json();
      const historyData = await historyRes.json();

      setMemories(neoData.memories || []);
      setTranscripts(neoData.transcripts || []);
      setReminders(neoData.reminders || []);
      setIsNeoConnected(neoData.connected ?? true);

      setEvents(wsData.events || []);
      setEmails(wsData.emails || []);
      setIsWorkspaceConnected(wsData.connected ?? true);

      if (userData.user) setUserProfile(userData.user);
      if (userData.security) {
        setSafeMode(userData.security.safeMode ?? true);
        if (typeof userData.security.autoRunMode === 'boolean') {
          setAutoRunMode(userData.security.autoRunMode);
        }
      }
      if (customData.projects) setCustomProjects(customData.projects);
      if (historyData.meetings) setMeetingHistory(historyData.meetings);
      if (historyData.metrics) setMeetingMetrics(historyData.metrics);
    } catch (err) {
      console.error('Failed to load initial state:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle Auto-Run Mode (Bypass confirm for low-risk actions)
  const handleToggleAutoRun = async () => {
    const nextMode = !autoRunMode;
    setAutoRunMode(nextMode);
    try {
      await fetch('/api/security/auto-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoRunMode: nextMode })
      });
    } catch (err) {
      console.error('Failed to toggle auto run mode:', err);
    }
  };

  // Approve pending confirmation
  const handleApproveConfirmation = async (confId: string) => {
    try {
      await fetch('/api/security/approve-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationId: confId })
      });
      if (runResult && runResult.actionResult.confirmation) {
        setRunResult({
          ...runResult,
          actionResult: {
            ...runResult.actionResult,
            confirmation: {
              ...runResult.actionResult.confirmation,
              status: 'approved',
              requiresApproval: false
            }
          }
        });
      }
      await fetchData();
    } catch (err) {
      console.error('Failed to approve confirmation:', err);
    }
  };

  // Run the agent flow
  const handleRunFlow = async (promptToRun: string, autoApprove: boolean = true) => {
    setCurrentPrompt(promptToRun);
    setIsRunning(true);
    setActiveNode('agent');

    try {
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptToRun, autoApprove, autoRunMode })
      });
      const data: AgentRunResponse = await res.json();
      setRunResult(data);
      setActiveNode('result');
      if (data.intentType === 'meeting_history') {
        setActiveTab('history');
      }
      // Refresh backend store state
      await fetchData();
    } catch (err) {
      console.error('Failed to run agent flow:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Autonomous Ingestion: Ambient Speech captured by NeoSapien hardware / microphone
  const handleIngestTranscript = async (transcript: string) => {
    setCurrentPrompt(transcript);
    setIsRunning(true);
    setActiveNode('agent');

    try {
      const res = await fetch('/api/neosapien/stream-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, speaker: 'Ronak', autoExecute: true, autoRunMode })
      });
      const data = await res.json();
      if (data.agentResult) {
        setRunResult(data.agentResult);
        if (data.agentResult.intentType === 'meeting_history') {
          setActiveTab('history');
        }
      }
      setActiveNode('result');
      await fetchData();
    } catch (err) {
      console.error('Failed to ingest ambient speech:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Toggle Neo connection
  const handleToggleNeo = async () => {
    try {
      const res = await fetch('/api/neosapien/toggle-connection', { method: 'POST' });
      const data = await res.json();
      setIsNeoConnected(data.connected);
    } catch (err) {
      setIsNeoConnected(!isNeoConnected);
    }
  };

  // Toggle Workspace connection
  const handleToggleWorkspace = async () => {
    try {
      const res = await fetch('/api/workspace/toggle-connection', { method: 'POST' });
      const data = await res.json();
      setIsWorkspaceConnected(data.connected);
    } catch (err) {
      setIsWorkspaceConnected(!isWorkspaceConnected);
    }
  };

  // Toggle Safe Mode
  const handleToggleSafeMode = async () => {
    try {
      const res = await fetch('/api/security/toggle', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ safeMode: !safeMode })
      });
      const data = await res.json();
      setSafeMode(data.security.safeMode);
    } catch (err) {
      setSafeMode(!safeMode);
    }
  };

  // Add Memory
  const handleAddMemory = async (newMem: { title: string; content: string; personName?: string; category?: string; tags?: string[] }) => {
    try {
      await fetch('/api/neosapien/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMem)
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to add memory:', err);
    }
  };

  // Add Reminder
  const handleAddReminder = async (newRem: { title: string; dueDate?: string; time?: string; relatedTo?: string; category?: string }) => {
    try {
      await fetch('/api/neosapien/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRem)
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to add reminder:', err);
    }
  };

  // Reset to seed
  const handleResetData = async () => {
    try {
      await fetch('/api/reset-data', { method: 'POST' });
      setRunResult(null);
      setActiveNode(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to reset data:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-neutral-100 flex flex-col font-sans selection:bg-purple-500/30">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-[#0a0d14]/90 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-emerald-400 p-[1px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-neutral-950 rounded-[11px] flex items-center justify-center">
                <Workflow className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">Ronak's Personal Agent</h1>
                <span className="text-neutral-500 text-sm font-light">/</span>
                <span className="text-xs font-semibold text-emerald-400">Triple-MCP Engine</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                NeoSapien Context + Google Workspace APIs + Custom TechSodh/SCET Tools
              </p>
            </div>
          </div>

          {/* User profile & Connection Badges */}
          <div className="flex items-center gap-2.5 text-xs">
            {/* User Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">Ronak Talaviya</span>
              <span className="text-[10px] text-neutral-500 font-mono">ronaktalaviya51@gmail.com</span>
            </div>

            {/* Meeting History & Capability Count Badge */}
            <button
              onClick={() => setActiveTab('history')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition border shadow-sm bg-neutral-900 border-neutral-800 hover:border-blue-500/60 text-neutral-300 hover:text-white"
              title="Track capability: View all meetings scheduled by the Agent"
            >
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>Meetings Set: <strong className="text-white font-mono">{meetingHistory.length}</strong></span>
            </button>

            {/* Auto-Run Mode Toggle Badge in Header */}
            <button
              onClick={handleToggleAutoRun}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition border shadow-sm ${
                autoRunMode
                  ? 'bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/60 hover:border-emerald-400 shadow-emerald-950/40'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
              title="Toggle Auto-Run mode: When enabled, low-risk actions execute immediately from ambient voice input without manual confirmation"
            >
              <Zap className={`w-3.5 h-3.5 ${autoRunMode ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-neutral-500'}`} />
              <span>Auto-Run: {autoRunMode ? 'ON (Zero-Click)' : 'OFF (Manual)'}</span>
            </button>

            {/* Neo is Connected Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold transition border shadow-sm ${
                isNeoConnected
                  ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 text-purple-200 border-purple-700/60 hover:border-purple-500'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isNeoConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
              <span>Neo is Connected</span>
            </button>

            {/* Workspace Status */}
            <button
              onClick={handleToggleWorkspace}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                isWorkspaceConnected
                  ? 'bg-blue-950/60 text-blue-300 border-blue-800/80 hover:border-blue-600'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isWorkspaceConnected ? 'bg-blue-400' : 'bg-neutral-500'}`} />
              <span>Workspace</span>
            </button>

            {/* MCP Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition"
              title="Open MCP Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        
        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('flow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'flow'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Architecture Flow</span>
            </button>
            <button
              onClick={() => setActiveTab('suite')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'suite'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                  : 'text-neutral-300 hover:text-white bg-neutral-950/80 border border-emerald-800/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>31-in-1 Skill Suite</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 font-bold'
                  : 'text-neutral-300 hover:text-white bg-neutral-950/80 border border-blue-800/40'
              }`}
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>Meeting History &amp; Capabilities ({meetingHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('neosapien')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'neosapien'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>NeoSapien Vault ({memories.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'workspace'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Workspace Hub ({events.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Custom Tools (TechSodh/SCET)</span>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Unified System View</span>
            </button>
          </div>

          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <span>Model: <strong className="text-white">Gemini 3.8 Flash</strong></span>
            <span>•</span>
            <span>Agent: <strong className="text-emerald-400 font-mono">Interactions API</strong></span>
          </div>
        </div>

        {/* Autonomous Neo Ambient Voice & Hardware Ingestion */}
        <NeoAmbientListener
          onIngestTranscript={handleIngestTranscript}
          isAgentRunning={isRunning}
          autoRunMode={autoRunMode}
          onToggleAutoRun={handleToggleAutoRun}
        />

        {/* Input & Prompt Execution Controller */}
        <PromptController
          onRunFlow={handleRunFlow}
          isRunning={isRunning}
          onResetData={handleResetData}
          safeMode={safeMode}
          onToggleSafeMode={handleToggleSafeMode}
          autoRunMode={autoRunMode}
          onToggleAutoRun={handleToggleAutoRun}
          onViewHistory={() => setActiveTab('history')}
          meetingCount={meetingHistory.length}
        />

        {/* Tab 1: Flow Diagram */}
        {(activeTab === 'flow' || activeTab === 'all') && (
          <div className="space-y-6">
            <FlowVisualizer
              currentPrompt={currentPrompt}
              runResult={runResult}
              isRunning={isRunning}
              activeNode={activeNode}
              onSelectNode={(node) => {
                setActiveNode(node);
                if (node === 'neosapien') setActiveTab('neosapien');
                if (node === 'workspace') setActiveTab('workspace');
                if (node === 'custom') setActiveTab('custom');
              }}
              safeMode={safeMode}
              autoRunMode={autoRunMode}
            />

            {/* Action Result Section below diagram */}
            <ActionResultView
              result={runResult}
              isRunning={isRunning}
              onApproveConfirmation={handleApproveConfirmation}
              onToggleAutoRun={handleToggleAutoRun}
              autoRunMode={autoRunMode}
              onViewHistory={() => setActiveTab('history')}
              meetingCount={meetingHistory.length}
            />
          </div>
        )}

        {/* Tab 1.5: 31-in-1 Skill Suite */}
        {(activeTab === 'suite' || activeTab === 'all') && (
          <div className="space-y-6">
            <AgentFeatureSuite
              onRunFeature={(cmd) => handleRunFlow(cmd, safeMode)}
              isRunning={isRunning}
            />

            {/* If there is an active run result, show it directly below the suite */}
            {runResult && (
              <ActionResultView
                result={runResult}
                isRunning={isRunning}
                onApproveConfirmation={handleApproveConfirmation}
                onToggleAutoRun={handleToggleAutoRun}
                autoRunMode={autoRunMode}
                onViewHistory={() => setActiveTab('history')}
                meetingCount={meetingHistory.length}
              />
            )}
          </div>
        )}

        {/* Tab 1.8: Agent Meeting History & Capability Tracker */}
        {(activeTab === 'history' || activeTab === 'all') && (
          <div className="space-y-6">
            <MeetingHistoryView
              meetings={meetingHistory}
              metrics={meetingMetrics}
              onScheduleQuickMeeting={handleRunFlow}
              isRunning={isRunning}
            />

            {/* If there is an active run result, show it directly below the audit ledger */}
            {runResult && (
              <ActionResultView
                result={runResult}
                isRunning={isRunning}
                onApproveConfirmation={handleApproveConfirmation}
                onToggleAutoRun={handleToggleAutoRun}
                autoRunMode={autoRunMode}
                onViewHistory={() => setActiveTab('history')}
                meetingCount={meetingHistory.length}
              />
            )}
          </div>
        )}

        {/* Tab 2: NeoSapien Memory Vault */}
        {(activeTab === 'neosapien' || activeTab === 'all') && (
          <NeoSapienContextView
            memories={memories}
            transcripts={transcripts}
            reminders={reminders}
            onAddMemory={handleAddMemory}
            onAddReminder={handleAddReminder}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isConnected={isNeoConnected}
          />
        )}

        {/* Tab 3: Google Workspace Hub */}
        {(activeTab === 'workspace' || activeTab === 'all') && (
          <WorkspaceHub
            events={events}
            emails={emails}
            isConnected={isWorkspaceConnected}
            onToggleConnection={handleToggleWorkspace}
          />
        )}

        {/* Tab 4: Custom Projects (TechSodh, MyEntryPass, SCET) */}
        {(activeTab === 'custom' || activeTab === 'all') && (
          <CustomProjectsView
            projects={customProjects}
            userProfile={userProfile}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 bg-[#0a0d14] px-6 py-4 mt-auto text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>NeoSapien Remote MCP Engine connected at <code className="text-neutral-400 font-mono">https://api.neosapien.xyz/mcp</code></span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Model Context Protocol (JSON-RPC 2.0)</span>
            <span>Google Workspace 1P APIs</span>
            <span>TechSodh &amp; SCET Tools</span>
          </div>
        </div>
      </footer>

      {/* Settings & Configuration Modal matching user screenshot */}
      <NeoSapienSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isConnected={isNeoConnected}
        onToggleConnection={handleToggleNeo}
      />
    </div>
  );
}
