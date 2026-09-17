import { PARENT_CREDENTIAL } from "../store/seed";
import { useStore } from "../store/store";

export function SecretManager() {
  const { state, dispatch } = useStore();
  const parent = state.credentials.find((c) => c.id === PARENT_CREDENTIAL.id);
  return (
    <div className="card">
      <h2>Secret manager</h2>
      <p className="lede">
        Assumed. Only the parent lives here. Vault / cloud SM is out of scope. We only need to see that
        the parent is stored and that people do or do not copy it into the harness.
      </p>
      {state.secrets.map((secret) => (
        <div key={secret.id} className="card">
          <h3>{secret.name}</h3>
          <p className="small">{secret.note}</p>
          <p>
            Agent <code>{parent?.agent}</code> · scopes {parent?.scopes.length} · expires{" "}
            {parent?.expiresAt}
          </p>
          {parent?.secretRevealed ? (
            <div className="secret">{parent.secret}</div>
          ) : (
            <button className="btn secondary" onClick={() => dispatch({ type: "REVEAL_PARENT" })}>
              Reveal parent secret
            </button>
          )}
          <div className="actions">
            <button
              className="btn danger"
              onClick={() => {
                const idle = state.runs.find((r) => r.mode === "self-hosted" && r.status === "idle")
                  ?? state.runs.find((r) => r.mode === "self-hosted");
                if (idle && parent) dispatch({ type: "INJECT", credentialId: parent.id, runId: idle.id });
                dispatch({ type: "SET_SCREEN", screen: "harness" });
              }}
            >
              Copy parent into harness
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
