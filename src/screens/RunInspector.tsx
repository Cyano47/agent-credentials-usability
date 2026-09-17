import { useStore } from "../store/store";

export function RunInspector() {
  const { state, dispatch } = useStore();
  const runs = state.runs.filter((r) => r.mode === "self-hosted");

  return (
    <div>
      <div className="card">
        <h2>Run inspector</h2>
        <p className="lede">
          Fake agent loop. It can succeed, retry, hit ceiling_exhausted, or keep calling after revoke.
          Moderator buttons at the bottom drive Wizard-of-Oz events.
        </p>
      </div>
      {runs.map((run) => {
        const cred = state.credentials.find((c) => c.id === run.injectedCredentialId);
        const rows = state.decisions.filter((d) => d.credentialId === cred?.id);
        return (
          <div key={run.id} className="card">
            <h3>
              {run.tenantId} · {run.label}
            </h3>
            <p>
              {run.taskPrompt} · <span className={`pill ${run.status}`}>{run.status}</span>
            </p>
            <p className="small">
              Injected {cred ? `${cred.kind} ${cred.id}` : "nothing"} · parent leaked{" "}
              {run.parentLeaked ? "yes" : "no"}
            </p>
            {(run.status === "paused" || run.status === "ceiling_exhausted") &&
              state.exhaustVariant === "pause-and-approve" && (
                <div className="banner warn">
                  Action ceiling reached (40 of 40). End the task or approve a new child from the parent.
                  The agent cannot raise its own ceiling.
                  <div className="actions">
                    <button className="btn secondary" onClick={() => dispatch({ type: "END_TASK", runId: run.id })}>
                      End task
                    </button>
                    <button className="btn" onClick={() => dispatch({ type: "APPROVE_NEW_CHILD", runId: run.id })}>
                      Approve new child from parent
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => dispatch({ type: "TRY_RAISE_CEILING", runId: run.id })}
                    >
                      Let agent raise ceiling
                    </button>
                  </div>
                </div>
              )}
            {run.status === "terminated" && state.exhaustVariant === "hard-terminate" && (
              <div className="banner warn">
                Run terminated. Derive again from the orchestrator if the user still wants the environment.
              </div>
            )}
            <div className="actions">
              <button className="btn" onClick={() => dispatch({ type: "ADVANCE_RUN", runId: run.id })}>
                Step agent
              </button>
              <button
                className="btn secondary"
                onClick={() => dispatch({ type: "WIZARD", kind: "hit-ceiling", runId: run.id })}
              >
                Force ceiling
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>Outcome</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.timestamp.slice(11, 19)}</td>
                    <td>{row.action}</td>
                    <td>
                      <span className={`pill ${row.outcome}`}>{row.outcome}</span>
                    </td>
                    <td className="small">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
