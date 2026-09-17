# Internal fish-food

Gilad: test on your own team before outsiders. Goal is to fix affordances *we* created, not to collect product findings.

1. Reset seed. Use exhaust `pause-and-approve` and revoke `Revoke credential` for teammate 1; flip both for teammate 2.
2. Give only the scenario-1 prompt. Do not explain Agent Credentials.
3. After they finish scenarios 1–3, ask: “Where did the prototype lie to you?”
4. Log broken chrome in the table below. Patch those before any Great Question session.
5. Do **not** update the PRFAQ from fish-food alone.

| Finding | Ours or product? | Patch |
| --- | --- | --- |
| Secret-once banner easy to dismiss without injecting | ours | keep inject on the 201 card |
| “Open billing instead” is too on-the-nose | ours | leave it; it is an observation trap |
| Parent copy button is too prominent | ours | keep it — we need the leak to be possible |
| Decision filter starts on “all” for the selected child | ours | default select task-8f21c |
