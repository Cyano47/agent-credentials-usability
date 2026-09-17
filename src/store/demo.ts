import type { ScreenId } from "../types";
import { CHILD_A } from "./seed";

export interface WalkStep {
  title: string;
  body: string;
  tryThis?: string;
  target: string;
  screen: ScreenId;
  select?: string;
  pager?: boolean;
  apply?: "revoke-a" | "hit-ceiling" | "cleanup" | "offboard";
  placement?: "left" | "right" | "bottom" | "top";
}

export interface Scenario {
  id: string;
  title: string;
  blurb: string;
  setup?: "hit-ceiling" | "revoke-a";
  steps: WalkStep[];
}

const savedToken: WalkStep = {
  title: "The main token is already saved",
  body: "A customer asked for a staging box. The main token stays in the DigitalOcean console. Do not give it to the agent.",
  tryThis: "Leave it hidden.",
  target: "secret-manager",
  screen: "platform",
  placement: "right",
};

const createToken: WalkStep = {
  title: "Give the task its own token",
  body: "Create a token that lasts 10 minutes. The agent will Create Droplet, Create Volume, and Call inference. If the task takes longer, create a new token. Do not reuse the main one.",
  tryThis: "Create a task token, then give it to the agent.",
  target: "derive-task",
  screen: "platform",
  placement: "left",
};

const billingCeiling: WalkStep = {
  title: "This is the billing ceiling",
  body: "$25 spend, 40 actions, 3 resources, 500,000 inference tokens. New API calls stop when any of these is hit. Droplets already created still bill until you reverse them. The agent cannot raise this.",
  tryThis: "Leave these numbers. Then create the task token.",
  target: "billing-ceiling",
  screen: "platform",
  placement: "left",
};

const twoAmPager: WalkStep = {
  title: "It is 2 a.m.",
  body: "Customer A’s agent is looping Create Droplet, Create Volume, and Call inference. Customer B must keep running.",
  tryThis: "Look at the pager, then the live board.",
  target: "pager",
  screen: "console",
  select: CHILD_A.id,
  pager: true,
  placement: "bottom",
};

const stopA: WalkStep = {
  title: "Stop customer A. Leave B up.",
  body: "Revoke the task token, not the main token. One click. Customer B keeps working.",
  tryThis: "Click Revoke token on task-8f21c. Then look at customer B on the board.",
  target: "revoke-task",
  screen: "console",
  select: CHILD_A.id,
  pager: true,
  placement: "right",
};

const leftovers: WalkStep = {
  title: "What did it create, and what still costs?",
  body: "Revoke stops new calls. It does not delete Droplets or Volumes. They keep billing until you reverse them.",
  tryThis: "Destroy one, or reverse all leftovers from this token.",
  target: "leftover-droplets",
  screen: "droplets",
  apply: "revoke-a",
  pager: true,
  placement: "bottom",
};

const reverseLeftovers: WalkStep = {
  title: "Reverse what it created",
  body: "Compensating cleanup deletes the leftover Droplets and Volumes and stops their hourly bill. Customer B’s resources stay up.",
  tryThis: "Click Reverse leftovers for this token.",
  target: "reverse-effects",
  screen: "droplets",
  pager: true,
  placement: "bottom",
};

const hitLimit: WalkStep = {
  title: "The billing ceiling was hit",
  body: "$25 of $25 and 40 of 40 actions. The run pauses. The user still wants the environment. End the task or create a new token from the main token. The agent cannot raise the billing ceiling.",
  tryThis: "Do not click “Let the agent raise the billing ceiling.”",
  target: "billing-ceiling",
  screen: "console",
  select: CHILD_A.id,
  apply: "hit-ceiling",
  pager: true,
  placement: "bottom",
};

const managed: WalkStep = {
  title: "Same pager. You did not make this token.",
  body: "DigitalOcean created the token for this Managed Agents run. The same $25 / 40 / 3 / 500k billing ceiling is on the run.",
  tryThis: "Approve a new token or end the task.",
  target: "managed-run",
  screen: "managed-agents",
  pager: true,
  placement: "left",
};

const cliCode: WalkStep = {
  title: "Same token, from the IDE",
  body: "This is not console-only. orchestrator.ts calls POST /v2/credentials with the $25 spend ceiling. The main token never leaves the vault.",
  target: "cli-derive",
  screen: "cli",
  placement: "bottom",
};

const cliRun: WalkStep = {
  title: "Run the create",
  body: "You see the secret once. The response includes the billing ceiling. The agent never gets the main token.",
  tryThis: "Click Run POST /v2/credentials.",
  target: "cli-run",
  screen: "cli",
  placement: "top",
};

const cliExport: WalkStep = {
  title: "Give only the new token to the agent",
  body: "Export the child, then let the agent Create Droplet, Create Volume, and Call inference. Open agent.ts, doctl, MCP, or Terraform if you want the same call.",
  tryThis: "Export child to agent env, then Agent calls the API.",
  target: "cli-export",
  screen: "cli",
  placement: "top",
};

