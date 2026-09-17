import { useLayoutEffect, useState } from "react";
import { scenarioById } from "../store/demo";
import { useStore } from "../store/store";

const CARD_W = 340;
const CARD_H = 240;
const GAP = 14;
const PAD = 8;

function clamp(top: number, left: number) {
  return {
    top: Math.min(Math.max(16, top), window.innerHeight - CARD_H - 16),
    left: Math.min(Math.max(16, left), window.innerWidth - CARD_W - 16),
  };
}

function overlaps(top: number, left: number, rect: DOMRect) {
  return !(left + CARD_W < rect.left || left > rect.right || top + CARD_H < rect.top || top > rect.bottom);
}

function place(
  rect: DOMRect,
  placement: "left" | "right" | "bottom" | "top" = "bottom",
): { top: number; left: number } {
  const options: Record<string, { top: number; left: number }> = {
    bottom: { top: rect.bottom + GAP, left: rect.left },
    right: { top: rect.top, left: rect.right + GAP },
    left: { top: rect.top, left: rect.left - CARD_W - GAP },
    top: { top: rect.top - CARD_H - GAP, left: rect.left },
  };
  const order = [placement, "right", "left", "bottom", "top"];
  for (const key of order) {
    const raw = options[key];
    if (!raw) continue;
    const next = clamp(raw.top, raw.left);
    if (!overlaps(next.top, next.left, rect)) return next;
  }
  return clamp(16, 248);
}

export function Walkthrough() {
  const { state, dispatch } = useStore();
  const scenario = scenarioById(state.activeScenarioId);
  const steps = scenario?.steps ?? [];
  const step = steps[state.demoStep] ?? steps[0];
  const last = steps.length > 0 && state.demoStep === steps.length - 1;
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (!state.walkthroughOpen || !step) {
      setRect(null);
      return;
    }

    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) {
        setRect(null);
        return false;
      }
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
      setRect(el.getBoundingClientRect());
      return true;
    };

    const found = measure();
    const retryA = found ? 0 : window.setTimeout(measure, 60);
    const retryB = found ? 0 : window.setTimeout(measure, 220);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelled = true;
      window.clearTimeout(retryA);
      window.clearTimeout(retryB);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [
    state.walkthroughOpen,
    state.demoStep,
    state.screen,
    step?.target,
    state.credentials.length,
    state.pagerActive,
  ]);

  if (!state.walkthroughOpen || !step || !scenario) return null;

  const card = rect ? place(rect, step.placement) : { top: 88, left: 260 };

  return (
    <>
      {rect && (
        <div
          className="tour-spotlight"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
          }}
        />
      )}
      <aside className="tour-card" style={{ top: card.top, left: card.left }}>
        <div className="tour-progress">
          <span>
            {scenario.title} · {state.demoStep + 1} of {steps.length}
          </span>
          <div className="tour-bar">
            <i style={{ width: `${((state.demoStep + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
        <h2>{step.title}</h2>
        <p>{step.body}</p>
        {step.tryThis && (
          <p className="tour-try">
            <b>Try this.</b> {step.tryThis}
          </p>
        )}
        <div className="tour-nav">
          {last ? (
            <button className="btn" onClick={() => dispatch({ type: "DISMISS_WALKTHROUGH" })}>
              Done
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => dispatch({ type: "SET_DEMO_STEP", step: state.demoStep + 1 })}
            >
              Next
            </button>
          )}
          <button className="btn secondary" onClick={() => dispatch({ type: "DISMISS_WALKTHROUGH" })}>
            Exit
          </button>
        </div>
      </aside>
    </>
  );
}
