import { BillingCeiling } from "../components/BillingCeiling";
import { DEFAULT_CEILINGS } from "../store/seed";
import { useStore, useStudyHelpers } from "../store/store";

export function ManagedAgents() {
  const { state, dispatch } = useStore();
  const { hourlyLeftover } = useStudyHelpers();
  const run = state.runs.find((r) => r.mode === "managed");
  const leftovers = state.resources.filter((r) => r.tenantId === "acme-user-a" && r.status === "running");

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Agents</h1>
          <p>
            DigitalOcean created this token for the run. You did not. Spend, actions, live
            resources, and inference tokens all stop here.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card">
            <h3>Run config</h3>
            <div className="yaml">{`name: staging-box
agent: coding-agent-prod
label: task-8f21c
ceilings:
  spend_usd: 25
  actions: 40
  resources: 3
  inference_tokens: 500000`}</div>
          </div>
        </div>
        <div className="col">
          <div className="card" data-tour="managed-run">
            <h3>This run</h3>
            <p>
              Status <span className={`pill ${run?.status}`}>{run?.status}</span>
            </p>
            <BillingCeiling
              tour
              progress={{
                actions: {
                  used: DEFAULT_CEILINGS.actions - (run?.remaining?.actions ?? 0),
                  max: DEFAULT_CEILINGS.actions,
                },
                resources: {
                  used: DEFAULT_CEILINGS.resources - (run?.remaining?.resources ?? 0),
                  max: DEFAULT_CEILINGS.resources,
                },
                inference_tokens: {
                  used: DEFAULT_CEILINGS.inference_tokens - (run?.remaining?.inference_tokens ?? 0),
                  max: DEFAULT_CEILINGS.inference_tokens,
                },
                spend_usd: {
                  used: DEFAULT_CEILINGS.spend_usd - (run?.remaining?.spend_usd ?? 0),
                  max: DEFAULT_CEILINGS.spend_usd,
                },
              }}
              note="Spend, actions, live resources, and inference tokens all stop on Managed Agents."
            />
            {state.exhaustVariant === "pause-and-approve" ? (
              <div className="banner warn">
                The run paused at its action limit. Create a new token, or end the task. The agent
                cannot raise its own limits.
              </div>
            ) : (
              <div className="banner warn">
                The run stopped. Start a new run if they still want the environment.
              </div>
            )}
            {run && (
              <div className="actions">
                <button className="btn" onClick={() => dispatch({ type: "APPROVE_NEW_CHILD", runId: run.id })}>
                  Approve new token
                </button>
                <button className="btn secondary" onClick={() => dispatch({ type: "END_TASK", runId: run.id })}>
                  End task
                </button>
                <button
                  className="btn secondary"
                  onClick={() => dispatch({ type: "SET_SCREEN", screen: "droplets" })}
                >
                  See resources still running
                </button>
              </div>
            )}
            <p className="small">
              {leftovers.length} customer A resources still up · ${hourlyLeftover("acme-user-a").toFixed(3)}/hr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
