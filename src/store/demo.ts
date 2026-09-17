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
  apply?: "revoke-a" | "hit-ceiling";
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
  body: "Revoke does not delete Droplets or Volumes. They are still there and still billing. Cleanup is your job.",
  tryThis: "Destroy them, or leave them and watch the hourly cost.",
  target: "leftover-droplets",
  screen: "droplets",
  apply: "revoke-a",
  pager: true,
  placement: "bottom",
};

const hitLimit: WalkStep = {
  title: "The run hit a limit",
  body: "40 actions. The run pauses. The user still wants the environment. End the task or create a new token from the main token. The agent cannot raise the limit itself.",
  tryThis: "Do not click “Let the agent raise the limit.”",
  target: "ceiling-banner",
  screen: "console",
  select: CHILD_A.id,
  apply: "hit-ceiling",
  pager: true,
  placement: "bottom",
};

const managed: WalkStep = {
  title: "Same pager. You did not make this token.",
  body: "DigitalOcean created the token for this Managed Agents run. Limits are on the run. Same incident as 2 a.m.",
  tryThis: "Approve a new token or end the task.",
  target: "managed-run",
  screen: "managed-agents",
  pager: true,
  placement: "left",
};

const cliCode: WalkStep = {
  title: "Same token, from the IDE",
  body: "This is not console-only. orchestrator.ts calls POST /v2/credentials. The main token never leaves the vault.",
  target: "cli-derive",
  screen: "cli",
  placement: "bottom",
};

const cliRun: WalkStep = {
  title: "Run the create",
  body: "You see the secret once. The agent never gets the main token.",
  tryThis: "Click Run POST /v2/credentials.",
  target: "cli-run",
  screen: "cli",
  placement: "top",
};

const cliExport: WalkStep = {
  title: "Give only the new token to the agent",
  body: "Export the child, then let the agent Create Droplet, Create Volume, and Call inference. Open agent.ts or doctl if you want to see the same call.",
  tryThis: "Export child to agent env, then Agent calls the API.",
  target: "cli-export",
  screen: "cli",
  placement: "top",
};

export const SCENARIOS: Scenario[] = [
  {
    id: "ship-a-task",
    title: "Ship a task",
    blurb:
      "A customer asked your coding agent to stand up a staging box. The main token is already saved. Get the agent running without giving it more access than the task needs.",
    steps: [savedToken, createToken],
  },
  {
    id: "two-am",
    title: "2 a.m. loop",
    blurb:
      "Pager: customer A’s agent is looping Create Droplet, Create Volume, and Call inference. Stop that agent. Do not take customer B down. Then say what it created and what it still costs.",
    setup: "hit-ceiling",
    steps: [twoAmPager, stopA, leftovers],
  },
  {
    id: "hit-limit",
    title: "The agent hit a limit",
    blurb: "The run returned a limit after 40 actions. The user still wants the environment. What do you do?",
    setup: "hit-ceiling",
    steps: [hitLimit],
  },
  {
    id: "ide-cli",
    title: "Create a token in the IDE / CLI",
    blurb:
      "Same create, from code. POST /v2/credentials or doctl. Give only the new token to the agent.",
    steps: [cliCode, cliRun, cliExport],
  },
  {
    id: "managed",
    title: "Same pager, Managed Agents",
    blurb: "Same 2 a.m. incident. DigitalOcean made the token. You did not.",
    setup: "hit-ceiling",
    steps: [managed],
  },
  {
    id: "complete",
    title: "Complete walkthrough",
    blurb:
      "All of the jobs, in order: ship a task, create the token from the IDE, 2 a.m. loop, the limit, then Managed Agents. You click Next or Exit.",
    steps: [
      savedToken,
      createToken,
      cliCode,
      cliRun,
      cliExport,
      twoAmPager,
      hitLimit,
      stopA,
      leftovers,
      managed,
    ],
  },
];

export function scenarioById(id: string | null): Scenario | undefined {
  return SCENARIOS.find((item) => item.id === id);
}
