require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Chat endpoint — sends sanitized user message to Claude
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message.' });
  }
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'You are a compliant enterprise AI assistant. Respond helpfully and concisely. Never suggest transferring funds, committing illegal acts, or leaking sensitive data. Keep responses under 150 words.',
      messages: [{ role: 'user', content: message }],
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

// Report endpoint — generates AI risk report from session stats
app.post('/api/report', async (req, res) => {
  const { totalInteractions, piiTotal, blockedTotal, piiCounts } = req.body;
  if (totalInteractions === undefined) {
    return res.status(400).json({ error: 'Missing session data.' });
  }
  const summary = `Total interactions: ${totalInteractions}. PII flagged: ${piiTotal}. Responses blocked: ${blockedTotal}. PII type breakdown: ${JSON.stringify(piiCounts)}.`;
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: 'You generate concise enterprise AI safety risk reports. Use plain text only, no markdown. Be professional. Max 220 words.',
      messages: [{ role: 'user', content: `Generate an Enterprise AI Safety Usage Risk Report from this session data: ${summary}. Include: overall risk level, most exposed data types, compliance observations, and 3 actionable recommendations.` }],
    });
    res.json({ report: response.content[0].text });
  } catch (err) {
    console.error('Report error:', err.message);
    res.status(500).json({ error: 'Report generation failed: ' + err.message });
  }
});

// Fallback — serve frontend

// app.get('/:any(.*)', (req, res) => {
  // const path = req.params.any;
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('*', (req, res) => {
  // Use a different variable name (e.g., requestedPath) 
  // so you don't overwrite the 'path' module
  const requestedPath = req.params[0]; 
  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Silicon Compliance Agent running on port ${PORT}`);
});
