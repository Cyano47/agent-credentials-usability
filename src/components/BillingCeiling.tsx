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
    }
  );
}

function Meter({ label, used, max }: { label: string; used: number; max: number }) {
  const pct = max === 0 ? 0 : Math.min(100, (used / max) * 100);
  const hit = used >= max;
  return (
    <div className={`ceiling-meter${hit ? " hit" : ""}`}>
      <div className="ceiling-meter-row">
        <span>{label}</span>
        <span>
          {used.toLocaleString()} / {max.toLocaleString()}
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
  note = "New API calls stop when this is hit. Droplets and Volumes already created still bill.",
}: {
  progress: CeilingProgress;
  tour?: boolean;
  compact?: boolean;
  note?: string;
}) {
  const exhausted = progress.actions.used >= progress.actions.max;
  return (
    <div
      className={`billing-ceiling${exhausted ? " hit" : ""}${compact ? " compact" : ""}`}
      data-tour={tour ? "billing-ceiling" : undefined}
    >
      <div className="ceiling-head">
        <strong>Billing ceiling</strong>
        {exhausted && <span className="pill ceiling_exhausted">reached</span>}
      </div>
      <Meter label="Actions" used={progress.actions.used} max={progress.actions.max} />
      <Meter label="Resources" used={progress.resources.used} max={progress.resources.max} />
      <Meter
        label="Inference tokens"
        used={progress.inference_tokens.used}
        max={progress.inference_tokens.max}
      />
      {!compact && <p className="small">{note}</p>}
    </div>
  );
}
