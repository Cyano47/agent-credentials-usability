import { PARENT_CREDENTIAL } from "../store/seed";
import { useStore } from "../store/store";

export function Harness() {
  const { state, dispatch } = useStore();
  const parent = state.credentials.find((c) => c.id === PARENT_CREDENTIAL.id);

  return (
    <div className="card">
      <h2>Agent harness</h2>
      <p className="lede">
        Assumed. We do not build harness internals. This screen only shows what was injected so we can
        see a parent leak.
      </p>
      {state.runs
        .filter((r) => r.mode === "self-hosted")
        .map((run) => {
          const cred = state.credentials.find((c) => c.id === run.injectedCredentialId);
          return (
            <div key={run.id} className="card">
              <h3>
                {run.label} · {run.tenantId}
              </h3>
              <p>
                Status <span className={`pill ${run.status}`}>{run.status}</span>
              </p>
              <div className="yaml">
                {`# harness env for ${run.label}
DO_AGENT=${cred?.agent ?? "—"}
DO_TASK=${cred?.label ?? "—"}
DO_TOKEN=${
                  cred
                    ? cred.kind === "parent"
                      ? parent?.secretRevealed
                        ? parent.secret
                        : "dop_v1_acme_parent_KEEP_IN_VAULT"
                      : cred.secret
                    : "(none injected)"
                }
DO_PARENT_IN_ENV=${run.parentLeaked ? "YES" : "no"}`}
              </div>
              {run.parentLeaked && (
                <div className="banner warn">
                  Parent is in the agent environment. Observation flag parentShownInHarness is on.
                </div>
              )}
              <div className="actions">
                <button
                  className="btn secondary"
                  onClick={() => {
                    if (parent) dispatch({ type: "INJECT", credentialId: parent.id, runId: run.id });
                  }}
                >
                  Use parent instead
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    dispatch({ type: "ADVANCE_RUN", runId: run.id });
                    dispatch({ type: "SET_SCREEN", screen: "run-inspector" });
                  }}
                >
                  Start / step run
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
