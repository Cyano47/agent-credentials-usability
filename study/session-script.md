# 45-minute session script

Moderator + note-taker. Record screen and talk-aloud. Titles stay internal. Do not pitch PRFAQ language first.

**Reset seed before every session** (Prototype controls → Reset). Set exhaust and revoke-copy variants per the tracker. The on-screen **What to do** card is the script for self-guided testers. Platform-builder sessions still use scenarios 1–3 if you are moderating.

| Min | What you say | What you do |
| --- | --- | --- |
| 0–3 | “This is a prototype of a new DigitalOcean credential type. Think aloud. Follow the task card.” | Open `/`. They start on **Your app**. |
| 3–11 | **Scenario 1 — Ship a task.** “A customer just asked your coding agent to stand up a staging box. Your parent token is already in the secret manager. Get the agent running without giving it more access than the task needs.” | Watch orchestrator → secret manager → harness. Note parent leak, 24h expiry, whether they inspect granted scopes. |
| 11–23 | **Scenario 2 — 2 a.m. loop.** “Pager: tenant A’s agent is creating droplets in a loop. Stop that agent. Do not take tenant B down. Then tell me what it created and what it is still costing.” | Pager is already on. Watch revoke vs delete-all, undo expectation, whether they open decision records or billing. |
| 23–31 | **Scenario 3 — Ceiling.** “This run just returned `ceiling_exhausted` after 40 actions. The user still wants the environment. What do you do?” | If they need the state, hit **Hit ceiling**. Watch pause vs terminate, edit-live-credential, blame. |
| 31–39 | **Scenario 4 — Contrast (3 people).** Same pager, Managed Agents. “You did not mint this credential.” | Watch who they think owns the parent; safer vs opaque. |
| 39–44 | “What would you call this? What would you not trust?” | Do not offer “Agent Credentials” until they name it. |
| 44–45 | Thanks. Invite optional follow-up if a design partner. | Reset seed. |

Ask *why* only when they deviate (Levine, Krug). If a flow is stuck, Wizard-of-Oz it: **Agent retried**, **Hit ceiling**, **Task outlived 10m**, **Spawn sub-agent**.
