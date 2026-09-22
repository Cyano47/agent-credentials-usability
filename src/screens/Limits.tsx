import { BillingCeiling, ceilingProgress } from "../components/BillingCeiling";
import { CHILD_A, DEFAULT_CEILINGS } from "../store/seed";
import { useStore } from "../store/store";

export function Limits() {
  const { state, dispatch } = useStore();
  const picked = state.credentials.find((c) => c.id === state.selectedCredentialId);
  const cred =
    (picked?.kind === "child" ? picked : undefined) ??
    state.credentials.find((c) => c.id === CHILD_A.id);
  const runA = state.runs.find((r) => r.mode === "self-hosted" && r.tenantId === "acme-user-a");
  const progress = ceilingProgress(state.decisions, cred?.id ?? null, cred?.ceilings ?? undefined);
  const hit =
    runA?.status === "paused" ||
    runA?.status === "ceiling_exhausted" ||
    progress.actions.used >= DEFAULT_CEILINGS.actions ||
    (progress.spend_usd?.used ?? 0) >= (progress.spend_usd?.max ?? DEFAULT_CEILINGS.spend_usd);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Limits</h1>
          <p>
            Set when the task credential is issued. Enforced when the request arrives. Spend, actions,
            live resources, and inference tokens all stop the next call. A leftover still bills until
            you reverse it.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card" data-tour="limits-class">
            <h3>What it may create</h3>
            <p className="lede">Instance class is part of the access, so the rate has a maximum.</p>
            <p>
              <span className="pill permitted">droplet:create:basic</span>{" "}
              <span className="pill revoked">not gpu</span>
            </p>
            <p className="small">
              This token can create a basic Droplet. An 8×H100 GPU Droplet is refused. Combined with
              the $25 spend cap, rate and total are both bounded.
            </p>
          </div>
          <div className="card" data-tour="billing-ceiling">
            <h3>{cred?.label ?? "task-8f21c"}</h3>
            <BillingCeiling
              tour
              progress={progress}
              note="Spend, actions, live resources, and inference tokens stop on the API, MCP, CLI, and Managed Agents."
            />
          </div>
        </div>
        <div className="col">
          <div className="card" data-tour="limits-hit">
            <h3>When a limit is hit</h3>
            {hit ? (
              <div className="banner warn">
                $25 of $25 spend, or 40 of 40 actions. The next create is refused with
                ceiling_exhausted. The user still wants the environment. The agent cannot raise its
                own limits.
              </div>
            ) : (
              <p className="lede">This run has not hit a limit yet. Simulate the 2 a.m. loop to see it.</p>
            )}
            {runA && (
              <div className="actions">
                <button
                  className="btn"
                  onClick={() => dispatch({ type: "WIZARD", kind: "hit-ceiling", runId: runA.id })}
                >
                  Hit the spend and action limit
                </button>
                <button
                  className="btn secondary"
                  onClick={() => dispatch({ type: "END_TASK", runId: runA.id })}
                >
                  End task
                </button>
                <button
                  className="btn secondary"
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
            )}
          </div>
          <div className="card">
            <h3>Suggested from last 12 runs</h3>
            <p>
              The platform recommends $18 spend and 36 actions for this task. You can still type $25
              and 40.
            </p>
            <button
              className="btn secondary"
              onClick={() => dispatch({ type: "SET_SCREEN", screen: "suggested" })}
            >
              Open suggested ceilings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
