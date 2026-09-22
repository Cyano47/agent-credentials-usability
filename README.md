# Agent Credentials usability prototype

Local Wizard-of-Oz app for the study in `study/`. Not production auth, billing, or enforcement.

The entire product is in this prototype. Nothing is labeled Later.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The first screen is **Scenarios**. Click a card, then use **Next** or **Exit** — the walkthrough never advances on its own.

**Share this:** https://agent-credentials-usability-akgau.ondigitalocean.app

| Screen | Feature |
| --- | --- |
| 1. Task credential | Issue a narrower, short-lived credential. Main token stays saved. |
| 2. Limits | $25 spend, 40 actions, 3 live resources, inference tokens, basic Droplets. |
| 3. Shut off | One task, one agent, or the parent. Next request refused everywhere. |
| 4. Decision record | Human → agent → task, access used, permitted or refused. |
| 5. Reverse leftovers | One click reverses leftover Droplets and Volumes. One-hour leases. |
| 6. Suggested ceilings | Defaults and utilization from the last 12 runs. |
| 7. Offboarding | Re-attribute credentials when someone leaves. |
| 8. No standing secret | CI exchanges OIDC for a task credential. |
| 9. Intent-bound | Authority is the operation, not the category. |
| Agents | Managed Agents injects the credential. Same limits. |
| IDE / CLI | Same derive on TypeScript, doctl, MCP, and Terraform. |

Study kit: `study/session-script.md`, `observation-checklist.md`, `slack-debrief-template.md`, `recruit-tracker.md`.
