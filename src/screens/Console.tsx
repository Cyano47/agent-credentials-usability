import { BillingCeiling, ceilingProgress } from "../components/BillingCeiling";
import { REVOKE_COPY, useStore, useStudyHelpers } from "../store/store";
import type { Outcome } from "../types";

export function Console() {
  const { state, dispatch } = useStore();
  const { leftoverFor, tenantBAlive } = useStudyHelpers();
  const selected = state.credentials.find((c) => c.id === state.selectedCredentialId);
  const copy = REVOKE_COPY[state.revokeCopyVariant];
  const decisions = state.decisions.filter((d) => {
    if (selected && d.credentialId !== selected.id) return false;
    if (state.selectedDecisionFilter === "all") return true;
    return d.outcome === state.selectedDecisionFilter;
  });
  const leftovers = selected ? leftoverFor(selected.id) : [];
  const tokens = state.credentials.filter((c) => c.id !== "cred_managed_8f21c");
  const runA = state.runs.find((r) => r.mode === "self-hosted" && r.tenantId === "acme-user-a");

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>API tokens</h1>
          <p>
            Tokens for people and agents. Revoke a token to stop new API calls. Droplets and Volumes
            it already created keep running.
          </p>
        </div>
        <button className="btn" onClick={() => dispatch({ type: "SET_SCREEN", screen: "platform" })}>
          Create task token
        </button>
      </div>
      <div className="card" data-tour="token-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Last used</th>
              <th>Expires</th>
              <th>Scopes</th>
              <th>Limits</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((cred) => (
              <tr
                key={cred.id}
                className={`clickable ${selected?.id === cred.id ? "selected" : ""}`}
                onClick={() => dispatch({ type: "SELECT_CREDENTIAL", id: cred.id })}
              >
                <td>
                  <b>{cred.label}</b>
                  <div className="small">{cred.tenantId ?? "main token"}</div>
                </td>
                <td>
                  <span className={`pill ${cred.kind}`}>
                    {cred.kind === "parent" ? "Main" : "Task"}
                  </span>
                </td>
                <td>{cred.lastActivity.replace("T", " ").slice(0, 16)}</td>
                <td>{cred.kind === "parent" ? "31 Dec 2027" : cred.expiresAt.slice(11, 16) + " UTC"}</td>
                <td>{cred.scopes.length}</td>
                <td>
                  {cred.ceilings
                    ? `$${cred.ceilings.spend_usd} · ${cred.ceilings.actions} actions · ${cred.ceilings.resources} live`
                    : "None"}
                </td>
                <td>
                  <span className={`pill ${cred.status}`}>{cred.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small">
          Customer B ({tenantBAlive ? "still running" : "stopped"}) should keep working if you only
          revoke task-8f21c.
        </p>
      </div>

      {selected && (
        <div className="row">
          <div className="col">
            <div className="card">
              <h3>{selected.label}</h3>
              <p className="small">
                {selected.kind === "parent"
                  ? "This is the main token. Revoking it also revokes every task token."
                  : "This token is for one task. Other customers keep their own tokens."}
              </p>
              <p>Scopes: {selected.scopes.join(", ")}</p>
              {selected.kind === "child" && (
                <BillingCeiling
                  tour
                  progress={ceilingProgress(state.decisions, selected.id, selected.ceilings ?? undefined)}
                />
              )}
              {(runA?.status === "paused" || runA?.status === "ceiling_exhausted") &&
                selected.id === "cred_01HQ8f21c" && (
                  <div className="banner warn" data-tour="ceiling-banner">
                    Action limit reached (40 of 40). End the task or create a new token from the
                    main token. The agent cannot raise its own limits.
                    <div className="actions">
                      <button
                        className="btn secondary"
                        onClick={() => dispatch({ type: "END_TASK", runId: runA.id })}
                      >
                        End task
                      </button>
                      <button
                        className="btn"
                        onClick={() => dispatch({ type: "APPROVE_NEW_CHILD", runId: runA.id })}
                      >
                        Create new token from main
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => dispatch({ type: "TRY_RAISE_CEILING", runId: runA.id })}
                      >
                        Let the agent raise its limits
                      </button>
                    </div>
                  </div>
                )}
              <div className="actions" data-tour="revoke-task">
                <button
                  className="btn danger"
                  onClick={() => {
                    if (!window.confirm(copy.confirm)) return;
                    dispatch({ type: "REVOKE", credentialId: selected.id });
                  }}
                >
                  {copy.button}
                </button>
                <button
                  className="btn secondary"
                  onClick={() => dispatch({ type: "SET_SCREEN", screen: "droplets" })}
                >
                  View resources it created
                </button>
              </div>
              {leftovers.length > 0 && (
                <p className="small">{leftovers.length} resources still running on this token.</p>
              )}
            </div>
          </div>
          <div className="col">
            <div className="card">
              <h3>Activity</h3>
              <div className="actions">
                {(["all", "permitted", "ceiling_exhausted", "revoked"] as const).map((filter) => (
                  <button
                    key={filter}
                    className="btn secondary"
                    onClick={() => dispatch({ type: "SET_FILTER", filter: filter as "all" | Outcome })}
                  >
                    {filter === "ceiling_exhausted" ? "limit reached" : filter}
                  </button>
                ))}
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {decisions.map((row) => (
                    <tr key={row.id}>
                      <td>{row.timestamp.slice(11, 19)}</td>
                      <td>
                        {row.action}
                        <div className="small">{row.resourceId ?? row.scope}</div>
                      </td>
                      <td>
                        <span className={`pill ${row.outcome}`}>
                          {row.outcome === "ceiling_exhausted" ? "limit reached" : row.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
