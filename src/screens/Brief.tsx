import { useStore } from "../store/store";

export function Brief() {
  const { dispatch } = useStore();
  return (
    <div className="card">
      <h2>Give a job, not a tour</h2>
      <p className="lede">
        This is a clickable Wizard-of-Oz prototype. Secret manager and harness already exist. We are
        watching mental models, not conversion.
      </p>
      <ol>
        <li>
          <b>Ship a task.</b> Parent is already in the secret manager. Get a staging box running without
          giving the agent more access than the task needs.
        </li>
        <li>
          <b>2 a.m. loop.</b> Stop tenant A. Do not take tenant B down. Then say what it created and what
          is still costing.
        </li>
        <li>
          <b>Ceiling.</b> The run returned <code>ceiling_exhausted</code> after 40 actions. The user still
          wants the environment.
        </li>
        <li>
          <b>Contrast (3 participants).</b> Same pager in Managed Agents. You did not mint this credential.
        </li>
      </ol>
      <div className="actions">
        <button className="btn" onClick={() => dispatch({ type: "SET_SCREEN", screen: "orchestrator" })}>
          Start at orchestrator
        </button>
        <button className="btn secondary" onClick={() => dispatch({ type: "SET_SCREEN", screen: "console" })}>
          Open console / pager
        </button>
      </div>
    </div>
  );
}
