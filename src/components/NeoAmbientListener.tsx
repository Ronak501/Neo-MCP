import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Sparkles, 
  Volume2, 
  Activity, 
  Play, 
  Check, 
  Zap, 
  ShieldCheck,
  Headphones,
  ArrowRight
} from 'lucide-react';

interface Props {
  onIngestTranscript: (transcript: string) => Promise<void>;
  isAgentRunning: boolean;
  autoRunMode: boolean;
  onToggleAutoRun: () => void;
}

const AMBIENT_SPEECH_SIMULATIONS = [
  {
    label: 'Talking to Jay about TechSodh',
    speech: 'Jay, let\'s set a meeting tomorrow afternoon around 2 PM to test the TechSodh OCR scanner.',
    context: 'Captured while speaking at desk'
  },
  {
    label: 'Talking in hallway about SCET',
    speech: 'Remind me next Monday morning to submit the SCET document to the department office.',
    context: 'Captured while walking between labs'
  },
  {
    label: 'Talking with Rahul on Slack call',
    speech: 'Rahul, let\'s sync tomorrow afternoon to review the GCP VPC peering setup.',
    context: 'Captured from headset audio'
  },
  {
    label: 'Asking Neo about Jay',
    speech: 'What was I working on with Jay?',
    context: 'Spoken question to Neo'
  },
  {
    label: 'Talking with Prof X on Glacier research',
    speech: 'I discussed the glacier project with Professor X last week. What did we decide?',
    context: 'Spoken research follow-up'
  }
];

export const NeoAmbientListener: React.FC<Props> = ({ 
  onIngestTranscript, 
  isAgentRunning,
  autoRunMode,
  onToggleAutoRun
}) => {
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [lastCapturedUtterance, setLastCapturedUtterance] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  // Initialize Web Speech Recognition if available in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setLiveTranscript(current);

        // When user stops speaking for 1.2s, auto-trigger the agent!
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (current.trim().length > 5) {
            handleAutoDispatch(current.trim());
          }
        }, 1200);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e?.error);
        if (e?.error === 'not-allowed') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        if (isListening) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setIsListening(!isListening);
      return;
    }

    if (!isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(true);
      }
    } else {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {}
    }
  };

  const handleAutoDispatch = async (text: string) => {
    setLastCapturedUtterance(text);
    setLiveTranscript('');
    await onIngestTranscript(text);
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900/90 to-purple-950/40 border border-emerald-500/40 p-5 shadow-2xl backdrop-blur-md space-y-4 text-left relative overflow-hidden">
      {/* Background audio pulse effect */}
      {isListening && (
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
      )}

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white transition-all ${
              isListening 
                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30' 
                : 'bg-neutral-800 text-neutral-400'
            }`}>
              {isListening ? <Headphones className="w-5 h-5 text-neutral-950 animate-pulse" /> : <MicOff className="w-5 h-5" />}
            </div>
            {isListening && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-neutral-900 animate-ping" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Neo Ambient Voice Ingestion (Zero-Click Mode)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-spin" />
                {isListening ? 'Ambient Mic Active' : 'Ready'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Neo captures your spoken conversation in real time → Streams transcript to NeoSapien MCP → Gemini Agent triggers automatically without typing!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-Run Mode Toggle */}
          <button
            type="button"
            onClick={onToggleAutoRun}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition border shadow-sm ${
              autoRunMode
                ? 'bg-gradient-to-r from-amber-500 to-emerald-400 text-neutral-950 border-amber-400 font-bold shadow-amber-500/20'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
            }`}
            title="When Auto-Run is enabled, low-risk actions execute immediately without manual confirm"
          >
            <Zap className={`w-3.5 h-3.5 ${autoRunMode ? 'fill-current animate-pulse text-neutral-950' : 'text-neutral-500'}`} />
            <span>Auto-Run: {autoRunMode ? 'ON (Bypass Confirm)' : 'OFF (Manual)'}</span>
          </button>

          {/* Mic Toggle Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-semibold text-xs transition border shadow-sm ${
              isListening
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
          >
            {isListening ? (
              <>
                <Mic className="w-3.5 h-3.5 text-white animate-bounce" />
                <span>Stop Listening</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Start Live Voice</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Auto-Run Mode Status Indicator */}
      <div className={`px-3 py-2 rounded-xl border text-xs flex items-center justify-between gap-3 ${
        autoRunMode 
          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' 
          : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
      }`}>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          {autoRunMode ? (
            <>
              <Zap className="w-4 h-4 text-emerald-400 shrink-0 fill-current animate-pulse" />
              <span>
                <strong>Auto-Run ACTIVE</strong>: Low-risk actions (meetings with Jay/Rahul, reminders, notes) bypass manual confirmation and execute immediately upon spoken ambient voice.
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Auto-Run PAUSED</strong>: Ambient voice inputs will pause at the Security Guardrail for human review &amp; confirmation before committing actions.
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleAutoRun}
          className="text-[10px] font-mono underline hover:text-white shrink-0"
        >
          {autoRunMode ? 'Switch to Manual' : 'Enable Auto-Run'}
        </button>
      </div>

      {/* Visual Equalizer & Live Speech Stream */}
      <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : 'bg-neutral-600'}`} />
            {isListening ? 'Streaming live audio buffer from microphone / Neo hardware...' : 'Ambient microphone paused. Click "Start Live Voice" or test simulated utterances below.'}
          </span>
          {isListening && (
            <div className="flex items-center gap-0.5 h-3">
              <span className="w-1 h-3 bg-emerald-400 rounded animate-bounce" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 h-2 bg-emerald-400 rounded animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-4 bg-emerald-400 rounded animate-bounce" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 h-1.5 bg-emerald-400 rounded animate-bounce" style={{ animationDelay: '0.4s' }} />
              <span className="w-1 h-3.5 bg-emerald-400 rounded animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          )}
        </div>

        {/* Live speech preview */}
        <div className="min-h-[44px] flex items-center p-2 rounded-lg bg-neutral-900 border border-neutral-800/80 font-mono text-xs text-neutral-200">
          {liveTranscript ? (
            <span className="text-emerald-300 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" />
              "{liveTranscript}..."
            </span>
          ) : lastCapturedUtterance ? (
            <span className="text-neutral-300 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Last ingested by Neo: <strong className="text-white font-mono">"{lastCapturedUtterance}"</strong> (Executed automatically)</span>
            </span>
          ) : (
            <span className="text-neutral-500 italic">
              Speak naturally like you're talking to Jay, Rahul, or Neo. When you stop talking, the agent runs automatically.
            </span>
          )}
        </div>
      </div>

      {/* Instant Ambient Voice Stream Simulator */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simulate Spoken Conversations Captured by Neo Hardware (Auto-Run):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {AMBIENT_SPEECH_SIMULATIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAutoDispatch(item.speech)}
              disabled={isAgentRunning}
              className="p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800/90 hover:border-emerald-600/60 text-left transition disabled:opacity-50 group space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span className="text-emerald-400 font-semibold">{item.label}</span>
                <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Stream <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-xs text-neutral-200 group-hover:text-white font-mono line-clamp-2">
                "{item.speech}"
              </div>
              <div className="text-[10px] text-neutral-500 italic">
                {item.context}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
