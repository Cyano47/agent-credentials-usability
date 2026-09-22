import { CHILD_A } from "../store/seed";
import { useStore } from "../store/store";
import type { Outcome } from "../types";

export function Decisions() {
  const { state, dispatch } = useStore();
  const picked = state.credentials.find((c) => c.id === state.selectedCredentialId);
  const selected =
    (picked?.kind === "child" ? picked : undefined) ??
    state.credentials.find((c) => c.id === CHILD_A.id);
  const rows = state.decisions.filter((d) => {
    if (selected && d.credentialId !== selected.id) return false;
    if (state.selectedDecisionFilter === "all") return true;
    return d.outcome === state.selectedDecisionFilter;
  });

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Decision record</h1>
          <p>
            Every action that changed something — or was refused — is recorded against the agent and
            the task. “What did this agent do?” is a query, not an investigation.
          </p>
        </div>
      </div>
      <div className="card" data-tour="decision-record">
        <div className="actions">
          {state.credentials
            .filter((c) => c.kind === "child")
            .map((cred) => (
              <button
                key={cred.id}
                className={`btn secondary${selected?.id === cred.id ? "" : ""}`}
                onClick={() => dispatch({ type: "SELECT_CREDENTIAL", id: cred.id })}
              >
                {cred.label}
              </button>
            ))}
        </div>
        <p className="small">
          {selected?.label} · parent {selected?.parent} · agent {selected?.agent}
        </p>
        <div className="actions">
          {(["all", "permitted", "scope_denied", "ceiling_exhausted", "revoked"] as const).map(
            (filter) => (
              <button
                key={filter}
                className="btn secondary"
                onClick={() => dispatch({ type: "SET_FILTER", filter: filter as "all" | Outcome })}
              >
                {filter === "ceiling_exhausted" ? "limit reached" : filter}
              </button>
            ),
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Human → agent → task</th>
              <th>Action</th>
              <th>Access</th>
              <th>Result</th>
              <th>Limits left</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.timestamp.slice(11, 19)}</td>
                <td>
                  <div className="small">maya@acme.com</div>
                  <div>{row.agent}</div>
                  <div className="small">{row.task}</div>
                </td>
                <td>
                  {row.action}
                  <div className="small">{row.resourceName ?? row.resourceId ?? "—"}</div>
                </td>
                <td className="small">{row.scope}</td>
                <td>
                  <span className={`pill ${row.outcome}`}>
                    {row.outcome === "ceiling_exhausted" ? "limit reached" : row.outcome}
                  </span>
                  <div className="small">{row.detail}</div>
                </td>
                <td className="small">
                  {row.ceilings
                    ? `${Math.max(0, row.ceilings.actions.max - row.ceilings.actions.used)} act · ${Math.max(0, row.ceilings.resources.max - row.ceilings.resources.used)} res`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="small" data-tour="reconcile">
          40 permitted · 1 scope denied · 1 limit reached · 0 missing vs billing. A silent path
          would show up as a missing record.
        </p>
      </div>
    </div>
  );
}
