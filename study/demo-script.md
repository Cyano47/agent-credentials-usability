# Demo: pick a scenario, then click Next

Reload the prototype. Open **Scenarios**. Click a card. You click **Next** or **Exit**. Do not auto-advance.

This demo is the full product, not a GA slice. Every surface has a $ spend ceiling plus quantity ceilings. Cleanup, suggested defaults, offboarding, OIDC, MCP, and Terraform are in the walkthrough.

| Scenario | Land this |
| --- | --- |
| Ship a task | Staging box. Main token stays saved. Only a 10-minute token goes to the agent. Billing ceiling is $25 / 40 / 3 / 500k. |
| 2 a.m. loop | Stop customer A. Leave B up. Then reverse what it created. |
| The billing ceiling was hit | $25 spend and 40 actions. User still wants the environment. Agent cannot raise the billing ceiling. |
| Create a token in the IDE / CLI | `POST /v2/credentials` with ceilings. Same call on doctl, MCP, and Terraform. Secret once. |
| Same pager, Managed Agents | DigitalOcean made the token. Same $ ceiling on the run. |
| Control plane | Suggested ceilings, utilization, billing reconciliation, owner offboarding, OIDC, intent-bound actions. |
| Complete walkthrough | All of the above, in order. You click Next or Exit. |
