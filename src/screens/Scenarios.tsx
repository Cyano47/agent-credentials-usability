import { SCENARIOS } from "../store/demo";
import { useStore } from "../store/store";

export function Scenarios() {
  const { dispatch } = useStore();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Scenarios</h1>
          <p>
            Pick a job from the study. A walkthrough will highlight what to look at. You click Next or
            Exit.
          </p>
        </div>
      </div>
      <div className="scenario-grid">
        {SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            className="scenario-card"
            onClick={() => dispatch({ type: "START_SCENARIO", id: scenario.id })}
          >
            <h3>{scenario.title}</h3>
            <p>{scenario.blurb}</p>
            <span>{scenario.steps.length === 1 ? "1 step" : `${scenario.steps.length} steps`}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
