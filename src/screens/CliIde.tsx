import { useState } from "react";
import { TASK_SCOPES } from "../store/seed";
import { useStore } from "../store/store";

type Tab = "orchestrator" | "agent" | "doctl";

const ORCH_SRC = `// orchestrator.ts — parent never leaves the secret manager
const parent = await vault.read("do/prod/coding-agent-parent");

const res = await fetch("https://api.digitalocean.com/v2/credentials", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${parent}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    parent: "agent:coding-agent-prod",
    scopes: ["droplet:create", "droplet:read", "droplet:delete",
             "volume:*", "inference:invoke"],
    expires_in: 600,
    label: "task-staging",
  }),
});

const child = await res.json();
// child.secret is returned once. ceilings is null at GA on this API.
await harness.start({ env: { DIGITALOCEAN_TOKEN: child.secret } });`;

const AGENT_SRC = `// agent.ts — only the child is in this process
const token = process.env.DIGITALOCEAN_TOKEN; // dop_c_… not the parent

await fetch("https://api.digitalocean.com/v2/droplets", {
  method: "POST",
  headers: { Authorization: \`Bearer \${token}\` },
  body: JSON.stringify({ name: "staging-new-1", region: "nyc3", size: "s-2vcpu-4gb" }),
});
await fetch("https://api.digitalocean.com/v2/volumes", {
  method: "POST",
  headers: { Authorization: \`Bearer \${token}\` },
  body: JSON.stringify({ name: "staging-data", size_gigabytes: 50, region: "nyc3" }),
});
await fetch("https://api.digitalocean.com/v2/gen-ai/inference", {
  method: "POST",
  headers: { Authorization: \`Bearer \${token}\` },
  body: JSON.stringify({ prompt: "What should I create next?" }),
});

// If the task outlives 10 minutes, the orchestrator derives again.
// This process cannot extend the token or read the parent.`;

const DOCTL = `# parent stays in the shell profile / vault — not in the agent
export DIGITALOCEAN_ACCESS_TOKEN=$(vault read -field=value do/prod/coding-agent-parent)

doctl credentials derive \\
  --parent agent:coding-agent-prod \\
  --scopes droplet:create,droplet:read,droplet:delete,volume:*,inference:invoke \\
  --expires-in 600 \\
  --label task-staging

# later, stop one task without touching tenant B
doctl credentials revoke cred_01HQ8f21c
doctl credentials decisions cred_01HQ8f21c`;

export function CliIde() {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState<Tab>("orchestrator");
  const last = state.lastDerivedSecret
    ? state.credentials.find((c) => c.id === state.lastDerivedSecret?.credentialId)
    : null;
  const idleRun = state.runs.find((r) => r.label === last?.label && r.status === "idle");

  const terminal = last
    ? `$ curl -s -X POST https://api.digitalocean.com/v2/credentials \\
    -H "Authorization: Bearer $DO_PARENT" \\
    -d '{"parent":"agent:coding-agent-prod","expires_in":600,"label":"${last.label}"}'

HTTP/1.1 201 Created
{
  "id": "${last.id}",
  "secret": "${state.lastDerivedSecret?.secret}",
  "parent": "agent:coding-agent-prod",
  "scopes": ${JSON.stringify(last.scopes)},
  "expires_at": "${last.expiresAt}",
  "ceilings": null,
  "depth": 1
}

# Inspect scopes. Do not assume billing:read was granted.
# Put only secret into the agent. Parent stays in vault.`
    : `$ # Parent token is $DO_PARENT from the secret manager
$ # Run the derive call. The child secret is returned once.`;

  const source = tab === "orchestrator" ? ORCH_SRC : tab === "agent" ? AGENT_SRC : DOCTL;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>IDE / CLI</h1>
          <p>
            You can create the same token from code. The DigitalOcean console,{" "}
            <code>doctl</code>, and the agent all use the same API.
          </p>
        </div>
      </div>
      <div className="ide" data-tour="cli-derive">
        <div className="ide-files">
          <div className="rail-label">coding-agent</div>
          <button className={tab === "orchestrator" ? "on" : ""} onClick={() => setTab("orchestrator")}>
            orchestrator.ts
          </button>
          <button className={tab === "agent" ? "on" : ""} onClick={() => setTab("agent")}>
            agent.ts
          </button>
          <button className={tab === "doctl" ? "on" : ""} onClick={() => setTab("doctl")}>
            terminal · doctl
          </button>
        </div>
        <div className="ide-main">
          <pre className="ide-editor">{source}</pre>
          <div className="ide-term">
            <div className="rail-label">Terminal</div>
            <pre>{terminal}</pre>
            <div className="actions">
              <button
                className="btn"
                data-tour="cli-run"
                onClick={() =>
                  dispatch({
                    type: "DERIVE",
                    tenantId: "acme-user-a",
                    label: "task-staging",
                    scopes: [...TASK_SCOPES],
                    expiresInSeconds: 600,
                  })
                }
              >
                Run POST /v2/credentials
              </button>
              <button
                className="btn secondary"
                data-tour="cli-export"
                disabled={!idleRun || !last}
                onClick={() => {
                  if (!idleRun || !last) return;
                  dispatch({ type: "INJECT", credentialId: last.id, runId: idleRun.id });
                }}
              >
                Export child to agent env
              </button>
              <button
                className="btn secondary"
                onClick={() => dispatch({ type: "ADVANCE_RUN", runId: idleRun?.id ?? state.runs[0].id })}
              >
                Agent calls the API
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <h3>What the API returns</h3>
            <p>
              You see the secret once. Limits are not set on this API yet. If you send a limit, you
              get an error until Q2 2027.
            </p>
            <p className="small">
              Same call: <code>doctl credentials derive</code> · MCP · TypeScript / Go / Python SDKs
            </p>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h3>When the agent is blocked</h3>
            <pre className="yaml">{`403 Forbidden
{
  "id": "ceiling_exhausted",
  "message": "Action ceiling reached (40 of 40).",
  "credential": "cred_01HQ8f21c",
  "remaining": { "actions": 0, "resources": 0, "inference_tokens": 212400 }
}

# After revoke, the next mutate is:
# { "id": "revoked", "message": "Credential revoked." }`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
