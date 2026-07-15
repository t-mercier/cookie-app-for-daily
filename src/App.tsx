import { useState } from "react";
import { PasswordGate } from "./components/PasswordGate";
import { Board } from "./components/Board";
import { CookieAward } from "./components/CookieAward";
import { ManageMembers } from "./components/ManageMembers";
import { useBoard } from "./hooks/useBoard";
import { cookiesApi, type CookiesApi } from "./data/cookiesApi";

export default function App({ api = cookiesApi }: { api?: CookiesApi }) {
  const { board, loading, error, award } = useBoard(api);
  const [celebrating, setCelebrating] = useState(false);

  async function handleAward(memberId: string) {
    setCelebrating(true);
    await award(memberId);
  }

  return (
    <PasswordGate>
      <main>
        <h1>VE Cookie Board</h1>
        {error && <p role="alert">{error}</p>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <Board board={board} onAward={handleAward} />
        )}
        <CookieAward show={celebrating} onDone={() => setCelebrating(false)} />
        <ManageMembers
          members={board}
          onAdd={(name, avatarKey) => void api.addMember(name, avatarKey)}
          onRemove={(id) => void api.removeMember(id)}
        />
      </main>
    </PasswordGate>
  );
}
