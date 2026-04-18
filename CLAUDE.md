# decide

A decision-support tool that helps users think through tough choices using structured scenario analysis and gut-feeling reflection.

## What it does

5-step guided flow:
1. **The decision** — describe the choice, why it matters, and the main goal
2. **Your options** — name and describe two options (A and B)
3. **What could happen** — add opportunities and threats per option, each scored by likelihood × impact
4. **Gut feeling** — emotional reflection using sliders and emotion tags
5. **The picture** — a scored recommendation, bar charts, and gut-vs-rational alignment note

AI assists with generating options and scenarios via Claude (claude-sonnet-4-20250514).

## Stack

- **Runtime:** Node.js ≥ 18
- **Server:** Express (`server.js`) — serves static files and proxies Anthropic API calls
- **Frontend:** Single HTML file (`docs/index.html`) — vanilla JS, no build step, no framework
- **AI:** Anthropic API via `/api/chat` proxy endpoint (keeps API key server-side)
- **Container:** Docker (Node 18 Alpine)

## Running locally

```bash
npm install
ANTHROPIC_API_KEY=sk-... node server.js
# → http://localhost:3000
```

Or with a custom port:
```bash
PORT=8080 ANTHROPIC_API_KEY=sk-... node server.js
```

## Running with Docker

```bash
docker build -t decide .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-... decide
```

## Key files

| File | Purpose |
|------|---------|
| `server.js` | Express server — static file serving + `/api/chat` proxy |
| `docs/index.html` | Entire frontend — all UI, state, and JS in one file |
| `Dockerfile` | Container build (Node 18 Alpine) |
| `package.json` | Single dependency: `express` |

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | — | Anthropic API key |
| `PORT` | No | `3000` | HTTP port to listen on |

## Architecture notes

- All user data stays in the browser — nothing is persisted server-side
- The server exists solely to keep the API key out of the browser
- `/api/chat` forwards the request body directly to `https://api.anthropic.com/v1/messages` and returns the response as-is
- The frontend uses `escHtml()` for XSS protection when rendering user-supplied text
- Scoring: each scenario scored as `probability × impact` (both 1–5), net score = sum(upsides) − sum(threats)
