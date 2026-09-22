export type TenantId = "acme-user-a" | "acme-user-b";

export type Outcome =
  | "permitted"
  | "scope_denied"
  | "expired"
  | "revoked"
  | "ceiling_exhausted";

export type CredentialStatus = "active" | "expired" | "revoked";

export type ExhaustVariant = "pause-and-approve" | "hard-terminate";

export type RevokeCopyVariant = "revoke-credential" | "stop-new-requests";

export type ScreenId =
  | "platform"
  | "cli"
  | "console"
  | "droplets"
  | "managed-agents"
  | "brief"
  | "secret-manager"
  | "orchestrator"
  | "harness"
  | "run-inspector"
  | "scenarios"
  | "vision"
  | "limits"
  | "shutoff"
  | "decisions"
  | "suggested"
  | "offboard"
  | "oidc"
  | "intent";

export type RunStatus =
  | "idle"
  | "running"
  | "paused"
  | "ceiling_exhausted"
  | "completed"
  | "terminated"
  | "revoked";

export type ResourceType = "droplet" | "volume" | "spaces";

export interface CeilingTriple {
  actions: number;
  resources: number;
  inference_tokens: number;
  spend_usd: number;
}

export interface CeilingProgress {
  actions: { used: number; max: number };
  resources: { used: number; max: number };
  inference_tokens: { used: number; max: number };
  spend_usd: { used: number; max: number };
}

export interface Credential {
  id: string;
  parent: string;
  agent: string;
  label: string;
  tenantId: TenantId | null;
  scopes: string[];
  requestedScopes: string[];
  expiresAt: string;
  expiresInSeconds: number;
  status: CredentialStatus;
  ceilings: CeilingTriple | null;
  depth: number;
  lastActivity: string;
  createdAt: string;
  kind: "parent" | "child";
  secret: string;
  secretRevealed: boolean;
}

export interface Decision {
  id: string;
  credentialId: string;
  tenantId: TenantId;
  timestamp: string;
  action: string;
  scope: string;
  resourceId?: string;
  resourceName?: string;
  outcome: Outcome;
  agent: string;
  task: string;
  parent: string;
  ceilings: CeilingProgress | null;
  detail: string;
}

export interface ManagedResource {
  id: string;
  type: ResourceType;
  name: string;
  tenantId: TenantId;
  credentialId: string;
  createdByDecisionId: string;
  stillBilling: boolean;
  hourlyUsd: number;
  region: string;
  status: "running" | "deleted";
  size: string;
}

export interface AgentRun {
  id: string;
  tenantId: TenantId;
  label: string;
  mode: "self-hosted" | "managed";
  status: RunStatus;
  injectedCredentialId: string | null;
  parentLeaked: boolean;
  stepIndex: number;
  ceilings: CeilingTriple | null;
  remaining: CeilingTriple | null;
  taskPrompt: string;
}

export interface SecretEntry {
  id: string;
  name: string;
  credentialId: string;
  kind: "parent" | "child";
  note: string;
}

export interface ObservationFlags {
  parentShownInHarness: boolean;
  childMintedOnceReused: boolean;
  pickedLongExpiry: boolean;
  triedToExtendChild: boolean;
  triedToRaiseCeilingFromAgent: boolean;
  revokedWithoutOpeningResources: boolean;
  treatedRevokeAsUndo: boolean;
  treatedCeilingAsSpend: boolean;
  usedDecisionRecord: boolean;
  wentToBillingFirst: boolean;
  derivedPerTask: boolean;
  hesitatedOnRevoke: boolean;
}

export interface StudyState {
  nowIso: string;
  exhaustVariant: ExhaustVariant;
  revokeCopyVariant: RevokeCopyVariant;
  screen: ScreenId;
  selectedCredentialId: string | null;
  selectedDecisionFilter: "all" | Outcome;
  lastDerivedSecret: { credentialId: string; secret: string } | null;
  toast: string | null;
  pagerActive: boolean;
  observations: ObservationFlags;
  credentials: Credential[];
  decisions: Decision[];
  resources: ManagedResource[];
  runs: AgentRun[];
  secrets: SecretEntry[];
  eventLog: string[];
  demoStep: number;
  walkthroughOpen: boolean;
  activeScenarioId: string | null;
  ownerEmail: string;
  ownerOffboarded: boolean;
}