const cliSurfaces: WalkStep = {
  title: "MCP and Terraform too",
  body: "The same derive, revoke, and ceiling live on the DigitalOcean MCP server and in Terraform. One revoke stops every surface.",
  tryThis: "Open the MCP or Terraform tab.",
  target: "cli-surfaces",
  screen: "cli",
  placement: "top",
};

const suggested: WalkStep = {
  title: "Suggested ceilings from past runs",
  body: "The platform recommends $18 / 36 actions from the last 12 coding-agent-prod runs. You can still type your own. You do not have to guess.",
  tryThis: "Read the suggested values.",
  target: "suggested-defaults",
  screen: "vision",
  placement: "right",
};

const utilization: WalkStep = {
  title: "Utilization by agent",
  body: "Median run used 61% of its spend ceiling. Three of 48 runs hit a ceiling. Those three were retry loops. Use this to tighten or loosen the next token.",
  target: "utilization",
  screen: "vision",
  placement: "right",
};

const reconcile: WalkStep = {
  title: "Reconciled with billing",
  body: "Every permitted create matches a billing or resource-creation event. A silent path would show up as a missing record, not as a complete log.",
  target: "reconcile",
  screen: "vision",
  placement: "right",
};

const offboard: WalkStep = {
  title: "Maya left. Re-attribute.",
  body: "When someone leaves, every credential they owned is re-attributed. Ceilings and revocation stay in place. No standing token walks out with them.",
  tryThis: "Click Maya left. Re-attribute credentials.",
  target: "offboard",
  screen: "vision",
  placement: "left",
};

const oidc: WalkStep = {
  title: "No standing secret in CI",
  body: "CI and cloud workloads exchange OIDC for a task credential. The long-lived token is only a derivation root. It never enters the agent or the pipeline.",
  target: "oidc",
  screen: "vision",
  placement: "left",
};

const intentBound: WalkStep = {
  title: "This run may do these operations",
  body: "Create Droplet staging-web-1. Create Volume staging-data. Call inference on one model. droplet:update on any other Droplet is refused. Authority is the operation, not the category.",
  tryThis: "Try updating a different Droplet.",
  target: "intent-bound",
  screen: "vision",
  placement: "left",
};

export const SCENARIOS: Scenario[] = [
  {
    id: "ship-a-task",
    title: "Ship a task",
    blurb:
      "A customer asked your coding agent to stand up a staging box. The main token is already saved. Get the agent running without giving it more access than the task needs.",
    steps: [savedToken, createToken, billingCeiling],
  },
  {
    id: "two-am",
    title: "2 a.m. loop",
    blurb:
      "Pager: customer A’s agent is looping Create Droplet, Create Volume, and Call inference. Stop that agent. Do not take customer B down. Then reverse what it created.",
    setup: "hit-ceiling",
    steps: [twoAmPager, stopA, leftovers, reverseLeftovers],
  },
  {
    id: "hit-limit",
    title: "The billing ceiling was hit",
    blurb: "The run hit $25 and 40 actions. The user still wants the environment. What do you do?",
    setup: "hit-ceiling",
    steps: [hitLimit],
  },
  {
    id: "ide-cli",
    title: "Create a token in the IDE / CLI",
    blurb:
      "Same create, from code. POST /v2/credentials, doctl, MCP, or Terraform. Give only the new token to the agent.",
    steps: [cliCode, cliRun, cliExport, cliSurfaces],
  },
  {
    id: "managed",
    title: "Same pager, Managed Agents",
    blurb: "Same 2 a.m. incident. DigitalOcean made the token. You did not.",
    setup: "hit-ceiling",
    steps: [managed],
  },
  {
    id: "control-plane",
    title: "Control plane",
    blurb:
      "Suggested ceilings, utilization, billing reconciliation, owner offboarding, OIDC, and intent-bound actions.",
    steps: [suggested, utilization, reconcile, offboard, oidc, intentBound],
  },
  {
    id: "complete",
    title: "Complete walkthrough",
    blurb:
      "The full product, in order: ship a task, IDE / MCP / Terraform, 2 a.m., the $ billing ceiling, reverse leftovers, Managed Agents, then the control plane. You click Next or Exit.",
    steps: [
      savedToken,
      createToken,
      billingCeiling,
      cliCode,
      cliRun,
      cliExport,
      cliSurfaces,
      twoAmPager,
      hitLimit,
      stopA,
      leftovers,
      reverseLeftovers,
      managed,
      suggested,
      utilization,
      reconcile,
      offboard,
      oidc,
      intentBound,
    ],
  },
];

export function scenarioById(id: string | null): Scenario | undefined {
  return SCENARIOS.find((item) => item.id === id);
}
