import { CHILD_A, PARENT_CREDENTIAL } from "../store/seed";
import { REVOKE_COPY, useStore, useStudyHelpers } from "../store/store";

export function Shutoff() {
  const { state, dispatch } = useStore();
  const { leftoverFor, tenantBAlive, hourlyLeftover } = useStudyHelpers();
  const copy = REVOKE_COPY[state.revokeCopyVariant];
  const a = state.credentials.find((c) => c.id === CHILD_A.id);
  const leftovers = leftoverFor(CHILD_A.id);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Shut off</h1>
          <p>
            One call. The next request is refused on the API, MCP, CLI, and inference. Requests
            already accepted finish. Created Droplets keep running and keep billing.
          </p>
        </div>
      </div>
      {state.pagerActive && (
        <div className="banner pager">
          Stop customer A. Customer B must keep running.
        </div>
      )}
      <div className="row">
        <div className="col">
          <div className="card" data-tour="revoke-task">
            <h3>1. This task only</h3>
            <p className="lede">
              {a?.label} · <span className={`pill ${a?.status}`}>{a?.status}</span>
            </p>
            <p className="small">Customer B stays up. This is the 2 a.m. move.</p>
            <button
              className="btn danger"
              disabled={a?.status === "revoked"}
              onClick={() => {
                if (!window.confirm(copy.confirm)) return;
                dispatch({ type: "REVOKE", credentialId: CHILD_A.id, scope: "one" });
              }}
            >
              {copy.button} · task-8f21c
            </button>
          </div>
          <div className="card" data-tour="revoke-agent">
            <h3>2. Everything under this agent</h3>
            <p className="lede">coding-agent-prod · every task credential it issued</p>
            <p className="small">Use when the agent, not one task, is the problem.</p>
            <button
              className="btn danger"
              onClick={() => {
                if (!window.confirm("Shut off every task credential under this agent?")) return;
                dispatch({ type: "REVOKE", credentialId: CHILD_A.id, scope: "agent" });
              }}
            >
              Shut off this agent
            </button>
          </div>
          <div className="card" data-tour="revoke-parent">
            <h3>3. The parent token</h3>
            <p className="lede">coding-agent-prod main token · also shuts off every child</p>
            <p className="small">Widest blast radius. Do not use this to stop one customer.</p>
            <button
              className="btn danger"
              onClick={() => {
                if (!window.confirm("Revoke the main token and every task token?")) return;
                dispatch({ type: "REVOKE", credentialId: PARENT_CREDENTIAL.id, scope: "parent" });
              }}
            >
              Shut off the parent
            </button>
          </div>
        </div>
        <div className="col">
          <div className="card" data-tour="shutoff-live">
            <h3>What stays up</h3>
            <p>
              Customer B {tenantBAlive ? "is still running" : "was also stopped"}.
            </p>
            <p>
              {leftovers.length} leftovers from task-8f21c still bill $
              {hourlyLeftover("acme-user-a").toFixed(3)}/hr.
            </p>
            <p className="small">
              Shutoff refuses new authority. It does not undo completed work. Reverse leftovers to
              stop the hourly bill, or destroy one at a time.
            </p>
            <button
              className="btn"
              disabled={leftovers.length === 0}
              onClick={() => dispatch({ type: "REVERSE_EFFECTS", credentialId: CHILD_A.id })}
            >
              Reverse leftovers
            </button>
            <button
              className="btn secondary"
              onClick={() => dispatch({ type: "SET_SCREEN", screen: "droplets" })}
            >
              Open leftovers list
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
