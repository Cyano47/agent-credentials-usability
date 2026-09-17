# Seeded prototype state

Frozen clock: `2027-02-10T18:34:12Z`. Two tenants share one parent.

## Parent (secret manager only)

| Field | Value |
| --- | --- |
| id | `cred_parent_coding_agent` |
| agent | `agent:coding-agent-prod` |
| vault path | `do/prod/coding-agent-parent` |
| secret | `dop_v1_acme_parent_KEEP_IN_VAULT` |
| scopes | droplet create/read/delete/update, `volume:*`, `inference:invoke`, `spaces:read`, `billing:read` |
| expiry | 2027-12-31 |

The harness should never see this value. The secret-manager screen can reveal it so we can watch a leak.

## Tenant A — runaway (`acme-user-a`)

- Child `cred_01HQ8f21c`, label `task-8f21c`, 10-minute TTL, depth 1
- Requested `billing:read`; granted scopes omit it (intersection)
- Ceilings `null` on the self-hosted child (GA split)
- Three leftover droplets (`3182`, `3183`, `3184`) and volume `vol-441`, all `stillBilling: true`
- Decision rows include permitted creates, one `scope_denied` on `billing:read`, and `ceiling_exhausted` at action 40/40

## Tenant B — healthy (`acme-user-b`)

- Child `cred_01HQb19d4`, label `task-b19d4`
- Droplet `preview-api-1` / `droplet-5501` must stay up when A is revoked

## Managed Agents contrast

- Injected child `cred_managed_8f21c` with ceilings `40 / 3 / 500000`
- Same leftover resources; no derive call on that screen

## Fake agent must show

- permitted `droplet:create`, `volume:create`, `inference:invoke`
- `ceiling_exhausted`
- `scope_denied`
- post-revoke `revoked` on the next stepped call
- leftover IDs with a still-billing flag
