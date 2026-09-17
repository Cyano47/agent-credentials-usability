# Recruit and run tracker

**Target:** 8–10 people, 45 minutes. Fish-food 2 internal teammates first. Then external. Do not use DigitalOcean employees as the main sample.

## Internal fish-food (do first)

| # | Person | Date | Done | Fix we created (not a product finding) |
| --- | --- | --- | --- | --- |
| F1 | Teammate A (not PRFAQ owner) |  |  |  |
| F2 | Teammate B (Exauth or MARS preferred) |  |  |  |

## External — start with platform builders

Great Question shortlist (2026 CY): 113675, 112306, 121688, 124302, plus 1–2 people who have not seen the doc.

| # | ID / name | Role | Seen PRFAQ? | Invited | Scheduled | Variant pair | Session done |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 113675 | platform builder | | | | A: pause + “Revoke credential” | |
| 2 | 112306 | platform builder | | | | B: terminate + “Stop new requests” | |
| 3 | 121688 | platform builder | | | | A | |
| 4 | 124302 | platform builder | | | | B | |
| 5 | (GQ, unseen doc) | platform builder | no | | | A | |
| 6 | (GQ, unseen doc) | platform builder | no | | | B | |
| 7 | | Managed Agents / ops | | | | A + scenario 4 | |
| 8 | | Managed Agents / ops | | | | B + scenario 4 | |
| 9 | | Managed Agents / ops (optional) | | | | A + scenario 4 | |
| 10 | | CI/IaC contrast (optional) | | | | either | |

Halfway after row 4: drop the losing exhaust or revoke string if one is clearly failing.

## Outreach (copy)

Subject: 45 minutes — how you contain an agent that has a cloud token

> We’re testing a prototype for task-scoped DigitalOcean credentials. You already spawn an agent per user task and keep a token in a secret manager. We want to watch you work a 2 a.m. incident, not pitch a spec. 45 minutes, recorded internally, no prep. $incentive / donation if that’s your program’s norm.

Manual Great Question search if IDs bounce:

`("agent" OR "coding agent" OR "orchestrator") AND ("DigitalOcean" OR "API token" OR "droplet") created:2026-01-01..2026-12-31`
