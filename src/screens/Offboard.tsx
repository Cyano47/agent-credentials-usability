import { useStore } from "../store/store";

export function Offboard() {
  const { state, dispatch } = useStore();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Owner offboarding</h1>
          <p>
            When someone leaves, every credential they owned is re-attributed. Limits and shutoff
            stay in place. No standing token walks out with them.
          </p>
        </div>
      </div>
      <div className="card" data-tour="offboard">
        <h3>Current owner</h3>
        <p>
          {state.ownerOffboarded ? "Was Maya. Now " : ""}
          <b>{state.ownerEmail}</b>
        </p>
        <button
          className="btn"
          disabled={state.ownerOffboarded}
          onClick={() => dispatch({ type: "OFFBOARD_OWNER" })}
        >
          {state.ownerOffboarded ? "Re-attributed to platform-oncall" : "Maya left. Re-attribute credentials."}
        </button>
      </div>
    </div>
  );
}
