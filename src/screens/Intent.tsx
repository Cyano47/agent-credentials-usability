import { useStore } from "../store/store";

export function Intent() {
  const { dispatch } = useStore();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Intent-bound actions</h1>
          <p>
            This run may do these operations — not the whole scope class. Authority is the
            operation, not the category.
          </p>
        </div>
      </div>
      <div className="card" data-tour="intent-bound">
        <h3>Allowed on this credential</h3>
        <ul className="intent-list">
          <li>
            Create Droplet <code>staging-web-1</code> in nyc3
          </li>
          <li>
            Create Volume <code>staging-data</code> and attach it
          </li>
          <li>Call inference on one model, max 20,000 output tokens</li>
        </ul>
        <p className="small">
          <code>droplet:update</code> on any other Droplet is refused.
        </p>
        <button className="btn danger" onClick={() => dispatch({ type: "TRY_INTENT_BOUND" })}>
          Try updating preview-api-1
        </button>
      </div>
    </div>
  );
}
