import { BillingCeiling, ceilingProgress } from "./BillingCeiling";
import { CHILD_A, CHILD_B } from "../store/seed";
import { useStore, useStudyHelpers } from "../store/store";

export function AccountRail() {
  const { state } = useStore();
  const { hourlyLeftover } = useStudyHelpers();
  const a = state.credentials.find((c) => c.id === CHILD_A.id);
  const b = state.credentials.find((c) => c.id === CHILD_B.id);
  const runA = state.runs.find((r) => r.tenantId === "acme-user-a" && r.mode === "self-hosted");
  const runB = state.runs.find((r) => r.tenantId === "acme-user-b" && r.mode === "self-hosted");
  const leftovers = state.resources.filter((r) => r.stillBilling && r.tenantId === "acme-user-a");
  const recent = [...state.decisions].slice(-4).reverse();

  return (
    <aside className="rail" data-tour="live-account">
      <h3>Live account</h3>
      <p className="small">
        Owner {state.ownerEmail}
        {state.ownerOffboarded ? " · re-attributed" : ""}
      </p>
      <div className="rail-card">
        <div className="rail-label">Customer A · task-8f21c</div>
        <div>
          Token <span className={`pill ${a?.status}`}>{a?.status}</span>
        </div>
        <div>
          Run <span className={`pill ${runA?.status}`}>{runA?.status}</span>
        </div>
        <div className="small">
          {leftovers.length} still running · ${hourlyLeftover("acme-user-a").toFixed(3)}/hr
        </div>
        <BillingCeiling compact progress={ceilingProgress(state.decisions, CHILD_A.id)} />
      </div>
      <div className="rail-card">
        <div className="rail-label">Customer B · task-b19d4</div>
        <div>
          Token <span className={`pill ${b?.status}`}>{b?.status}</span>
        </div>
        <div>
          Run <span className={`pill ${runB?.status}`}>{runB?.status}</span>
        </div>
        <div className="small">Must stay up if you revoke A.</div>
      </div>
      <div className="rail-card">
        <div className="rail-label">Still billing</div>
        <div className="rail-cost">${hourlyLeftover().toFixed(3)}/hr</div>
        {state.resources
          .filter((r) => r.stillBilling)
          .map((r) => (
            <div key={r.id} className="small">
              {r.name} · {r.type}
            </div>
          ))}
      </div>
      <div className="rail-card">
        <div className="rail-label">Latest activity</div>
        {recent.map((row) => (
          <div key={row.id} className="small">
            {row.timestamp.slice(11, 19)} {row.action} · {row.outcome}
          </div>
        ))}
      </div>
    </aside>
  );
}
