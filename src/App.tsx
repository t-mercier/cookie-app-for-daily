import { useState } from "react";
import "./App.css";
import { PasswordGate } from "./components/PasswordGate";
import { ScoreTable } from "./components/ScoreTable";
import { CookieAward } from "./components/CookieAward";
import { CharacterSelect } from "./components/CharacterSelect";
import { useBoard } from "./hooks/useBoard";
import { cookiesApi, type CookiesApi } from "./data/cookiesApi";

export default function App({ api = cookiesApi }: { api?: CookiesApi }) {
  const { board, loading, error, award } = useBoard(api);
  const [celebrating, setCelebrating] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  async function handleAward(memberId: string) {
    setCelebrating(true);
    await award(memberId);
  }

  return (
    <PasswordGate>
      <div className="crt">
        <h1 className="arcade-title">VE COOKIE BOARD</h1>
        {error && <p role="alert" className="error-text">{error}</p>}
        {loading ? (
          <p className="arcade-title">LOADING…</p>
        ) : (
          <ScoreTable board={board} onAward={handleAward} />
        )}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button type="button" className="pixel-button" onClick={() => setSelectOpen(true)}>
            + ADD PLAYER
          </button>
        </div>
        <CookieAward show={celebrating} onDone={() => setCelebrating(false)} />
        <CharacterSelect
          open={selectOpen}
          onClose={() => setSelectOpen(false)}
          members={board}
          onAdd={(name, avatarKey) => api.addMember(name, avatarKey).then(() => {})}
          onRemove={(id) => api.removeMember(id)}
        />
      </div>
    </PasswordGate>
  );
}
