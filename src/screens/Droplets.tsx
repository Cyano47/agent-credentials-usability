import { useStore, useStudyHelpers } from "../store/store";

export function Droplets() {
  const { state, dispatch } = useStore();
  const { hourlyLeftover } = useStudyHelpers();

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Resources</h1>
          <p>
            Droplets and Volumes keep running after you revoke a token. Delete them here if you want
            billing to stop.
          </p>
        </div>
      </div>
      <div className="banner info">
        Still billing ${hourlyLeftover().toFixed(3)}/hr across {state.resources.filter((r) => r.stillBilling).length}{" "}
        resources.
      </div>
      <div className="actions" data-tour="reverse-effects">
        <button
          className="btn"
          disabled={!state.resources.some((r) => r.status === "running" && r.tenantId === "acme-user-a")}
          onClick={() => dispatch({ type: "REVERSE_EFFECTS", credentialId: "cred_01HQ8f21c" })}
        >
          Reverse leftovers for this token
        </button>
        <p className="small">
          Deletes customer A leftovers and stops their bill. Customer B stays up.
        </p>
      </div>
      <div className="card" data-tour="leftover-droplets">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Customer</th>
              <th>Created by</th>
              <th>Status</th>
              <th>Hourly</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {state.resources.map((resource) => {
              const cred = state.credentials.find((c) => c.id === resource.credentialId);
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
                    <span className={`pill ${resource.status}`}>{resource.status}</span>
                    {resource.stillBilling && <span className="small"> · billing</span>}
                  </td>
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
  );
}
