import type { BoardMember } from "../types";
import { computeStats } from "../logic/stats";
import { Sprite } from "./Sprite";

export function StatsPanel({
  board,
  onManage,
}: {
  board: BoardMember[];
  onManage: () => void;
}) {
  const stats = computeStats(board);

  return (
    <div className="stats-panel" data-testid="stats-panel">
      <div className="box">
        <div className="box-label">RECORDS</div>
        <div className="stats-row">
          <div className="stat-label" style={{ color: "var(--gold)", fontWeight: 700 }}>★</div>
          <div className="stat-value">
            {stats.leaders.length > 0 ? (
              stats.leaders.map((m) => (
                <span key={m.id} title={m.name}>
                  <Sprite avatarKey={m.avatarKey} size={22} />
                </span>
              ))
            ) : (
              "—"
            )}
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-label warn" style={{ color: "var(--red)" }}>NEEDS COOKIES</div>
        <div className="stats-row">
          <div className="stat-value warn">
            {stats.needsCookies.length > 0 ? (
              stats.needsCookies.map((m) => (
                <span key={m.id} title={m.name}>
                  <Sprite avatarKey={m.avatarKey} size={22} />
                </span>
              ))
            ) : (
              "—"
            )}
          </div>
        </div>
        <button type="button" className="manage-button" onClick={onManage}>
          ► MANAGE
        </button>
      </div>
    </div>
  );
}
