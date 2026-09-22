import { DEFAULT_CEILINGS } from "../store/seed";
import type { CeilingProgress, CeilingTriple, Decision } from "../types";

export function ceilingProgress(
  decisions: Decision[],
  credentialId: string | null,
  max: CeilingTriple = DEFAULT_CEILINGS,
): CeilingProgress {
  const last = credentialId
    ? [...decisions].reverse().find((row) => row.credentialId === credentialId && row.ceilings)
    : undefined;
  return (
    last?.ceilings ?? {
      actions: { used: 0, max: max.actions },
      resources: { used: 0, max: max.resources },
      inference_tokens: { used: 0, max: max.inference_tokens },
      spend_usd: { used: 0, max: max.spend_usd },
    }
  );
}

function Meter({
  label,
  used,
  max,
  money = false,
}: {
  label: string;
  used: number;
  max: number;
  money?: boolean;
}) {
  const pct = max === 0 ? 0 : Math.min(100, (used / max) * 100);
  const hit = used >= max;
  const fmt = (n: number) => (money ? `$${n.toFixed(2)}` : n.toLocaleString());
  return (
    <div className={`ceiling-meter${hit ? " hit" : ""}`}>
      <div className="ceiling-meter-row">
        <span>{label}</span>
        <span>
          {fmt(used)} / {fmt(max)}
        </span>
      </div>
      <div className="ceiling-track">
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function BillingCeiling({
  progress,
  tour = false,
  compact = false,
  note = "New API calls stop when spend, actions, live resources, or inference tokens hit the cap. Reverse leftovers to stop the hourly bill.",
}: {
  progress: CeilingProgress;
  tour?: boolean;
  compact?: boolean;
  note?: string;
}) {
  const spend = progress.spend_usd ?? { used: 0, max: DEFAULT_CEILINGS.spend_usd };
  const exhausted =
    progress.actions.used >= progress.actions.max || spend.used >= spend.max;
  return (
    <div
      className={`billing-ceiling${exhausted ? " hit" : ""}${compact ? " compact" : ""}`}
      data-tour={tour ? "billing-ceiling" : undefined}
    >
      <div className="ceiling-head">
        <strong>Limits</strong>
        {exhausted && <span className="pill ceiling_exhausted">reached</span>}
      </div>
      <Meter money label="Spend" used={spend.used} max={spend.max} />
      <Meter label="Actions" used={progress.actions.used} max={progress.actions.max} />
      <Meter label="Live resources" used={progress.resources.used} max={progress.resources.max} />
      <Meter
        label="Inference tokens"
        used={progress.inference_tokens.used}
        max={progress.inference_tokens.max}
      />
      {!compact && <p className="small">{note}</p>}
    </div>
  );
}
