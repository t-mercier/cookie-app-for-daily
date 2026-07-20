import { useState, useEffect } from "react";
import "./App.css";
import { PasswordGate } from "./components/PasswordGate";
import { ScoreTable } from "./components/ScoreTable";
import { StatsPanel } from "./components/StatsPanel";
import { CookieAward } from "./components/CookieAward";
import { CharacterSelect } from "./components/CharacterSelect";
import { NavigationBar } from "./components/NavigationBar";
import { VEBoard } from "./components/VEBoard";
import { ResetConfirm } from "./components/ResetConfirm";
import { PixelCookie } from "./components/PixelCookie";
import { useBoard } from "./hooks/useBoard";
import { computeStats } from "./logic/stats";
import { cookiesApi, type CookiesApi } from "./data/cookiesApi";
import { canAwardToday } from "./logic/awardRule";

export default function App({ api = cookiesApi }: { api?: CookiesApi }) {
  const { board, loading, error, award, removeCookie, reload } = useBoard(api);
  const [lastAward, setLastAward] = useState<{ name: string; key: number } | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [view, setView] = useState<"board" | "players" | "ve">("board");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notice]);

  async function handleAward(memberId: string) {
    const member = board.find((m) => m.id === memberId);
    if (!member) return;

    try {
      const latest = await api.getLatestAwardAt();
      const check = canAwardToday(new Date(), latest);
      if (!check.allowed) {
        const message =
          check.reason === "weekend"
            ? "NO COOKIES ON WEEKENDS!"
            : "TODAY'S COOKIE IS ALREADY GIVEN!";
        setNotice(message);
        return;
      }
    } catch (caught) {
      const errorMsg = caught instanceof Error ? caught.message : String(caught);
      setNotice(`ERROR: ${errorMsg}`);
      return;
    }

    setLastAward({ name: member.name, key: (lastAward?.key ?? 0) + 1 });
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
              <>
                <div className="top-banner box">
                  <div className="idle-text">WHO LED THE DAILY TODAY? PICK A HERO! <span className="blink-arrow">▼</span></div>
                </div>
                {notice && (
                  <div className="box" data-testid="award-notice" style={{ color: "var(--red)", marginTop: 12, marginBottom: 12, textAlign: "center" }}>
                    {notice}
                  </div>
                )}
                <div className="layout">
                  <div className="box">
                    <div className="box-label">ROSTER</div>
                    <div className="roster">
                      <ScoreTable
                        board={board}
                        onAward={handleAward}
                        onManage={() => setView("players")}
                        needyIds={computeStats(board).needsCookies.map((m) => m.id)}
                      />
                    </div>
                  </div>
                  <div>
                    <StatsPanel board={board} onReset={() => setResetOpen(true)} />
                    {lastAward && <CookieAward key={lastAward.key} memberName={lastAward.name} />}
                  </div>
                </div>
              </>
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
          </div>
        </div>
      </div>
      <ResetConfirm
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={async () => {
          await api.resetAllCookies();
          await reload();
          setResetOpen(false);
        }}
      />
    </PasswordGate>
  );
}
