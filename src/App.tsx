import { useState, useRef, useEffect } from "react";
import "./App.css";
import { PasswordGate } from "./components/PasswordGate";
import { ScoreTable } from "./components/ScoreTable";
import { StatsPanel } from "./components/StatsPanel";
import { CookieAward } from "./components/CookieAward";
import { CharacterSelect } from "./components/CharacterSelect";
import { NavigationBar } from "./components/NavigationBar";
import { VEBoard } from "./components/VEBoard";
import { PixelCookie } from "./components/PixelCookie";
import { useBoard } from "./hooks/useBoard";
import { cookiesApi, type CookiesApi } from "./data/cookiesApi";

export default function App({ api = cookiesApi }: { api?: CookiesApi }) {
  const { board, loading, error, award, removeCookie } = useBoard(api);
  const [celebrating, setCelebrating] = useState(false);
  const [celebratingName, setCelebratingName] = useState<string>();
  const [view, setView] = useState<"board" | "players" | "ve">("board");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleAward(memberId: string) {
    const member = board.find((m) => m.id === memberId);
    setCelebratingName(member?.name);
    setCelebrating(true);
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set new timeout to dismiss after ~4.5s (matches animation duration)
    timeoutRef.current = setTimeout(() => {
      setCelebrating(false);
    }, 4500);
    await award(memberId);
  }

  const cookieCounts: Record<string, number> = {};
  board.forEach((member) => {
    cookieCounts[member.id] = member.cookieCount;
  });

  return (
    <PasswordGate>
      <div className="crt">
        <div className="shell">
          <div className="screen">
            <h1>
              <PixelCookie size={22} />
              VE COOKIE BOARD
            </h1>
            <NavigationBar active={view} onNavigate={setView} />
            {error && <p role="alert" className="error-text">{error}</p>}
            {loading ? (
              <p className="arcade-title">LOADING…</p>
            ) : view === "board" ? (
              <div className="layout">
                <div className="box">
                  <div className="box-label">ROSTER</div>
                  <div className="roster">
                    <ScoreTable board={board} onAward={handleAward} />
                  </div>
                </div>
                <div>
                  <StatsPanel board={board} onManage={() => setView("players")} />
                </div>
              </div>
            ) : view === "players" ? (
              <CharacterSelect
                inline
                open
                onClose={() => setView("board")}
                members={board}
                onAdd={(name, avatarKey) => api.addMember(name, avatarKey).then(() => {})}
                onRemove={(id) => api.removeMember(id)}
                cookieCounts={cookieCounts}
                onAward={award}
                onRemoveCookie={removeCookie}
                onUpdateMember={(id, fields) => api.updateMember(id, fields)}
              />
            ) : (
              <VEBoard />
            )}
            <CookieAward show={celebrating} memberName={celebratingName} onDone={() => setCelebrating(false)} />
          </div>
        </div>
      </div>
    </PasswordGate>
  );
}
