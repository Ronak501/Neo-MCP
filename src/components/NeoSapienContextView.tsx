import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  FileText, 
  Bell, 
  Plus, 
  Terminal, 
  Search, 
  Tag, 
  Clock, 
  User, 
  Check, 
  Play,
  ExternalLink
} from 'lucide-react';
import { NeoSapienMemory, NeoSapienTranscript, NeoSapienReminder } from '../types';

interface Props {
  memories: NeoSapienMemory[];
  transcripts: NeoSapienTranscript[];
  reminders: NeoSapienReminder[];
  onAddMemory: (memory: { title: string; content: string; personName?: string; category?: string; tags?: string[] }) => Promise<void>;
  onAddReminder: (reminder: { title: string; dueDate?: string; time?: string; relatedTo?: string; category?: string }) => Promise<void>;
  onOpenSettings: () => void;
  isConnected: boolean;
}

export const NeoSapienContextView: React.FC<Props> = ({
  memories,
  transcripts,
  reminders,
  onAddMemory,
  onAddReminder,
  onOpenSettings,
  isConnected
}) => {
  const [tab, setTab] = useState<'memories' | 'transcripts' | 'reminders' | 'mcp_inspector'>('memories');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New memory form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPerson, setNewPerson] = useState('Rahul');
  const [newCategory, setNewCategory] = useState<'contact' | 'habit' | 'preference' | 'project'>('contact');

  // MCP Inspector state
  const [mcpMethod, setMcpMethod] = useState<'tools/list' | 'tools/call' | 'resources/list'>('tools/call');
  const [mcpToolName, setMcpToolName] = useState('neosapien_search_memories');
  const [mcpToolArg, setMcpToolArg] = useState('Rahul');
  const [mcpResponse, setMcpResponse] = useState<any>(null);
  const [isExecutingMcp, setIsExecutingMcp] = useState(false);

  const filteredMemories = memories.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.personName && m.personName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    await onAddMemory({
      title: newTitle,
      content: newContent,
      personName: newPerson,
      category: newCategory,
      tags: [newCategory, newPerson.toLowerCase()]
    });
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const executeMcpCall = async () => {
    setIsExecutingMcp(true);
    try {
      let body: any = { jsonrpc: '2.0', id: Date.now(), method: mcpMethod };
      if (mcpMethod === 'tools/call') {
        body.params = {
          name: mcpToolName,
          arguments: mcpToolName === 'neosapien_search_memories' 
            ? { query: mcpToolArg }
            : { personName: mcpToolArg }
        };
      }

      const res = await fetch('/api/neosapien/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setMcpResponse(data);
    } catch (err: any) {
      setMcpResponse({ error: err.message });
    } finally {
      setIsExecutingMcp(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">NeoSapien MCP Memory Vault</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isConnected 
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                  : 'bg-red-950 text-red-300 border-red-800'
              }`}>
                {isConnected ? 'Neo is Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Personal memory graph powering the Gemini Agent's contextual scheduling decisions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 border border-neutral-700 transition"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>MCP Config</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-900/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-2 mt-4 border-b border-neutral-800/80 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('memories')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              tab === 'memories'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Memories ({memories.length})</span>
          </button>
          <button
            onClick={() => setTab('transcripts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              tab === 'transcripts'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Transcripts ({transcripts.length})</span>
          </button>
          <button
            onClick={() => setTab('reminders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              tab === 'reminders'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Reminders ({reminders.length})</span>
          </button>
          <button
            onClick={() => setTab('mcp_inspector')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              tab === 'mcp_inspector'
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>MCP Protocol Inspector</span>
          </button>
        </div>

        {tab === 'memories' && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-neutral-500 w-44 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Memories */}
      {tab === 'memories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredMemories.map((mem) => {
            const isRahul = mem.personName === 'Rahul' || mem.title.includes('Rahul');
            return (
              <div
                key={mem.id}
                className={`p-4 rounded-xl border transition-all text-left relative ${
                  isRahul
                    ? 'border-emerald-700/60 bg-gradient-to-br from-neutral-950 to-emerald-950/20'
                    : 'border-neutral-800 bg-neutral-950/70'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {mem.personName && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                        {mem.personName[0]}
                      </span>
                    )}
                    {mem.title}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 capitalize">
                    {mem.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                  {mem.content}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-800/80">
                  {mem.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono text-emerald-400/90 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40">
                      #{tag}
                    </span>
                  ))}
                  <span className="text-[10px] text-neutral-500 ml-auto">
                    Synced with Remote MCP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Transcripts */}
      {tab === 'transcripts' && (
        <div className="space-y-4 mt-4">
          {transcripts.map((t) => (
            <div key={t.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-neutral-800">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-0.5 font-mono">
                    <span>Date: {t.date}</span>
                    <span>Duration: {t.duration}</span>
                    <span>Attendees: {t.participants.join(', ')}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  AI Transcribed
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                <strong className="text-white">Summary: </strong>
                {t.summary}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                  <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Key Takeaways</span>
                  <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px]">
                    {t.keyTakeaways.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                  <span className="text-[11px] font-semibold text-blue-400 block mb-1">Action Items</span>
                  <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px]">
                    {t.actionItems.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Reminders */}
      {tab === 'reminders' && (
        <div className="space-y-3 mt-4">
          {reminders.map((rem) => (
            <div key={rem.id} className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/80 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{rem.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-0.5 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {rem.dueDate} at {rem.time}
                    </span>
                    {rem.relatedTo && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-neutral-500" />
                        {rem.relatedTo}
                      </span>
                    )}
                    <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-[10px]">
                      {rem.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {rem.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Raw MCP Protocol Inspector */}
      {tab === 'mcp_inspector' && (
        <div className="space-y-4 mt-4 text-left">
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200">
            <strong>Model Context Protocol (MCP) Live Playground:</strong> Interact directly with the NeoSapien MCP JSON-RPC 2.0 endpoints used by the Gemini Agent.
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <div>
              <label className="text-[10px] font-mono text-neutral-400 block mb-1">MCP Method</label>
              <select
                value={mcpMethod}
                onChange={(e) => setMcpMethod(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-700 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none"
              >
                <option value="tools/call">tools/call</option>
                <option value="tools/list">tools/list</option>
                <option value="resources/list">resources/list</option>
              </select>
            </div>

            {mcpMethod === 'tools/call' && (
              <>
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Tool Name</label>
                  <select
                    value={mcpToolName}
                    onChange={(e) => setMcpToolName(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="neosapien_search_memories">neosapien_search_memories</option>
                    <option value="neosapien_get_transcripts">neosapien_get_transcripts</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Argument</label>
                  <input
                    type="text"
                    value={mcpToolArg}
                    onChange={(e) => setMcpToolArg(e.target.value)}
                    placeholder='query string (e.g. "Rahul")'
                    className="w-full bg-neutral-900 border border-neutral-700 text-xs text-white rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="self-end">
              <button
                onClick={executeMcpCall}
                disabled={isExecutingMcp}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium text-xs shadow transition disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecutingMcp ? 'Sending...' : 'Send JSON-RPC'}</span>
              </button>
            </div>
          </div>

          {mcpResponse && (
            <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 font-mono text-xs p-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 text-[11px] text-neutral-400">
                <span>Response Payload (JSON-RPC 2.0)</span>
                <span className="text-emerald-400">Status: 200 OK</span>
              </div>
              <pre className="text-emerald-300 text-[11px] max-h-64 overflow-y-auto leading-relaxed">
                <code>{JSON.stringify(mcpResponse, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl text-left">
            <h3 className="text-base font-bold text-white mb-1">Add Memory to NeoSapien</h3>
            <p className="text-xs text-neutral-400 mb-4">
              New memories will immediately be referenced by the Gemini Agent for future scheduling decisions.
            </p>

            <form onSubmit={handleCreateMemory} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rahul Sharma - Working Hours"
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">Person Name</label>
                  <input
                    type="text"
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    placeholder="Rahul"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="contact">Contact</option>
                    <option value="habit">Habit</option>
                    <option value="preference">Preference</option>
                    <option value="project">Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Content / Observation</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Rahul is available after 2 PM, drinks espresso, and prefers Google Meet with follow-up emails..."
                  rows={3}
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium shadow transition"
                >
                  Commit to Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
