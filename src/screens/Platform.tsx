import { useState } from "react";
import { BillingCeiling } from "../components/BillingCeiling";
import { DEFAULT_CEILINGS, PARENT_CREDENTIAL, TASK_SCOPES } from "../store/seed";
import { useStore } from "../store/store";
import type { TenantId } from "../types";

export function Platform() {
  const { state, dispatch } = useStore();
  const parent = state.credentials.find((c) => c.id === PARENT_CREDENTIAL.id);
  const [tenantId, setTenantId] = useState<TenantId>("acme-user-a");
  const [label, setLabel] = useState("task-staging");
  const [expiresInSeconds, setExpiresInSeconds] = useState(600);
  const [useParent, setUseParent] = useState(false);
  const last = state.lastDerivedSecret
    ? state.credentials.find((c) => c.id === state.lastDerivedSecret?.credentialId)
    : null;
  const idleRun = state.runs.find((r) => r.label === last?.label && r.status === "idle");
  const activeRun =
    state.runs.find((r) => r.label === last?.label) ??
    state.runs.find((r) => r.mode === "self-hosted" && r.tenantId === tenantId);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>DigitalOcean console</h1>
          <p>
            Create a token for this task. Keep the main token saved. Give the agent only what it
            needs.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card" data-tour="secret-manager">
            <h3>1. Saved token</h3>
            <p className="lede">The main token is saved here. Do not give it to the agent.</p>
            <p>
              <code>do/prod/coding-agent-parent</code>
            </p>
            <p className="small">
              {parent?.agent} · {parent?.scopes.length} scopes · expires 31 Dec 2027
            </p>
            {parent?.secretRevealed ? (
              <div className="secret">{parent.secret}</div>
            ) : (
              <button className="btn secondary" onClick={() => dispatch({ type: "REVEAL_PARENT" })}>
                Show main token
              </button>
            )}
          </div>
        </div>
        <div className="col">
          <div className="card" data-tour="derive-task">
            <h3>2. Create a task token</h3>
            <p className="lede">A customer wants a staging box. The agent will create a Droplet, a Volume, and call inference.</p>
            <button
              className={`choice ${!useParent ? "picked" : ""}`}
              onClick={() => setUseParent(false)}
            >
              <b>Create a short-lived task token</b>
              <div className="small">Best option. Comes from the main token. Shown once.</div>
            </button>
            <button
              className={`choice ${useParent ? "picked" : ""}`}
              onClick={() => setUseParent(true)}
            >
              <b>Reuse the main token</b>
              <div className="small">Works, but the agent can do anything on the account.</div>
            </button>
            {!useParent && (
              <>
                <div className="field">
                  Customer
                  <select value={tenantId} onChange={(e) => setTenantId(e.target.value as TenantId)}>
                    <option value="acme-user-a">acme-user-a</option>
                    <option value="acme-user-b">acme-user-b</option>
                  </select>
                </div>
                <div className="field">
                  Task name
                  <input value={label} onChange={(e) => setLabel(e.target.value)} />
                </div>
                <div className="field">
                  Expires
                  <select
                    value={expiresInSeconds}
                    onChange={(e) => setExpiresInSeconds(Number(e.target.value))}
                  >
                    <option value={600}>10 minutes</option>
                    <option value={3600}>1 hour</option>
                    <option value={86400}>24 hours</option>
                  </select>
                </div>
                <BillingCeiling
                  tour
                  progress={{
                    actions: { used: 0, max: DEFAULT_CEILINGS.actions },
                    resources: { used: 0, max: DEFAULT_CEILINGS.resources },
                    inference_tokens: { used: 0, max: DEFAULT_CEILINGS.inference_tokens },
                    spend_usd: { used: 0, max: DEFAULT_CEILINGS.spend_usd },
                  }}
                  note="Suggested from the last 12 coding-agent-prod runs: $18 spend, 36 actions. This token stops at $25, 40 actions, 3 resources, and 500,000 inference tokens. Leftover Droplets still bill until you reverse them."
                />
                <button
                  className="btn"
                  onClick={() =>
                    dispatch({
                      type: "DERIVE",
                      tenantId,
                      label,
                      scopes: [...TASK_SCOPES],
                      expiresInSeconds,
                    })
                  }
                >
                  Create task token
                </button>
              </>
            )}
            {useParent && parent && (
              <button
                className="btn danger"
                onClick={() => {
                  const run =
                    state.runs.find((r) => r.mode === "self-hosted" && r.status === "idle") ??
                    state.runs.find((r) => r.mode === "self-hosted");
                  if (run) dispatch({ type: "INJECT", credentialId: parent.id, runId: run.id });
                }}
              >
                Put the main token in the agent
              </button>
            )}
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h3>3. What the agent gets</h3>
            {last && state.lastDerivedSecret && (
              <>
                <p className="lede">Shown once. Copy it, then you cannot see it again.</p>
                <div className="secret">{state.lastDerivedSecret.secret}</div>
                <p className="small">Granted: {last.scopes.join(", ")}</p>
                <button
                  className="btn"
                  disabled={!idleRun}
                  onClick={() => {
                    if (!idleRun) return;
                    dispatch({ type: "INJECT", credentialId: last.id, runId: idleRun.id });
                  }}
                >
                  Give this token to the agent
                </button>
              </>
            )}
            {activeRun && (
              <>
                <p>
                  {activeRun.label} · {activeRun.tenantId}{" "}
                  <span className={`pill ${activeRun.status}`}>{activeRun.status}</span>
                </p>
                <div className="yaml">
                  {`DO_TOKEN=${
                    activeRun.parentLeaked
                      ? "dop_v1_acme_parent_KEEP_IN_VAULT"
                      : activeRun.injectedCredentialId
                        ? "dop_c_… (task token)"
                        : "(none)"
                  }`}
                </div>
                {activeRun.parentLeaked && (
                  <div className="banner warn">The main token is in the agent. That is too much access.</div>
                )}
                <div className="actions">
                  <button
                    className="btn secondary"
                    onClick={() => dispatch({ type: "ADVANCE_RUN", runId: activeRun.id })}
                  >
                    Run next step
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => dispatch({ type: "SET_SCREEN", screen: "console" })}
                  >
                    See API tokens
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
