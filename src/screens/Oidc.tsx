import { TASK_SCOPES } from "../store/seed";
import { useStore } from "../store/store";

export function Oidc() {
  const { dispatch } = useStore();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>No standing secret</h1>
          <p>
            CI and cloud workloads exchange OIDC for a task credential. The long-lived token is only
            a derivation root. It never enters the agent or the pipeline.
          </p>
        </div>
      </div>
      <div className="card" data-tour="oidc">
        <h3>OIDC exchange</h3>
        <pre className="yaml">{`# GitHub Actions / any OIDC workload
doctl credentials exchange \\
  --audience digitalocean \\
  --parent agent:coding-agent-prod \\
  --label task-ci-814 \\
  --spend-usd 25 --actions 40 --resources 3`}</pre>
        <button
          className="btn"
          onClick={() =>
            dispatch({
              type: "DERIVE",
              tenantId: "acme-user-a",
              label: "task-ci-814",
              scopes: [...TASK_SCOPES],
              expiresInSeconds: 600,
            })
          }
        >
          Exchange OIDC for a task credential
        </button>
      </div>
    </div>
  );
}
