import { StoreProvider, useStore } from "./store/store";
import { Layout } from "./components/Layout";
import { Platform } from "./screens/Platform";
import { Console } from "./screens/Console";
import { Droplets } from "./screens/Droplets";
import { ManagedAgents } from "./screens/ManagedAgents";
import { CliIde } from "./screens/CliIde";
import { Scenarios } from "./screens/Scenarios";

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
