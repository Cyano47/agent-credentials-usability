import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type {
  CeilingTriple,
  Credential,
  Decision,
  ExhaustVariant,
  ObservationFlags,
  RevokeCopyVariant,
  ScreenId,
  StudyState,
  TenantId,
} from "../types";
import {
  CHILD_A,
  CHILD_B,
  AGENT_ACTIONS,
  HAPPY_PATH_STEPS,
  PARENT_CREDENTIAL,
  PARENT_SCOPES,
  TASK_SCOPES,
  createInitialState,
  DEFAULT_CEILINGS,
} from "./seed";
import { scenarioById } from "./demo";

type Action =
  | { type: "SET_SCREEN"; screen: ScreenId }
  | { type: "SET_DEMO_STEP"; step: number }
  | { type: "SET_EXHAUST"; variant: ExhaustVariant }
  | { type: "SET_REVOKE_COPY"; variant: RevokeCopyVariant }
  | { type: "SELECT_CREDENTIAL"; id: string | null }
  | { type: "SET_FILTER"; filter: StudyState["selectedDecisionFilter"] }
  | { type: "DISMISS_TOAST" }
  | { type: "DISMISS_SECRET" }
  | { type: "MARK"; flag: keyof ObservationFlags }
  | { type: "RESET" }
  | { type: "DISMISS_WALKTHROUGH" }
  | { type: "START_SCENARIO"; id: string }
  | { type: "REVEAL_PARENT" }
  | {
      type: "DERIVE";
      tenantId: TenantId;
      label: string;
      scopes: string[];
      expiresInSeconds: number;
    }
  | { type: "INJECT"; credentialId: string; runId: string }
  | { type: "ADVANCE_RUN"; runId: string }
  | { type: "WIZARD"; kind: WizardKind; runId?: string }
  | { type: "REVOKE"; credentialId: string }
  | { type: "END_TASK"; runId: string }
  | { type: "APPROVE_NEW_CHILD"; runId: string }
  | { type: "TRY_EXTEND"; credentialId: string }
  | { type: "TRY_RAISE_CEILING"; runId: string }
  | { type: "DELETE_RESOURCE"; resourceId: string };

export type WizardKind =
  | "agent-retried"
  | "hit-ceiling"
  | "expire-task"
  | "spawn-subagent"
  | "complete-run"
  | "toggle-pager";

function intersectScopes(requested: string[], parent: string[]): string[] {
  return requested.filter((scope) => {
    if (parent.includes(scope)) return true;
    const [resource] = scope.split(":");
    return parent.includes(`${resource}:*`);
  });
}

function nextId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function addLog(state: StudyState, line: string): string[] {
  return [...state.eventLog, line].slice(-40);
}

function mark(state: StudyState, flag: keyof ObservationFlags): StudyState {
  if (state.observations[flag]) return state;
  return { ...state, observations: { ...state.observations, [flag]: true } };
}

function tick(state: StudyState, seconds: number): string {
  const t = new Date(state.nowIso).getTime() + seconds * 1000;
  return new Date(t).toISOString().replace(".000", "");
}

function remainingFor(
  credentialId: string,
  decisions: Decision[],
  ceilings: CeilingTriple | null,
): CeilingTriple | null {
  if (!ceilings) return null;
  const last = [...decisions].reverse().find((d) => d.credentialId === credentialId && d.ceilings);
  if (!last?.ceilings) return { ...ceilings };
  return {
    actions: Math.max(0, ceilings.actions - last.ceilings.actions.used),
    resources: Math.max(0, ceilings.resources - last.ceilings.resources.used),
    inference_tokens: Math.max(0, ceilings.inference_tokens - last.ceilings.inference_tokens.used),
  };
}

