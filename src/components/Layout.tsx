import { useState, type ReactNode } from "react";
import type { ScreenId } from "../types";
import { REVOKE_COPY, useStore } from "../store/store";
import { AccountRail } from "./DemoChrome";
import { Walkthrough } from "./Walkthrough";

const NAV: { id: ScreenId; label: string; section: string }[] = [
  { id: "scenarios", label: "Scenarios", section: "Demo" },
  { id: "platform", label: "DO console", section: "Manage" },
  { id: "console", label: "API tokens", section: "Manage" },
  { id: "droplets", label: "Resources", section: "Manage" },
  { id: "managed-agents", label: "Agents", section: "Manage" },
  { id: "cli", label: "IDE / CLI", section: "Manage" },
];

export function Layout({ children }: { children: ReactNode }) {
  const { state, dispatch } = useStore();
  const [showMod, setShowMod] = useState(false);
  const sections = [...new Set(NAV.map((item) => item.section))];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden />
          DigitalOcean
        </div>
        <span className="team">Acme · Control Panel</span>
        <span className="spacer" />
        <button className="ghost-link" onClick={() => setShowMod((v) => !v)}>
          Prototype controls
        </button>
      </header>
      <Walkthrough />
      <div className={`shell${state.screen === "scenarios" ? " no-rail" : ""}`}>
        <nav className="nav">
          {sections.map((section) => (
            <div key={section}>
              <div className="section">{section}</div>
              {NAV.filter((item) => item.section === section).map((item) => (
                <button
                  key={item.id}
                  className={state.screen === item.id ? "active" : ""}
                  onClick={() => dispatch({ type: "SET_SCREEN", screen: item.id })}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <main className="main">
          {state.toast && (
            <div className="toast">
              <span>{state.toast}</span>
              <button className="btn ghost" onClick={() => dispatch({ type: "DISMISS_TOAST" })}>
                Dismiss
              </button>
            </div>
          )}
          {state.pagerActive && (
            <div className="banner pager" data-tour="pager">
              2 a.m. pager: customer A / task-8f21c is looping Create Droplet, Create Volume, and Call
              inference. Customer B must keep running.
            </div>
          )}
          {children}
          {showMod && (
            <div className="moderator">
              A/B copy only.
              <select
                value={state.exhaustVariant}
                onChange={(e) =>
                  dispatch({
                    type: "SET_EXHAUST",
                    variant: e.target.value as typeof state.exhaustVariant,
                  })
                }
              >
                <option value="pause-and-approve">pause, then approve</option>
                <option value="hard-terminate">stop the run</option>
              </select>
              <select
                value={state.revokeCopyVariant}
                onChange={(e) =>
                  dispatch({
                    type: "SET_REVOKE_COPY",
                    variant: e.target.value as typeof state.revokeCopyVariant,
                  })
                }
              >
                <option value="revoke-credential">{REVOKE_COPY["revoke-credential"].button}</option>
                <option value="stop-new-requests">Stop new requests…</option>
              </select>
            </div>
          )}
        </main>
        {state.screen !== "scenarios" && <AccountRail />}
      </div>
    </div>
  );
}
