import React from 'react';
import { 
  Box, 
  Cpu, 
  ExternalLink, 
  FileCheck2, 
  ShieldCheck, 
  QrCode, 
  School, 
  Activity, 
  Sparkles,
  User,
  CheckCircle2
} from 'lucide-react';
import { CustomProjectData } from '../types';

interface Props {
  projects: CustomProjectData[];
  userProfile: {
    name: string;
    email: string;
    role: string;
    organization: string;
    timezone: string;
  };
}

export const CustomProjectsView: React.FC<Props> = ({ projects, userProfile }) => {
  return (
    <div className="w-full rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 shadow-xl backdrop-blur-sm space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">Your Custom MCP Tool Ecosystem</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                Pillar 3 MCP
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Domain-specific tools exposed to Gemini alongside NeoSapien memory and Google Workspace
            </p>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-neutral-950 px-3.5 py-2 rounded-xl border border-neutral-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
            RT
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{userProfile.name}</span>
            <span className="text-[10px] text-neutral-400 font-mono">{userProfile.email}</span>
          </div>
        </div>
      </div>

      {/* Projects Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TechSodh Card */}
        <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-b from-neutral-950 to-amber-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" /> TechSodh
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              v2.1 Active
            </span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            AI Document Intelligence platform founded by Ronak. Integrated Gemini Vision with multi-lingual OCR parser (98.4% precision).
          </p>
          <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800 space-y-1 font-mono text-[10px]">
            <span className="text-neutral-400 block font-semibold">Exposed MCP Endpoints:</span>
            <div className="text-emerald-400">POST /v1/ocr (Gujarati + English)</div>
            <div className="text-emerald-400">POST /v1/summarize</div>
          </div>
        </div>

        {/* MyEntryPass Card */}
        <div className="p-4 rounded-xl border border-purple-500/30 bg-gradient-to-b from-neutral-950 to-purple-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-purple-400" /> MyEntryPass
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Beta Ready
            </span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Automated visitor credentialing, QR access tokens, and check-in kiosks with NFC support and offline verification.
          </p>
          <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800 space-y-1 font-mono text-[10px]">
            <span className="text-neutral-400 block font-semibold">Exposed MCP Endpoints:</span>
            <div className="text-purple-400">POST /auth/verify</div>
            <div className="text-purple-400">POST /pass/issue</div>
          </div>
        </div>

        {/* SCET Card */}
        <div className="p-4 rounded-xl border border-blue-500/30 bg-gradient-to-b from-neutral-950 to-blue-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-400" /> SCET College Portal
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
              Audit Pending
            </span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Sarvajanik College of Engineering and Technology coursework review, project guide signoffs, and Glacier thesis submission.
          </p>
          <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800 space-y-1 font-mono text-[10px]">
            <span className="text-neutral-400 block font-semibold">Exposed MCP Endpoints:</span>
            <div className="text-blue-400">GET /student/docs</div>
            <div className="text-blue-400">POST /student/signoff-request</div>
          </div>
        </div>
      </div>

      {/* Security Rule explanation matching prompt */}
      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          The Human-in-the-Loop Security Rule for Personal Agents
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-300 pt-1">
          <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
            <span className="text-emerald-400 font-semibold block mb-1">Safe Automatic Actions:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-400">
              <li>Read NeoSapien memories &amp; past transcripts</li>
              <li>Read Google Calendar &amp; check availability</li>
              <li>Create personal context reminders in vault</li>
              <li>Generate draft emails &amp; daily briefings</li>
            </ul>
          </div>
          <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
            <span className="text-amber-400 font-semibold block mb-1">Confirmation Required (Sensitive):</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-neutral-400">
              <li>Send emails via Gmail API to real recipients</li>
              <li>Mutate external appointments or delete events</li>
              <li>Issue visitor access passes in MyEntryPass</li>
              <li>Submit final SCET academic documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
