# Demo: pick a scenario, then click Next

Reload `http://localhost:5173`. Open **Scenarios**. Click a card. You click **Next** or **Exit**. Do not auto-advance.

| Scenario | Land this |
| --- | --- |
| Ship a task | Staging box. Main token stays saved. Only a 10-minute token goes to the agent. |
| 2 a.m. loop | Stop customer A. Leave B up. Then say what it created and what still costs. |
| The billing ceiling was hit | 40 actions / 3 resources / 500k tokens. User still wants the environment. Agent cannot raise the billing ceiling. |
| Create a token in the IDE / CLI | `POST /v2/credentials`. Secret once. Agent never sees the main token. |
| Same pager, Managed Agents | DigitalOcean made the token. You did not. |
| Complete walkthrough | All of the above, in order. You click Next or Exit. |
