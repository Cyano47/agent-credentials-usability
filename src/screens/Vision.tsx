import { useStore } from "../store/store";

export function Vision() {
  const { state, dispatch } = useStore();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Control plane</h1>
          <p>
            The full product: suggested ceilings, utilization, billing reconciliation, owner
            offboarding, workload identity, and intent-bound actions.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="card" data-tour="suggested-defaults">
            <h3>Suggested ceilings</h3>
            <p className="lede">From the last 12 coding-agent-prod runs. You can still type your own.</p>
            <table>
              <tbody>
                <tr>
                  <td>Spend</td>
                  <td>
                    <b>$18</b> <span className="small">suggested · cap $25</span>
                  </td>
                </tr>
                <tr>
                  <td>Actions</td>
                  <td>
                    <b>36</b> <span className="small">suggested · cap 40</span>
                  </td>
                </tr>
                <tr>
                  <td>Resources</td>
                  <td>
                    <b>3</b> <span className="small">this task always needs a box + volume</span>
                  </td>
                </tr>
                <tr>
                  <td>Inference tokens</td>
                  <td>
                    <b>280,000</b> <span className="small">includes reasoning tokens</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card" data-tour="utilization">
            <h3>Utilization by agent</h3>
            <p className="small">coding-agent-prod · last 7 days</p>
            <p>
              Median run used <b>61%</b> of its spend ceiling and <b>44%</b> of its action ceiling.
              3 of 48 runs hit a ceiling. Those three were retry loops.
            </p>
          </div>
          <div className="card" data-tour="reconcile">
            <h3>Reconciled with billing</h3>
            <p>
              <span className="pill permitted">100%</span> of permitted creates match a billing or
              resource-creation event. No silent path.
            </p>
            <p className="small">40 permitted · 1 scope denied · 1 ceiling exhausted · 0 missing</p>
          </div>
        </div>
        <div className="col">
          <div className="card" data-tour="offboard">
            <h3>Owner offboarding</h3>
            <p>
              Owner {state.ownerOffboarded ? "was Maya. Now " : ""}
              <b>{state.ownerEmail}</b>
            </p>
            <p className="small">
              When someone leaves, every credential they owned is re-attributed. Ceilings and
              revocation stay in place. No standing token walks out with them.
            </p>
            <button
              className="btn secondary"
              disabled={state.ownerOffboarded}
              onClick={() => dispatch({ type: "OFFBOARD_OWNER" })}
            >
              {state.ownerOffboarded ? "Re-attributed" : "Maya left. Re-attribute credentials."}
            </button>
          </div>
          <div className="card" data-tour="oidc">
            <h3>No standing secret</h3>
            <p className="lede">
              CI and cloud workloads exchange OIDC for a task credential. The long-lived token is
              only a derivation root. It never enters the agent.
            </p>
            <pre className="yaml">{`# GitHub Actions / any OIDC workload
doctl credentials exchange \\
  --audience digitalocean \\
  --parent agent:coding-agent-prod \\
  --label task-ci-814 \\
  --spend-usd 25`}</pre>
          </div>
          <div className="card" data-tour="intent-bound">
            <h3>Intent-bound actions</h3>
            <p className="lede">This run may do these operations — not the whole scope class.</p>
            <ul className="intent-list">
              <li>Create Droplet <code>staging-web-1</code> in nyc3</li>
              <li>Create Volume <code>staging-data</code> and attach it</li>
              <li>Call inference on one model, max 20,000 output tokens</li>
            </ul>
            <p className="small">
              <code>droplet:update</code> on any other Droplet is refused. Authority is the
              operation, not the category.
            </p>
            <button className="btn secondary" onClick={() => dispatch({ type: "TRY_INTENT_BOUND" })}>
              Try updating preview-api-1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}