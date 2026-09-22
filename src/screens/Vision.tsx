import { useStore } from "../store/store";
import type { ScreenId } from "../types";

const LINKS: { id: ScreenId; label: string; body: string }[] = [
  { id: "platform", label: "1. Task credential", body: "Issue a narrower, short-lived credential." },
  { id: "limits", label: "2. Limits", body: "$25 spend, 40 actions, 3 live resources, inference tokens." },
  { id: "shutoff", label: "3. Shut off", body: "One task, one agent, or the parent." },
  { id: "decisions", label: "4. Decision record", body: "What the agent did, permitted or refused." },
  { id: "droplets", label: "5. Reverse leftovers", body: "One click. One-hour leases." },
  { id: "suggested", label: "6. Suggested ceilings", body: "Defaults from the last 12 runs." },
  { id: "offboard", label: "7. Offboarding", body: "Re-attribute when someone leaves." },
  { id: "oidc", label: "8. No standing secret", body: "CI exchanges OIDC for a task credential." },
  { id: "intent", label: "9. Intent-bound", body: "Authority is the operation, not the category." },
];

export function Vision() {
  const { dispatch } = useStore();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>The product</h1>
          <p>Everything ships here. Open any screen.</p>
        </div>
      </div>
      <div className="scenario-grid">
        {LINKS.map((item) => (
          <button
            key={item.id}
            className="scenario-card"
            onClick={() => dispatch({ type: "SET_SCREEN", screen: item.id })}
          >
            <h3>{item.label}</h3>
            <p>{item.body}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
