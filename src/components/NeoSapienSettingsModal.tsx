import React, { useState } from 'react';
import { Copy, Check, Server, ShieldCheck, ArrowRight, X, ExternalLink, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onToggleConnection: () => void;
}

export const NeoSapienSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  isConnected,
  onToggleConnection
}) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [activeTab, setActiveTab] = useState<'config' | 'auth'>('config');

  if (!isOpen) return null;

  const mcpConfigCode = `{
  "mcpServers": {
    "neosapien": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://api.neosapien.xyz/mcp"
      ]
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mcpConfigCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-black font-bold">
              <Server className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                NeoSapien MCP Server Settings
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  Remote MCP
                </span>
              </h2>
              <p className="text-xs text-neutral-400">Configure client connection to your personal NeoSapien memory vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-4 text-xs font-medium border-b-2 transition ${
              activeTab === 'config'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Step 0 & 1: Configuration
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`pb-2.5 px-4 text-xs font-medium border-b-2 transition ${
              activeTab === 'auth'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Authentication & Client Status
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-200 text-sm">
          {activeTab === 'config' ? (
            <div className="space-y-6">
              {/* Step 0 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Step 0:</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 rounded-md transition border border-neutral-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Config!' : 'Copy MCP JSON'}</span>
                  </button>
                </div>
                <h3 className="text-base font-semibold text-white">Open your tool's MCP settings</h3>
                <p className="text-xs text-neutral-400">
                  Add this snippet to your Claude Desktop, Cursor, Windsurf, or AI Studio MCP client configuration:
                </p>

                {/* Code Window matching user screenshot */}
                <div className="rounded-xl overflow-hidden border border-neutral-700/80 bg-gradient-to-b from-[#14233c] to-[#0c182b] p-4 shadow-xl font-mono text-xs">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="text-[11px] text-neutral-400 ml-2">mcp_settings.json</span>
                  </div>
                  <pre className="text-emerald-300 leading-relaxed overflow-x-auto selection:bg-emerald-800/40">
                    <code>{mcpConfigCode}</code>
                  </pre>
                </div>
              </div>

              {/* Step 1 */}
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Step 1:</span>
                <h3 className="text-base font-semibold text-white">Add the server URL:</h3>
                <div className="flex items-center gap-2 bg-neutral-950 px-3.5 py-2.5 rounded-lg border border-neutral-800">
                  <code className="text-sm font-mono text-emerald-400 flex-1 select-all">
                    https://api.neosapien.xyz/mcp
                  </code>
                  <a
                    href="https://api.neosapien.xyz/mcp"
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-400 hover:text-emerald-300 transition"
                    title="Open API endpoint"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-neutral-400">
                  The local bridge acts as a high-speed proxy with built-in cache, memory indexing, and live transcript sync.
                </p>
              </div>
            </div>
          ) : (
            /* Auth Tab matching lower portion of screenshot */
            <div className="max-w-md mx-auto space-y-5 py-2">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white font-bold mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">NeoSapien MCP</h3>
                <p className="text-xs text-neutral-400">
                  Sign in to connect your MCP client to your NeoSapien memories.
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={onToggleConnection}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white text-neutral-800 hover:bg-neutral-100 rounded-xl font-medium text-xs shadow transition active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.27-2.1 3.64-5.18 3.64-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.92H1.28v3.15C3.25 21.3 7.31 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.32 14.28c-.24-.72-.37-1.49-.37-2.28s.13-1.56.37-2.28V6.57H1.28C.46 8.2 0 10.05 0 12s.46 3.8 1.28 5.43l4.04-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.57l4.04 3.15c.94-2.82 3.58-4.97 6.68-4.97z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                {/* Microsoft Sign In */}
                <button
                  type="button"
                  onClick={onToggleConnection}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium text-xs border border-neutral-700 transition active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span>Sign in with Microsoft</span>
                </button>

                {/* Apple Sign In */}
                <button
                  type="button"
                  onClick={onToggleConnection}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium text-xs border border-neutral-700 transition active:scale-[0.99]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.43-6.19-9.87-11.02-21.28-14.48-34.22-3.46-12.94-5.19-25.04-5.19-36.31 0-14.38 3.58-26.4 10.74-36.07 7.16-9.67 16.29-14.65 27.39-14.93 4.35 0 9.29 1.13 14.81 3.39 5.53 2.26 9.4 3.44 11.63 3.54 1.74 0 5.79-1.28 12.15-3.83 6.36-2.55 11.9-3.67 16.63-3.35 12.83.65 23.01 5.25 30.54 13.8-11.19 6.83-16.68 16.48-16.47 28.95.22 9.87 3.99 18.06 11.33 24.58 7.34 6.52 16.09 10.37 26.25 11.56-2.28 6.84-5.19 14.07-8.72 21.69zM119.22 33.72c0-7.39 2.66-14.38 7.97-20.98 5.31-6.6 11.96-10.98 19.95-13.14.22 1.3.33 2.39.33 3.26 0 7.39-2.77 14.44-8.31 21.15-5.54 6.71-12.34 10.98-20.4 12.81-.11-1.08-.22-2.17-.22-3.1z"/>
                  </svg>
                  <span>Sign in with Apple</span>
                </button>
              </div>

              <div className="flex items-center gap-2 my-3">
                <div className="h-px flex-1 bg-neutral-800" />
                <span className="text-[11px] text-neutral-500 uppercase">or email</span>
                <div className="h-px flex-1 bg-neutral-800" />
              </div>

              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Neo is Connected Button (Exact recreation from user screenshot) */}
              <button
                type="button"
                onClick={onToggleConnection}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                  isConnected
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-purple-500/25 ring-2 ring-purple-400/50'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-300 animate-ping' : 'bg-neutral-500'}`} />
                <span>{isConnected ? 'Neo is Connected' : 'Connect Neo Client'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span>Status: {isConnected ? 'Active & Synced with Remote Vault' : 'Disconnected'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
