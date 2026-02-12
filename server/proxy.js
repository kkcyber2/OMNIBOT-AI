import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/gemini-live' });

app.use(cors());
app.use(express.json({ limit: '4mb' }));

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY not set. Please set it in environment.');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// REST endpoint for standard generateContent and generateVideos
app.post('/api/gemini', async (req, res) => {
  try {
    const { operation, model, contents, config, prompt } = req.body || {};

    if (!operation) return res.status(400).json({ error: 'Missing operation' });

    if (operation === 'generateContent') {
      const result = await ai.models.generateContent({ model, contents, config });
      return res.json(result);
    }

    if (operation === 'generateVideos') {
      // Forward generateVideos call and return the operation object.
      const operationResult = await ai.models.generateVideos({ model, prompt: contents || prompt, config });
      return res.json(operationResult);
    }

    return res.status(400).json({ error: 'Unsupported operation' });
  } catch (err) {
    console.error('Proxy error', err);
    const message = err?.message || String(err);
    res.status(500).json({ error: message });
  }
});

// WebSocket endpoint for live audio connection
wss.on('connection', async (ws) => {
  console.log('Client connected to live audio proxy');
  let session = null;

  try {
    // Create live session with Gemini
    session = await ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          ws.send(JSON.stringify({ type: 'session_opened' }));
        },
        onmessage: (msg) => {
          ws.send(JSON.stringify({ type: 'server_message', data: msg }));
        },
        onclose: () => {
          ws.send(JSON.stringify({ type: 'session_closed' }));
          ws.close();
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: "You are the OmniBot Voice Agent. Handle inbound calls with business precision."
      }
    });

    // Forward client messages to Gemini session
    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data);
        if (msg.type === 'send_audio') {
          await session.sendRealtimeInput(msg.payload);
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from live audio proxy');
      if (session) session.close();
    });
  } catch (err) {
    console.error('WebSocket connection error:', err);
    ws.send(JSON.stringify({ type: 'error', error: err?.message || String(err) }));
    ws.close();
  }
});

server.listen(PORT, () => {
  console.log(`Gemini proxy running on http://localhost:${PORT}`);
  console.log(`  REST: http://localhost:${PORT}/api/gemini`);
  console.log(`  WebSocket: ws://localhost:${PORT}/ws/gemini-live`);
});
