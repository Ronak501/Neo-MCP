import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Mail, 
  Video, 
  ExternalLink, 
  Clock, 
  Users, 
  CheckCircle2, 
  Send, 
  Copy, 
  Check,
  CalendarCheck
} from 'lucide-react';
import { WorkspaceEvent, WorkspaceEmail } from '../types';

interface Props {
  events: WorkspaceEvent[];
  emails: WorkspaceEmail[];
  isConnected: boolean;
  onToggleConnection: () => void;
}

export const WorkspaceHub: React.FC<Props> = ({
  events,
  emails,
  isConnected,
  onToggleConnection
}) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'gmail' | 'meet'>('calendar');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [selectedMeetLink, setSelectedMeetLink] = useState<string | null>(null);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const latestEvent = events[0];

  return (
    <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Google Workspace Hub</h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isConnected 
                  ? 'bg-blue-950 text-blue-300 border-blue-800' 
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }`}>
                {isConnected ? 'Workspace Connected' : 'Mock Mode'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Synchronized 1P Google Calendar events, Meet video links, and Gmail invitations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleConnection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 border border-neutral-700 transition"
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-blue-400' : 'bg-neutral-500'}`} />
            <span>{isConnected ? 'Sync Active' : 'Toggle Connection'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mt-4 border-b border-neutral-800/80 pb-2">
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'calendar'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Google Calendar ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('gmail')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'gmail'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Gmail Invitations ({emails.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('meet')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            activeTab === 'meet'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Google Meet Preview</span>
        </button>
      </div>

      {/* Tab 1: Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-3.5 mt-4 text-left">
          {events.map((evt) => {
            const isRecent = evt.id.startsWith('evt-') && evt.id !== 'evt-1';
            return (
              <div
                key={evt.id}
                className={`p-4 rounded-xl border transition-all ${
                  isRecent 
                    ? 'border-blue-500/50 bg-gradient-to-r from-blue-950/30 to-neutral-950 shadow-lg' 
                    : 'border-neutral-800 bg-neutral-950/70'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{evt.summary}</h4>
                      {isRecent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                          Just Scheduled by Gemini
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-1">
                      <span className="flex items-center gap-1.5 font-mono text-neutral-300">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {new Date(evt.start).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-500" />
                        {evt.attendees.map(a => a.name).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(evt.meetLink)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 border border-neutral-700 transition"
                      title="Copy Meet Link"
                    >
                      {copiedLink === evt.meetLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[11px] font-mono">{copiedLink === evt.meetLink ? 'Copied' : 'Copy Meet'}</span>
                    </button>
                    <a
                      href={evt.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meet</span>
                    </a>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-mono whitespace-pre-line">
                  {evt.description}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Gmail */}
      {activeTab === 'gmail' && (
        <div className="space-y-3.5 mt-4 text-left">
          {emails.map((email) => (
            <div key={email.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">{email.subject}</h4>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                  <span>To: {email.to.join(', ')}</span>
                  <span>•</span>
                  <span>{new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800/80 text-xs text-neutral-200 leading-relaxed font-mono whitespace-pre-line">
                {email.body}
              </div>

              {email.meetLink && (
                <div className="mt-2.5 flex items-center justify-between text-xs bg-blue-950/30 border border-blue-800/40 p-2 rounded-lg">
                  <span className="text-blue-300 font-mono text-[11px]">Attached Google Meet: {email.meetLink}</span>
                  <a
                    href={email.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Google Meet Preview */}
      {activeTab === 'meet' && (
        <div className="mt-4 text-left">
          <div className="rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-950 to-neutral-900 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Video className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-1">
              <h4 className="text-base font-bold text-white">Google Meet Conference Room</h4>
              <p className="text-xs text-neutral-400">
                Generated automatically by Gemini Agent when scheduling through Workspace Calendar API.
              </p>
            </div>

            {latestEvent ? (
              <div className="w-full max-w-sm bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800">
                  <span>Room:</span>
                  <code className="text-emerald-400 font-mono">{latestEvent.meetLink.replace('https://', '')}</code>
                </div>
                <div className="text-xs text-neutral-300 space-y-1 text-left">
                  <div><strong>Meeting:</strong> {latestEvent.summary}</div>
                  <div><strong>Participant:</strong> {latestEvent.attendees.map(a => a.name).join(', ')}</div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleCopy(latestEvent.meetLink)}
                    className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition"
                  >
                    {copiedLink === latestEvent.meetLink ? 'Link Copied!' : 'Copy Link'}
                  </button>
                  <a
                    href={latestEvent.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold text-center transition"
                  >
                    Open Meeting
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Run the agent flow to generate your first meeting room.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
