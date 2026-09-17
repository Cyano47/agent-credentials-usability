# Agent Credentials usability prototype

Local Wizard-of-Oz app for the study in `study/`. Not production auth, billing, or enforcement.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The first screen is **Scenarios**. Click a card, then use **Next** or **Exit** — the walkthrough never advances on its own.

| Surface | What it is |
| --- | --- |
| DO console | Secret manager + create a task token with a $ spend ceiling |
| API tokens | Token list, revoke, activity, billing ceiling |
| Resources | Leftovers still billing, plus reverse leftovers |
| Agents | Managed Agents run with the same $ / quantity ceiling |
| IDE / CLI | Same derive on TypeScript, doctl, MCP, and Terraform |
| Control plane | Suggested ceilings, utilization, reconciliation, offboarding, OIDC, intent-bound actions |

DigitalOcean’s official console-lookalike repo is [Skiff](https://github.internal.digitalocean.com/digitalocean/skiff) (VPN). This local app copies Control Panel IA; it does not import Skiff.

Study kit: `study/session-script.md`, `observation-checklist.md`, `slack-debrief-template.md`, `recruit-tracker.md`.

Figma file for org comments and versions (blank until screens are captured): [Agent Credentials Usability](https://www.figma.com/design/euSlf1gMyWKlaqItHyiXie).
