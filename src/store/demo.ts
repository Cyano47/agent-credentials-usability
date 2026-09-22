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
  body: "A customer asked for a staging box. The main token stays here. Do not give it to the agent.",
  tryThis: "Leave it hidden.",
  target: "secret-manager",
  screen: "platform",
  placement: "right",
};

const createToken: WalkStep = {
  title: "1. Give the task its own credential",
  body: "Ten minutes. Create, read, and delete basic Droplets and volumes. Call inference. Never broader than the parent. If the task takes longer, issue a new credential.",
  tryThis: "Create a task token, then give it to the agent.",
  target: "derive-task",
  screen: "platform",
  placement: "left",
};

const limits: WalkStep = {
  title: "2. These are the limits",
  body: "$25 spend, 40 actions, 3 live resources, 500,000 inference tokens. All four stop the next call on every surface. The agent cannot raise these.",
  tryThis: "Leave these numbers.",
  target: "billing-ceiling",
  screen: "limits",
  select: CHILD_A.id,
  placement: "left",
};

const instanceClass: WalkStep = {
  title: "Basic Droplets only",
  body: "droplet:create:basic. A GPU Droplet is refused. Combined with the $25 spend cap, rate and total are both bounded.",
  target: "limits-class",
  screen: "limits",
  placement: "right",
};

const hitLimit: WalkStep = {
  title: "The spend and action limits were hit",
  body: "$25 of $25, 40 of 40 actions. The run pauses. The user still wants the environment. End the task or create a new credential from the main token. The agent cannot raise its own limits.",
  tryThis: "Do not click “Let the agent raise its limits.”",
  target: "limits-hit",
  screen: "limits",
  select: CHILD_A.id,
  apply: "hit-ceiling",
  placement: "bottom",
};

const twoAmPager: WalkStep = {
  title: "It is 2 a.m.",
  body: "Customer A’s agent is looping. Customer B must keep running.",
  tryThis: "Look at the pager, then shut off one task.",
  target: "pager",
  screen: "shutoff",
  select: CHILD_A.id,
  pager: true,
  placement: "bottom",
};

const stopA: WalkStep = {
  title: "3. Shut off this task. Leave B up.",
  body: "One call. The next request is refused on the API, MCP, and CLI. Do not shut off the parent.",
  tryThis: "Click Revoke token on task-8f21c. Then look at customer B.",
  target: "revoke-task",
  screen: "shutoff",
  select: CHILD_A.id,
  pager: true,
  placement: "right",
};

const leftovers: WalkStep = {
  title: "5. Reverse leftovers",
  body: "The Droplets it already created are still running and still billing. Reverse them in one click, or destroy one at a time. Each leftover has a one-hour lease.",
  tryThis: "Click Reverse leftovers. Leave customer B alone.",
  target: "reverse-leftovers",
  screen: "droplets",
  apply: "revoke-a",
  pager: true,
  placement: "bottom",
};

const leases: WalkStep = {
  title: "Leases stop leftover spend",
  body: "Every resource created by a task credential gets a one-hour lease. When the lease ends, the platform reverses it unless you extend.",
  target: "leases",
  screen: "droplets",
  placement: "left",
};

const decisions: WalkStep = {
  title: "4. What did this agent do?",
  body: "Human → agent → task, the access it used, permitted or refused, and how much of the limit was left. A silent path would show up as a missing record.",
  tryThis: "Filter to limit reached.",
  target: "decision-record",
  screen: "decisions",
  select: CHILD_A.id,
  placement: "bottom",
};

const suggested: WalkStep = {
  title: "6. Suggested ceilings",
  body: "The platform recommends $18 spend and 36 actions from the last 12 coding-agent-prod runs. You can still type your own.",
  tryThis: "Leave the suggested numbers.",
  target: "suggested-defaults",
  screen: "suggested",
  placement: "left",
};

const utilization: WalkStep = {
  title: "Utilization by agent",
  body: "Median run used 61% of its spend ceiling. Three of 48 runs hit a ceiling. Those three were retry loops.",
  target: "utilization",
  screen: "suggested",
  placement: "right",
};

const offboard: WalkStep = {
  title: "7. Maya left",
  body: "Every credential she owned is re-attributed. Limits and shutoff stay in place. No standing token walks out with her.",
  tryThis: "Click Maya left.",
  target: "offboard",
  screen: "offboard",
  apply: "offboard",
  placement: "left",
};

const oidc: WalkStep = {
  title: "8. No standing secret",
  body: "CI exchanges OIDC for a task credential. The long-lived token is only a derivation root. It never enters the pipeline.",
  tryThis: "Exchange OIDC for a task credential.",
  target: "oidc",
  screen: "oidc",
  placement: "left",
};

