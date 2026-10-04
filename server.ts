import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { store } from './server/store';
import { handleNeoSapienMCPRequest } from './server/mcpServer';
import { runAgentFlow } from './server/agentEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // NeoSapien MCP JSON-RPC 2.0 Endpoint (standard MCP protocol)
  app.post('/api/neosapien/mcp', (req, res) => {
    const response = handleNeoSapienMCPRequest(req.body);
    res.json(response);
  });

  // Run the full Gemini Agent orchestration pipeline
  app.post('/api/agent/run', async (req, res) => {
    try {
      const prompt = req.body?.prompt || 'Set meeting with Jay tomorrow afternoon to discuss TechSodh';
      const autoApprove = req.body?.autoApprove ?? true;
      const autoRunMode = req.body?.autoRunMode ?? store.securitySettings.autoRunMode;
      const result = await runAgentFlow(prompt, autoApprove, autoRunMode);
      res.json(result);
    } catch (err: any) {
      console.error('Agent run failed:', err);
      res.status(500).json({
        success: false,
        error: err?.message || 'Agent orchestration failed'
      });
    }
  });

  // Autonomous Neo Voice & Transcript Ingestion Endpoint
  // Receives ambient audio transcripts captured by NeoSapien hardware/client
  // and automatically runs the Gemini Agent pipeline without manual typing!
  app.post('/api/neosapien/stream-transcript', async (req, res) => {
    try {
      const { transcript, speaker = 'Ronak', autoExecute = true } = req.body;
      const autoRunMode = req.body?.autoRunMode ?? store.securitySettings.autoRunMode;
      if (!transcript) {
        return res.status(400).json({ error: 'Transcript text is required' });
      }

      // Record incoming ambient speech to Neo transcripts
      const newTranscript = {
        id: `trans-stream-${Date.now()}`,
        title: `Ambient Voice Capture: "${transcript.substring(0, 40)}..."`,
        date: new Date().toISOString().split('T')[0],
        duration: 'Live speech capture',
        participants: [speaker, 'NeoSapien Ambient Listener'],
        summary: `Neo hardware captured real-time speech from ${speaker}: "${transcript}"`,
        keyTakeaways: [`Detected spoken intent from live ambient conversation`],
        actionItems: [`Autonomous Gemini Agent processing`]
      };
      store.transcripts.unshift(newTranscript);

      let agentResult = null;
      if (autoExecute) {
        agentResult = await runAgentFlow(transcript, true, autoRunMode);
      }

      res.json({
        success: true,
        source: 'NeoSapien Ambient Hardware Listener',
        transcript: newTranscript,
        agentResult
      });
    } catch (err: any) {
      console.error('Ambient transcript ingestion failed:', err);
      res.status(500).json({ error: err?.message || 'Ingestion failed' });
    }
  });

  // Toggle Auto-Run Mode
  app.post('/api/security/auto-run', (req, res) => {
    if (typeof req.body?.autoRunMode === 'boolean') {
      store.securitySettings.autoRunMode = req.body.autoRunMode;
    } else {
      store.securitySettings.autoRunMode = !store.securitySettings.autoRunMode;
    }
    res.json({ autoRunMode: store.securitySettings.autoRunMode });
  });

  // Approve pending HITL confirmation action
  app.post('/api/security/approve-action', (req, res) => {
    const { confirmationId } = req.body;
    res.json({
      success: true,
      confirmationId,
      status: 'approved',
      message: 'Action manually approved and committed to Google Workspace and NeoSapien state.'
    });
  });

  // Get history of all meetings scheduled by the Agent & capability metrics
  app.get('/api/agent/meeting-history', (_req, res) => {
    res.json({
      success: true,
      meetings: store.agentMeetings,
      metrics: store.getMeetingCapabilityMetrics()
    });
  });

  // Get user profile & security rules
  app.get('/api/user-profile', (_req, res) => {
    res.json({
      user: store.userProfile,
      security: store.securitySettings
    });
  });

  // Toggle HITL Security Safe Mode
  app.post('/api/security/toggle', (req, res) => {
    if (typeof req.body?.safeMode === 'boolean') {
      store.securitySettings.safeMode = req.body.safeMode;
    } else {
      store.securitySettings.safeMode = !store.securitySettings.safeMode;
    }
    res.json({ security: store.securitySettings });
  });

  // Custom MCP projects state (TechSodh, MyEntryPass, SCET)
  app.get('/api/custom-mcp/state', (_req, res) => {
    res.json({
      connected: store.connectedToCustomMcp,
      projects: store.customProjects
    });
  });

  // Get current NeoSapien state (Memories, Transcripts, Reminders)
  app.get('/api/neosapien/state', (_req, res) => {
    res.json({
      connected: store.connectedToNeoSapien,
      memories: store.memories,
      transcripts: store.transcripts,
      reminders: store.reminders,
      serverUrl: 'https://api.neosapien.xyz/mcp'
    });
  });

  // Toggle or update NeoSapien connection
  app.post('/api/neosapien/toggle-connection', (req, res) => {
    if (typeof req.body?.connected === 'boolean') {
      store.connectedToNeoSapien = req.body.connected;
    } else {
      store.connectedToNeoSapien = !store.connectedToNeoSapien;
    }
    res.json({ connected: store.connectedToNeoSapien });
  });

  // Add new Memory to NeoSapien
  app.post('/api/neosapien/memory', (req, res) => {
    const { title, content, personName, category, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const mem = store.addMemory({
      title,
      content,
      personName,
      category: category || 'general',
      tags: tags || ['custom']
    });
    res.json({ success: true, memory: mem });
  });

  // Add new Reminder to NeoSapien
  app.post('/api/neosapien/reminder', (req, res) => {
    const { title, dueDate, time, relatedTo, category } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const rem = store.addReminder({
      title,
      dueDate: dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: time || '14:00',
      relatedTo: relatedTo || 'Rahul',
      status: 'pending',
      category: category || 'General'
    });
    res.json({ success: true, reminder: rem });
  });

  // Get current Google Workspace state (Calendar Events, Gmail messages)
  app.get('/api/workspace/state', (_req, res) => {
    res.json({
      connected: store.connectedToGoogleWorkspace,
      events: store.events,
      emails: store.emails,
    });
  });

  // Toggle Workspace connection
  app.post('/api/workspace/toggle-connection', (req, res) => {
    if (typeof req.body?.connected === 'boolean') {
      store.connectedToGoogleWorkspace = req.body.connected;
    } else {
      store.connectedToGoogleWorkspace = !store.connectedToGoogleWorkspace;
    }
    res.json({ connected: store.connectedToGoogleWorkspace });
  });

  // Reset to initial demo state
  app.post('/api/reset-data', (_req, res) => {
    store.events = [
      {
        id: 'evt-1',
        summary: 'Team Standup',
        description: 'Daily team sync and blocker resolution',
        start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T09:30:00Z',
        end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T10:00:00Z',
        meetLink: 'https://meet.google.com/abc-wxyz-qwe',
        attendees: [{ name: 'Team', email: 'team@company.internal' }],
        status: 'confirmed'
      }
    ];
    store.emails = [
      {
        id: 'email-1',
        to: ['team@company.internal'],
        subject: 'Weekly Architecture Sync Notes',
        body: 'Hi team, thanks for joining today. Action items have been logged in NeoSapien memory.',
        sentAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
    res.json({ success: true, message: 'Store reset to fresh seed' });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