function reducer(state: StudyState, action: Action): StudyState {
  switch (action.type) {
    case "SET_SCREEN":
      if (action.screen === "scenarios") {
        return {
          ...state,
          screen: "scenarios",
          walkthroughOpen: false,
          activeScenarioId: null,
          toast: null,
        };
      }
      return { ...state, screen: action.screen, toast: null };
    case "START_SCENARIO": {
      const scenario = scenarioById(action.id);
      if (!scenario) return state;
      let next: StudyState = {
        ...createInitialState(),
        activeScenarioId: scenario.id,
        walkthroughOpen: true,
      };
      if (scenario.setup === "revoke-a") {
        next = reducer(next, { type: "REVOKE", credentialId: CHILD_A.id });
      }
      if (scenario.setup === "hit-ceiling") {
        next = reducer(next, { type: "WIZARD", kind: "hit-ceiling" });
      }
      return reducer(
        { ...next, activeScenarioId: scenario.id, walkthroughOpen: true, toast: null },
        { type: "SET_DEMO_STEP", step: 0 },
      );
    }
    case "SET_DEMO_STEP": {
      const steps = scenarioById(state.activeScenarioId)?.steps ?? [];
      const step = steps[action.step];
      if (!step) return state;
      let next: StudyState = {
        ...state,
        demoStep: action.step,
        walkthroughOpen: true,
        screen: step.screen,
        selectedCredentialId: step.select ?? state.selectedCredentialId,
        pagerActive: step.pager ?? state.pagerActive,
        toast: null,
      };
      if (step.apply === "revoke-a") {
        next = reducer(next, { type: "REVOKE", credentialId: CHILD_A.id });
        next = { ...next, demoStep: action.step, screen: step.screen, toast: null };
      }
      if (step.apply === "hit-ceiling") {
        next = reducer(next, { type: "WIZARD", kind: "hit-ceiling" });
        next = { ...next, demoStep: action.step, screen: step.screen, toast: null };
      }
      return next;
    }
    case "DISMISS_WALKTHROUGH":
      return {
        ...state,
        walkthroughOpen: false,
        activeScenarioId: null,
        screen: "scenarios",
        toast: null,
      };
    case "SET_EXHAUST":
      return {
        ...state,
        exhaustVariant: action.variant,
        toast: `Exhaust variant: ${action.variant}`,
        eventLog: addLog(state, `Moderator set exhaust variant to ${action.variant}`),
      };
    case "SET_REVOKE_COPY":
      return {
        ...state,
        revokeCopyVariant: action.variant,
        toast: `Revoke copy: ${action.variant}`,
        eventLog: addLog(state, `Moderator set revoke copy to ${action.variant}`),
      };
    case "SELECT_CREDENTIAL":
      return { ...state, selectedCredentialId: action.id };
    case "SET_FILTER":
      return mark({ ...state, selectedDecisionFilter: action.filter }, "usedDecisionRecord");
    case "DISMISS_TOAST":
      return { ...state, toast: null };
    case "DISMISS_SECRET":
      return { ...state, lastDerivedSecret: null };
    case "MARK":
      return mark(state, action.flag);
    case "RESET":
      return createInitialState();
    case "REVEAL_PARENT":
      return {
        ...state,
        credentials: state.credentials.map((c) =>
          c.id === PARENT_CREDENTIAL.id ? { ...c, secretRevealed: true } : c,
        ),
        toast: "Main token is visible. Do not give this to the agent.",
      };
    case "DERIVE": {
      const parent = state.credentials.find((c) => c.id === PARENT_CREDENTIAL.id);
      if (!parent || parent.status !== "active") {
        return { ...state, toast: "Parent credential is not usable." };
      }
      if (action.expiresInSeconds < 60) {
        return { ...state, toast: "Lifetime must be at least 60 seconds." };
      }
      const granted = intersectScopes(action.scopes, parent.scopes);
      const id = nextId("cred");
      const secret = `dop_c_${id.slice(-6)}_ONCE`;
      const child: Credential = {
        id,
        parent: parent.agent,
        agent: parent.agent,
        label: action.label || `task-${id.slice(-5)}`,
        tenantId: action.tenantId,
        scopes: granted,
        requestedScopes: action.scopes,
        expiresAt: tick(state, action.expiresInSeconds),
        expiresInSeconds: action.expiresInSeconds,
        status: "active",
        ceilings: { ...DEFAULT_CEILINGS },
        depth: 1,
        lastActivity: state.nowIso,
        createdAt: state.nowIso,
        kind: "child",
        secret,
        secretRevealed: true,
      };
      const runId = nextId("run");
      let next: StudyState = {
        ...state,
        nowIso: tick(state, 2),
        lastDerivedSecret: { credentialId: id, secret },
        selectedCredentialId: id,
        credentials: [...state.credentials, child],
        toast: "Task token shown once. You cannot see it again.",
        eventLog: addLog(state, `Derived ${child.label} for ${action.tenantId} (${action.expiresInSeconds}s)`),
        runs: [
          ...state.runs,
          {
            id: runId,
            tenantId: action.tenantId,
            label: child.label,
            mode: "self-hosted",
            status: "idle",
            injectedCredentialId: null,
            parentLeaked: false,
            stepIndex: 0,
            ceilings: { ...DEFAULT_CEILINGS },
            remaining: { ...DEFAULT_CEILINGS },
            taskPrompt: "Stand up a staging box.",
          },
        ],
      };
      if (action.expiresInSeconds >= 3600) next = mark(next, "pickedLongExpiry");
      if (action.expiresInSeconds <= 600) next = mark(next, "derivedPerTask");
      return next;
    }
    case "INJECT": {
      const cred = state.credentials.find((c) => c.id === action.credentialId);
      if (!cred) return { ...state, toast: "No credential selected." };
      const leaked = cred.kind === "parent";
      let next: StudyState = {
        ...state,
        runs: state.runs.map((run) =>
          run.id === action.runId
            ? {
                ...run,
                injectedCredentialId: cred.id,
                parentLeaked: leaked,
                status: run.status === "idle" ? "running" : run.status,
              }
            : run,
        ),
        toast: leaked
          ? "The main token is in the agent. That is too much access."
          : `${cred.label} is in the agent. The main token stayed saved.`,
        eventLog: addLog(
          state,
          leaked ? `LEAK: parent injected into ${action.runId}` : `Injected ${cred.id} into ${action.runId}`,
        ),
      };
      if (leaked) next = mark(next, "parentShownInHarness");
      const alreadyUsed = state.runs.some(
        (run) => run.injectedCredentialId === cred.id && run.id !== action.runId,
      );
      if (alreadyUsed && cred.kind === "child") next = mark(next, "childMintedOnceReused");
      return next;
    }
    case "ADVANCE_RUN": {
      const run = state.runs.find((r) => r.id === action.runId);
      if (!run?.injectedCredentialId) {
        return { ...state, toast: "Inject a credential into the harness first." };
      }
      const cred = state.credentials.find((c) => c.id === run.injectedCredentialId);
      if (!cred) return state;
      if (cred.status === "revoked") {
        const decision: Decision = {
          id: nextId("dec"),
          credentialId: cred.id,
          tenantId: run.tenantId,
          timestamp: tick(state, 1),
          action: AGENT_ACTIONS[state.decisions.length % AGENT_ACTIONS.length].action,
          scope: AGENT_ACTIONS[state.decisions.length % AGENT_ACTIONS.length].scope,
          outcome: "revoked",
          agent: cred.agent,
          task: cred.label,
          parent: cred.parent,
          ceilings: null,
          detail: "403 revoked. New requests are refused. Existing resources keep running.",
        };
        return {
          ...state,
          nowIso: tick(state, 1),
          decisions: [...state.decisions, decision],
          toast: "Next call refused: revoked. Resources created earlier are still billing.",
          eventLog: addLog(state, `Post-revoke call on ${cred.label}`),
        };
      }
      if (cred.status === "expired") {
        return {
          ...state,
          toast: "Credential expired. Re-derive from the orchestrator. Do not extend this child.",
        };
      }
      const step = HAPPY_PATH_STEPS[run.stepIndex];
      if (!step) {
        return {
          ...state,
          runs: state.runs.map((r) => (r.id === run.id ? { ...r, status: "completed" } : r)),
          toast: "Run completed. Decision record shows the actor chain.",
        };
      }
      const decision: Decision = {
        id: nextId("dec"),
        credentialId: cred.id,
        tenantId: run.tenantId,
        timestamp: tick(state, 3),
        action: step.action,
        scope: step.scope,
        outcome: step.outcome,
        resourceId: step.resource ? `${step.resource.id}-${run.id.slice(-4)}` : undefined,
        resourceName: step.resource?.name,
        agent: cred.agent,
        task: cred.label,
        parent: cred.parent,
        ceilings: null,
        detail: step.detail,
      };
      const resources = step.resource
        ? [
            ...state.resources,
            {
              id: decision.resourceId!,
              type: step.resource.type,
              name: `${step.resource.name}-${run.tenantId}`,
              tenantId: run.tenantId,
              credentialId: cred.id,
              createdByDecisionId: decision.id,
              stillBilling: true,
              hourlyUsd: step.resource.hourlyUsd,
              region: "nyc3",
              status: "running" as const,
              size: step.resource.size,
            },
          ]
        : state.resources;
      return {
        ...state,
        nowIso: tick(state, 3),
        decisions: [...state.decisions, decision],
        resources,
        selectedCredentialId: cred.id,
        runs: state.runs.map((r) =>
          r.id === run.id
            ? {
                ...r,
                stepIndex: r.stepIndex + 1,
                status: r.stepIndex + 1 >= HAPPY_PATH_STEPS.length ? "completed" : "running",
              }
            : r,
        ),
        toast: `${step.outcome}: ${step.action}`,
        eventLog: addLog(state, `${cred.label}: ${step.action} → ${step.outcome}`),
      };
    }
    case "WIZARD": {
      if (action.kind === "toggle-pager") {
        return { ...state, pagerActive: !state.pagerActive };
      }
      const runId =
        action.runId ??
        state.runs.find((r) => r.mode === "self-hosted" && r.tenantId === "acme-user-a")?.id;
      const run = state.runs.find((r) => r.id === runId);
      if (!run) return state;
      const cred = state.credentials.find((c) => c.id === run.injectedCredentialId);
      if (action.kind === "complete-run") {
        return {
          ...state,
          runs: state.runs.map((r) =>
            r.id === run.id ? { ...r, status: "completed", stepIndex: HAPPY_PATH_STEPS.length } : r,
          ),
          toast: "Moderator marked run complete.",
        };
      }
      if (action.kind === "expire-task") {
        if (!cred) return state;
        return {
          ...state,
          credentials: state.credentials.map((c) =>
            c.id === cred.id ? { ...c, status: "expired" } : c,
          ),
          toast: "Child expired. Orchestrator must derive a new child. Extension is not allowed.",
          eventLog: addLog(state, `${cred.label} expired`),
        };
      }
      if (action.kind === "spawn-subagent") {
        return {
          ...state,
          toast:
            "Sub-agent needs its own child. Derive from the current credential or the orchestrator — do not hand over the parent.",
        };
      }
      if (action.kind === "agent-retried" || action.kind === "hit-ceiling") {
        if (!cred) return { ...state, toast: "No injected credential on this run." };
        const hit = action.kind === "hit-ceiling";
        const nextAction = AGENT_ACTIONS[state.decisions.length % AGENT_ACTIONS.length];
        const decision: Decision = {
          id: nextId("dec"),
          credentialId: cred.id,
          tenantId: run.tenantId,
          timestamp: tick(state, 2),
          action: nextAction.action,
          scope: nextAction.scope,
          outcome: hit ? "ceiling_exhausted" : "permitted",
          agent: cred.agent,
          task: cred.label,
          parent: cred.parent,
          ceilings: {
            actions: { used: hit ? 40 : 10, max: 40 },
            resources: { used: 3, max: 3 },
            inference_tokens: { used: 287600, max: 500000 },
          },
          detail: hit
            ? "403 ceiling_exhausted. The agent cannot raise its own ceiling."
            : "Retry create accepted.",
        };
        const nextStatus = !hit
          ? run.status
          : state.exhaustVariant === "pause-and-approve"
            ? "paused"
            : "terminated";
        return {
          ...state,
          nowIso: tick(state, 2),
          decisions: [...state.decisions, decision],
          selectedCredentialId: cred.id,
          runs: state.runs.map((r) =>
            r.id === run.id
              ? {
                  ...r,
                  status: nextStatus,
                  remaining: hit ? { actions: 0, resources: 0, inference_tokens: 212400 } : r.remaining,
                }
              : r,
          ),
          toast: hit
            ? state.exhaustVariant === "pause-and-approve"
              ? "Run paused. End the task or create a new token. The agent cannot raise its own billing ceiling."
              : "Run stopped. Create a new token if they still want the environment."
            : "Agent retried a create.",
          eventLog: addLog(state, hit ? `Ceiling exhausted on ${cred.label}` : `Retry on ${cred.label}`),
        };
      }
      return state;
    }
    case "REVOKE": {
      const cred = state.credentials.find((c) => c.id === action.credentialId);
      if (!cred) return state;
      const revokeDescendants = cred.kind === "parent";
      const ids = new Set(
        state.credentials
          .filter((c) => c.id === cred.id || (revokeDescendants && c.parent === cred.agent && c.kind === "child"))
          .map((c) => c.id),
      );
      const leftover = state.resources.filter((r) => ids.has(r.credentialId) && r.status === "running");
      return {
        ...state,
        credentials: state.credentials.map((c) => (ids.has(c.id) ? { ...c, status: "revoked" } : c)),
        runs: state.runs.map((r) =>
          r.injectedCredentialId && ids.has(r.injectedCredentialId) ? { ...r, status: "revoked" } : r,
        ),
        toast:
          leftover.length > 0
            ? `Token revoked. ${leftover.length} resources are still running and billing.`
            : "Token revoked. Nothing left running on this token.",
        eventLog: addLog(state, `Revoked ${cred.label}; ${leftover.length} leftovers`),
        selectedCredentialId: cred.id,
      };
    }
    case "END_TASK":
      return {
        ...state,
        runs: state.runs.map((r) => (r.id === action.runId ? { ...r, status: "terminated" } : r)),
        toast: "Task ended. Existing resources still need cleanup.",
        eventLog: addLog(state, `Ended ${action.runId}`),
      };
    case "APPROVE_NEW_CHILD": {
      const run = state.runs.find((r) => r.id === action.runId);
      if (!run) return state;
      const granted = [...TASK_SCOPES];
      const id = nextId("cred");
      const child: Credential = {
        id,
        parent: PARENT_CREDENTIAL.agent,
        agent: PARENT_CREDENTIAL.agent,
        label: `${run.label}-n`,
        tenantId: run.tenantId,
        scopes: granted,
        requestedScopes: granted,
        expiresAt: tick(state, 600),
        expiresInSeconds: 600,
        status: "active",
        ceilings: { ...DEFAULT_CEILINGS },
        depth: 1,
        lastActivity: state.nowIso,
        createdAt: state.nowIso,
        kind: "child",
        secret: `dop_c_${id.slice(-6)}_ONCE`,
        secretRevealed: true,
      };
      return {
        ...state,
        nowIso: tick(state, 2),
        lastDerivedSecret: { credentialId: id, secret: child.secret },
        selectedCredentialId: id,
        credentials: [...state.credentials, child],
        runs: state.runs.map((r) =>
          r.id === run.id
            ? {
                ...r,
                injectedCredentialId: child.id,
                status: "running",
                stepIndex: 0,
                remaining: child.ceilings,
                parentLeaked: false,
              }
            : r,
        ),
        toast: "New task token created and given to the agent. The agent did not raise its own billing ceiling.",
        eventLog: addLog(state, `Approved new child ${child.label}`),
      };
    }
    case "TRY_EXTEND":
      return {
        ...mark(state, "triedToExtendChild"),
        toast: "Cannot extend a credential. That would widen lifetime. Re-derive from the orchestrator.",
      };
    case "TRY_RAISE_CEILING":
      return {
        ...mark(state, "triedToRaiseCeilingFromAgent"),
        toast: "The agent cannot raise its own billing ceiling. End the task or create a new token.",
      };
    case "DELETE_RESOURCE":
      return {
        ...state,
        resources: state.resources.map((r) =>
          r.id === action.resourceId ? { ...r, status: "deleted", stillBilling: false } : r,
        ),
        toast: `${action.resourceId} deleted. Billing stopped.`,
        eventLog: addLog(state, `Deleted ${action.resourceId}`),
      };
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: StudyState;
  dispatch: Dispatch<Action>;
} | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useStudyHelpers() {
  const { state } = useStore();
  const leftoverFor = (credentialId: string) =>
    state.resources.filter((r) => r.credentialId === credentialId && r.status === "running");
  const tenantBAlive = state.credentials.find((c) => c.id === CHILD_B.id)?.status === "active";
  const hourlyLeftover = (tenantId?: TenantId) =>
    state.resources
      .filter((r) => r.stillBilling && (!tenantId || r.tenantId === tenantId))
      .reduce((sum, r) => sum + r.hourlyUsd, 0);
  return {
    leftoverFor,
    tenantBAlive,
    hourlyLeftover,
    parent: state.credentials.find((c) => c.id === PARENT_CREDENTIAL.id),
    parentScopes: PARENT_SCOPES,
    remainingFor: (id: string, ceilings: CeilingTriple | null) =>
      remainingFor(id, state.decisions, ceilings),
  };
}

export const REVOKE_COPY: Record<RevokeCopyVariant, { button: string; confirm: string }> = {
  "revoke-credential": {
    button: "Revoke token",
    confirm: "This revokes the token. Are you sure?",
  },
  "stop-new-requests": {
    button: "Stop new requests — resources keep running",
    confirm:
      "New API calls will be blocked. Droplets and Volumes already created keep running and billing until you delete them.",
  },
};