const intent: WalkStep = {
  title: "9. Intent-bound actions",
  body: "This run may create staging-web-1. Updating preview-api-1 is refused. Authority is the operation, not the category.",
  tryThis: "Try updating preview-api-1.",
  target: "intent-bound",
  screen: "intent",
  placement: "left",
};

const managed: WalkStep = {
  title: "Same limits, Managed Agents",
  body: "DigitalOcean issued the credential. You did not. Spend, actions, live resources, and inference tokens all stop here.",
  tryThis: "Approve a new token or end the task.",
  target: "managed-run",
  screen: "managed-agents",
  pager: true,
  placement: "left",
};

const cliCode: WalkStep = {
  title: "Same credential, from the IDE",
  body: "POST /v2/credentials with spend, actions, live resources, and inference tokens. The main token never leaves the vault.",
  target: "cli-derive",
  screen: "cli",
  placement: "bottom",
};

const cliRun: WalkStep = {
  title: "Run the create",
  body: "You see the secret once. Inspect the scopes that came back. The agent never gets the main token.",
  tryThis: "Click Run POST /v2/credentials.",
  target: "cli-run",
  screen: "cli",
  placement: "top",
};

const cliExport: WalkStep = {
  title: "Give only the new token to the agent",
  body: "Export the child. MCP and Terraform use the same derive, revoke, reverse, and decisions.",
  tryThis: "Export child to agent env.",
  target: "cli-export",
  screen: "cli",
  placement: "top",
};

export const SCENARIOS: Scenario[] = [
  {
    id: "ship-a-task",
    title: "1. Task credential",
    blurb: "Issue a ten-minute credential for one staging-box task. The main token stays saved.",
    steps: [savedToken, createToken],
  },
  {
    id: "hit-limit",
    title: "2. Limits",
    blurb: "$25 spend, 40 actions, 3 live resources, basic Droplets. The agent cannot raise this.",
    setup: "hit-ceiling",
    steps: [limits, instanceClass, hitLimit],
  },
  {
    id: "two-am",
    title: "3. Shut off",
    blurb: "Stop customer A in one call. Leave B up. Then reverse leftovers.",
    setup: "hit-ceiling",
    steps: [twoAmPager, stopA, leftovers],
  },
  {
    id: "decisions",
    title: "4. Decision record",
    blurb: "Query what the agent did, in order, with the access it used and what was refused.",
    steps: [decisions],
  },
  {
    id: "reverse",
    title: "5. Reverse leftovers",
    blurb: "One click reverses leftover Droplets and Volumes. Each leftover has a one-hour lease.",
    setup: "revoke-a",
    steps: [leftovers, leases],
  },
  {
    id: "suggested",
    title: "6. Suggested ceilings",
    blurb: "The platform recommends $18 and 36 actions from the last 12 runs. Utilization is visible.",
    steps: [suggested, utilization],
  },
  {
    id: "offboard",
    title: "7. Offboarding",
    blurb: "Maya left. Credentials re-attribute. Limits stay. No standing token walks out.",
    steps: [offboard],
  },
  {
    id: "oidc",
    title: "8. No standing secret",
    blurb: "CI exchanges OIDC for a task credential. The parent never enters the pipeline.",
    steps: [oidc],
  },
  {
    id: "intent",
    title: "9. Intent-bound",
    blurb: "Authority is the operation, not the category. Updating preview-api-1 is refused.",
    steps: [intent],
  },
  {
    id: "ide-cli",
    title: "Same credential in the IDE / CLI",
    blurb: "POST /v2/credentials, doctl, MCP, or Terraform. One shutoff stops every surface.",
    steps: [cliCode, cliRun, cliExport],
  },
  {
    id: "managed",
    title: "Same pager, Managed Agents",
    blurb: "DigitalOcean made the token. Spend, actions, resources, and inference all stop here.",
    setup: "hit-ceiling",
    steps: [managed],
  },
  {
    id: "complete",
    title: "Complete walkthrough",
    blurb:
      "The entire product, in order: task credential, limits, shut off, decision record, reverse leftovers, suggested ceilings, offboarding, OIDC, and intent-bound. You click Next or Exit.",
    steps: [
      savedToken,
      createToken,
      limits,
      instanceClass,
      cliCode,
      cliRun,
      twoAmPager,
      hitLimit,
      stopA,
      leftovers,
      leases,
      decisions,
      suggested,
      utilization,
      offboard,
      oidc,
      intent,
      managed,
    ],
  },
];

export function scenarioById(id: string | null): Scenario | undefined {
  return SCENARIOS.find((item) => item.id === id);
}
