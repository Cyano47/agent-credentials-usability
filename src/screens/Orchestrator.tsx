import { useState } from "react";
import { PARENT_CREDENTIAL, PARENT_SCOPES, TASK_SCOPES } from "../store/seed";
import { useStore } from "../store/store";
import type { TenantId } from "../types";

export function Orchestrator() {
  const { state, dispatch } = useStore();
  const parent = state.credentials.find((c) => c.id === PARENT_CREDENTIAL.id);
  const [tenantId, setTenantId] = useState<TenantId>("acme-user-a");
  const [label, setLabel] = useState("task-staging");
  const [expiresInSeconds, setExpiresInSeconds] = useState(600);
  const [scopes, setScopes] = useState<string[]>([...TASK_SCOPES]);

  const toggle = (scope: string) => {
    setScopes((current) =>
      current.includes(scope) ? current.filter((s) => s !== scope) : [...current, scope],
    );
  };

  const last = state.lastDerivedSecret
    ? state.credentials.find((c) => c.id === state.lastDerivedSecret?.credentialId)
    : null;
  const idleRun = state.runs.find((r) => r.label === last?.label && r.status === "idle");

  return (
    <div className="row">
      <div className="col">
        <div className="card">
          <h2>Customer orchestrator</h2>
          <p className="lede">
            A customer asked the coding agent to stand up a staging box. Pick the parent from the secret
            manager, derive a child, inject only that child into an existing harness run.
          </p>
          <div className="field">
            <span>Parent from secret manager</span>
            <select defaultValue={parent?.id}>
              <option value={parent?.id}>{parent?.agent} · do/prod/coding-agent-parent</option>
            </select>
          </div>
          <div className="field">
            <span>Tenant</span>
            <select value={tenantId} onChange={(e) => setTenantId(e.target.value as TenantId)}>
              <option value="acme-user-a">acme-user-a</option>
              <option value="acme-user-b">acme-user-b</option>
            </select>
          </div>
          <div className="field">
            <span>Task label</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="field">
            <span>expires_in</span>
            <select
              value={expiresInSeconds}
              onChange={(e) => setExpiresInSeconds(Number(e.target.value))}
            >
              <option value={600}>600 seconds (10 minutes)</option>
              <option value={3600}>3600 seconds (1 hour)</option>
              <option value={86400}>86400 seconds (24 hours)</option>
            </select>
          </div>
          <div className="checks">
            {[...PARENT_SCOPES].map((scope) => (
              <label key={scope}>
                <input
                  type="checkbox"
                  checked={scopes.includes(scope)}
                  onChange={() => toggle(scope)}
                />{" "}
                {scope}
                {!TASK_SCOPES.includes(scope as (typeof TASK_SCOPES)[number]) && (
                  <span className="small"> · parent holds this; task may not need it</span>
                )}
              </label>
            ))}
          </div>
          <div className="actions">
            <button
              className="btn"
              onClick={() =>
                dispatch({ type: "DERIVE", tenantId, label, scopes, expiresInSeconds })
              }
            >
              Derive child
            </button>
          </div>
        </div>
      </div>
      <div className="col">
        {last && (
          <div className="card">
            <h3>201 Created · secret shown once</h3>
            <div className="secret">{state.lastDerivedSecret?.secret}</div>
            <p>
              Granted scopes: {last.scopes.join(", ") || "none"}
            </p>
            {last.requestedScopes.some((s) => !last.scopes.includes(s)) && (
              <div className="banner warn">
                Requested scopes the parent lacked or that were omitted:{" "}
                {last.requestedScopes.filter((s) => !last.scopes.includes(s)).join(", ")}
              </div>
            )}
            <p className="small">
              ceilings: null at GA on this API. Expires {last.expiresAt}. Depth {last.depth}.
            </p>
            <div className="actions">
              <button
                className="btn"
                disabled={!idleRun}
                onClick={() => {
                  if (!idleRun) return;
                  dispatch({ type: "INJECT", credentialId: last.id, runId: idleRun.id });
                  dispatch({ type: "SET_SCREEN", screen: "harness" });
                }}
              >
                Inject child into harness
              </button>
              <button className="btn secondary" onClick={() => dispatch({ type: "DISMISS_SECRET" })}>
                Hide secret
              </button>
              <button className="btn secondary" onClick={() => dispatch({ type: "TRY_EXTEND", credentialId: last.id })}>
                Extend this credential
              </button>
            </div>
          </div>
        )}
        <div className="card">
          <h3>Open runs</h3>
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>Tenant</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.runs
                .filter((r) => r.mode === "self-hosted")
                .map((run) => (
                  <tr key={run.id}>
                    <td>{run.label}</td>
                    <td>{run.tenantId}</td>
                    <td>
                      <span className={`pill ${run.status}`}>{run.status}</span>
                    </td>
                    <td>
                      <button
                        className="btn secondary"
                        onClick={() => dispatch({ type: "SET_SCREEN", screen: "run-inspector" })}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
