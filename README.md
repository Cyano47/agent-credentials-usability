# Agent Credentials usability prototype

Local Wizard-of-Oz app for the study in `study/`. Not production auth, billing, or enforcement.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The first screen is **Scenarios**. Click a card, then use **Next** or **Exit** — the walkthrough never advances on its own.

| Surface | What it is |
| --- | --- |
| Your app | Secret manager + start task + agent env |
| API tokens | Control Panel token list, revoke, activity |
| Droplets | Leftover resources still billing |
| Agents | Managed Agents contrast |

DigitalOcean’s official console-lookalike repo is [Skiff](https://github.internal.digitalocean.com/digitalocean/skiff) (VPN). This local app copies Control Panel IA; it does not import Skiff.

Study kit: `study/session-script.md`, `observation-checklist.md`, `slack-debrief-template.md`, `recruit-tracker.md`.

Figma file for org comments and versions (blank until screens are captured): [Agent Credentials Usability](https://www.figma.com/design/euSlf1gMyWKlaqItHyiXie).
