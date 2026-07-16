import { useState, useRef, useEffect } from "react";
import "./App.css";
import { PasswordGate } from "./components/PasswordGate";
import { ScoreTable } from "./components/ScoreTable";
import { StatsPanel } from "./components/StatsPanel";
import { CookieAward } from "./components/CookieAward";
import { CharacterSelect } from "./components/CharacterSelect";
import { useBoard } from "./hooks/useBoard";
import { cookiesApi, type CookiesApi } from "./data/cookiesApi";

export default function App({ api = cookiesApi }: { api?: CookiesApi }) {
  const { board, loading, error, award, removeCookie } = useBoard(api);
  const [celebrating, setCelebrating] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleAward(memberId: string) {
    setCelebrating(true);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set new timeout to dismiss after 3.5s
    timeoutRef.current = setTimeout(() => {
      setCelebrating(false);
    }, 3500);
    await award(memberId);
  }

  const cookieCounts: Record<string, number> = {};
  board.forEach((member) => {
    cookieCounts[member.id] = member.cookieCount;
  });

  return (
    <PasswordGate>
      <div className="crt">
        <h1 className="arcade-title">VE COOKIE BOARD</h1>
        {error && <p role="alert" className="error-text">{error}</p>}
        {loading ? (
          <p className="arcade-title">LOADING…</p>
        ) : (
          <div className="board-layout">
            <ScoreTable board={board} onAward={handleAward} />
            <StatsPanel board={board} onManage={() => setSelectOpen(true)} />
          </div>
        )}
        <CookieAward show={celebrating} onDone={() => setCelebrating(false)} />
        <CharacterSelect
          open={selectOpen}
          onClose={() => setSelectOpen(false)}
          members={board}
          onAdd={(name, avatarKey) => api.addMember(name, avatarKey).then(() => {})}
          onRemove={(id) => api.removeMember(id)}
          cookieCounts={cookieCounts}
          onAward={award}
          onRemoveCookie={removeCookie}
          onUpdateMember={(id, fields) => api.updateMember(id, fields)}
        />
      </div>
    </PasswordGate>
  );
}
