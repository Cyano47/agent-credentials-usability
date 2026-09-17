# Readout (fish-food pass 1)

Internal only. External sessions are not run yet. Do not start production schema work from this page. Do not put these claims in the PRFAQ until a design partner repeats them.

## What we built

Clickable Vite app at `prototype/agent-credentials-usability`. Seeded `acme-user-a` (runaway) and `acme-user-b` (healthy). Parent lives in the secret-manager stub. Exhaust and revoke-copy are toggles.

## Broken affordances we created (fixed)

1. **Observation flags were camelCase soup.** Footer now shows spaced labels.
2. **Leftovers vanished on Managed Agents.** Resources are tagged to the self-hosted child `cred_01HQ8f21c`, so the managed screen showed `$0.154/hr` and “0 resources still up.” Contrast screen now lists tenant A leftovers.
3. **Leftovers were only on the selected credential.** After revoke, selecting the parent showed an empty list — the exact revoke-as-undo trap. Console now has a still-billing strip for every running resource.

## Flows verified in fish-food

- Derive 10-minute child → secret once → granted scopes narrowed → inject → parent not in harness.
- Ceiling on tenant A → run **paused**, tenant B still running, “approve new child / end task / let agent raise ceiling” present.
- Managed Agents shows injected credential, `run.ceiling_exhausted`, remaining 0/0/212400, no derive call.

Not yet clicked in this pass: console revoke (classifier blocked the nav label), hard-terminate variant, post-revoke next call.

## Variants — no winner yet

Need 4 external sessions before killing one. Current hypothesis to measure: “Stop new requests — existing resources keep running” will send more people to leftovers than “Revoke credential.”

## Do not put in the PRFAQ yet

- That self-hosted builders understand the GA split (ceilings only on Managed Agents).
- That pause-and-approve is clearer than terminate.
- That revoke-as-undo is solved by the longer button string.
- Any external quote.

## Open PRFAQ items this study can still close

Revoke-as-undo risk, pause-vs-terminate, whether builders understand derive/revoke/attribute now and ceilings on Managed Agents later.

## Next

1. Fish-food with 2 teammates using `study/fishfood-protocol.md`.
2. Run 8–10 external sessions from `study/recruit-tracker.md`.
3. After session 4, drop a losing variant.
4. Capture screens into the Figma file once export is approved: [Agent Credentials Usability](https://www.figma.com/design/euSlf1gMyWKlaqItHyiXie).
