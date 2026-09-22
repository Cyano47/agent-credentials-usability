import { useStore, useStudyHelpers } from "../store/store";

export function Droplets() {
  const { state, dispatch } = useStore();
  const { hourlyLeftover } = useStudyHelpers();
  const leftovers = state.resources.filter((r) => {
    if (r.status !== "running") return false;
    const cred = state.credentials.find((c) => c.id === r.credentialId);
    return !cred || cred.status === "revoked" || cred.status === "expired";
  });
  const leftoverHourly = leftovers.reduce((sum, r) => sum + r.hourlyUsd, 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Reverse leftovers</h1>
          <p>
            Resources still running after their credential expired or was shut off. Shutoff is not
            undo. Reverse them in one click, or destroy one at a time. Each leftover also has a
            one-hour lease.
          </p>
        </div>
        <button
          className="btn danger"
          data-tour="reverse-leftovers"
          disabled={leftovers.length === 0}
          onClick={() => dispatch({ type: "REVERSE_EFFECTS" })}
        >
          Reverse leftovers
        </button>
      </div>
      <div className="banner info" data-tour="orphan-view">
        Leftovers still billing ${leftoverHourly.toFixed(3)}/hr · {leftovers.length} resources. All
        running resources: ${hourlyLeftover().toFixed(3)}/hr.
      </div>
      <div className="row">
        <div className="col">
          <div className="card" data-tour="leftover-droplets">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Customer</th>
                  <th>Created by</th>
                  <th>Credential</th>
                  <th>Lease</th>
                  <th>Hourly</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {state.resources.map((resource) => {
                  const cred = state.credentials.find((c) => c.id === resource.credentialId);
                  const orphan =
                    resource.status === "running" &&
                    (!cred || cred.status === "revoked" || cred.status === "expired");
                  return (
                    <tr key={resource.id}>
                      <td>
                        <b>{resource.name}</b>
                        <div className="small mono">{resource.id}</div>
                      </td>
                      <td>{resource.type}</td>
                      <td>{resource.tenantId}</td>
                      <td>{cred?.label ?? resource.credentialId}</td>
                      <td>
                        <span className={`pill ${cred?.status ?? "revoked"}`}>
                          {cred?.status ?? "gone"}
                        </span>
                        {orphan && <span className="small"> · leftover</span>}
                      </td>
                      <td>{resource.status === "running" ? "58 min left" : "—"}</td>
                      <td>${resource.hourlyUsd.toFixed(3)}</td>
                      <td>
                        {resource.status === "running" && (
                          <button
                            className="btn secondary"
                            onClick={() => dispatch({ type: "DELETE_RESOURCE", resourceId: resource.id })}
                          >
                            Destroy
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col">
          <div className="card" data-tour="leases">
            <h3>Leases</h3>
            <p>
              Every resource created by a task credential gets a one-hour lease. When the lease
              ends, the platform reverses it unless you extend. That is how leftover spend stops
              without a human hunt.
            </p>
            <p className="small">Hourly debit still counts against the $ spend ceiling while the lease is live.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
