# OmniBot AI

A multi-channel customer messaging console: it collects conversations from
social platforms into one inbox, drafts replies, tracks sentiment, and meters
usage against a subscription tier.

## Features

- Unified inbox across connected platforms
- Reply drafting with a language model, with the model kept server-side
- Sentiment tagging on incoming messages
- Per-tier usage metering with monthly rollover
- Light and dark themes, responsive layout

## Requirements

- Node.js 18+
- A Supabase project (auth + message storage)
- A Gemini API key (reply drafting)

## Setup

```bash
git clone https://github.com/kkcyber2/OMNIBOT-AI.git
cd OMNIBOT-AI
npm install
cp .env.example .env      # fill in your Supabase and Gemini values
npm run dev               # http://localhost:5173
```

In a second terminal, start the API proxy:

```bash
npm run proxy             # http://localhost:3001
```

### Configuration

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `.env` | Public anon key (safe in the browser bundle; row-level security does the work) |
| `GEMINI_API_KEY` | `.env` | Server-side only. Never expose this one to the client |
| `PORT` | `.env` | Proxy port, defaults to 3001 |

Create two tables in the Supabase SQL editor: `messages` (id, sender_id,
sender_name, platform, content, timestamp, sentiment) and `profiles`
(id, email, tier). Enable row-level security on both and add a policy of
`auth.uid() = sender_id` / `auth.uid() = id` respectively, so each user only
reaches their own rows.

## Tests

```bash
npm test
```

21 tests over the quota logic: monthly rollover, counter increments, tier
limits, remaining allowance, and percentage clamping (including the zero-limit
and over-limit cases). No network or database needed.

## Layout

```
src/lib/quota.ts      quota arithmetic (pure, tested)
src/store/            zustand stores built on it
src/services/         Supabase auth and message access
src/components/       UI
server/proxy.js       Express + WebSocket proxy for model calls
test/                 tests
```

## Licence

MIT — see `LICENSE`. Author: Konain Sultan Khan (KK),
https://github.com/kkcyber2
