# Silicon Compliance Agent 🛡️

> **2026 Digital Camp — Deloitte Digitalization Elite Challenge | Team E**
> *"Silicon-based Colleagues on the Job: Building the Next-Generation Security Compliance Officer for Human × Agent"*

A Node.js + Express enterprise AI gateway. API key is stored securely on the server — never exposed to the browser.

---

## Features

- **PII Detection & Masking** — phone numbers, ID cards, bank cards, names, addresses
- **Compliance Monitoring** — intercepts harmful requests before they reach the AI
- **Audit Logging** — real-time log of all interactions
- **AI Risk Report** — Claude generates a professional risk summary from session data

---

## Project Structure

```
silicon-agent-server/
├── server.js          # Express backend (API key lives here)
├── public/
│   └── index.html     # Frontend (calls /api/chat and /api/report)
├── .env.example       # Copy to .env and add your key
├── .gitignore
├── package.json
└── README.md
```

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/silicon-compliance-agent.git
cd silicon-compliance-agent

npm install

cp .env.example .env
# Edit .env and add your Anthropic API key

npm start
# Open http://localhost:3000
```

---

## Deploy to Render (Free)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) and sign up (free)
3. Click **New → Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Name:** `silicon-compliance-agent`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Under **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `your_actual_api_key`
7. Click **Deploy** — your app will be live at `https://silicon-compliance-agent.onrender.com`

> Render's free tier spins down after 15 minutes of inactivity. First request may take ~30 seconds to wake up.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/chat` | Send sanitized message, get AI reply |
| POST | `/api/report` | Generate AI risk report from session stats |
| GET | `*` | Serve frontend |

### POST /api/chat
```json
{ "message": "sanitized user text" }
```
Returns: `{ "reply": "AI response text" }`

### POST /api/report
```json
{
  "totalInteractions": 10,
  "piiTotal": 4,
  "blockedTotal": 1,
  "piiCounts": { "Name": 2, "Phone": 2, "ID number": 0, "Bank card": 0, "Address": 0 }
}
```
Returns: `{ "report": "Plain text risk report..." }`

---

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your key from [console.anthropic.com](https://console.anthropic.com) |
| `PORT` | Server port (default: 3000, auto-set by Render) |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Frontend | Vanilla HTML/CSS/JS |
| Deploy | Render.com |

---

## License

MIT
