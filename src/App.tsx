import { StoreProvider, useStore } from "./store/store";
import { Layout } from "./components/Layout";
import { Platform } from "./screens/Platform";
import { Console } from "./screens/Console";
import { Droplets } from "./screens/Droplets";
import { ManagedAgents } from "./screens/ManagedAgents";
import { CliIde } from "./screens/CliIde";
import { Scenarios } from "./screens/Scenarios";
import { Vision } from "./screens/Vision";
import { Limits } from "./screens/Limits";
import { Shutoff } from "./screens/Shutoff";
import { Decisions } from "./screens/Decisions";
import { Suggested } from "./screens/Suggested";
import { Offboard } from "./screens/Offboard";
import { Oidc } from "./screens/Oidc";
import { Intent } from "./screens/Intent";

function Screen() {
  const { state } = useStore();
  switch (state.screen) {
    case "scenarios":
      return <Scenarios />;
    case "platform":
    case "orchestrator":
    case "secret-manager":
    case "harness":
    case "brief":
      return <Platform />;
    case "console":
    case "run-inspector":
      return <Console />;
    case "cli":
      return <CliIde />;
    case "droplets":
      return <Droplets />;
    case "managed-agents":
      return <ManagedAgents />;
    case "vision":
      return <Vision />;
    case "limits":
      return <Limits />;
    case "shutoff":
      return <Shutoff />;
    case "decisions":
      return <Decisions />;
    case "suggested":
      return <Suggested />;
    case "offboard":
      return <Offboard />;
    case "oidc":
      return <Oidc />;
    case "intent":
      return <Intent />;
  }
}

export default function App() {
  return (
    <StoreProvider>
      <Layout>
        <Screen />
      </Layout>
    </StoreProvider>
  );
}
