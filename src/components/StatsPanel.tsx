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
    <div className="stats-panel pixel-panel" data-testid="stats-panel">
      <div className="stats-row">
        <div className="stat-label">LEADERS</div>
        <div className="stat-value">
          {stats.leaders.length > 0 ? (
            stats.leaders.map((m) => (
              <span key={m.id} title={m.name}>
                <Sprite avatarKey={m.avatarKey} size={28} />
              </span>
            ))
          ) : (
            "—"
          )}
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-label warn">NEEDS COOKIES</div>
        <div className="stat-value warn">
          {stats.needsCookies.length > 0 ? (
            stats.needsCookies.map((m) => (
              <span key={m.id} title={m.name}>
                <Sprite avatarKey={m.avatarKey} size={28} />
              </span>
            ))
          ) : (
            "—"
          )}
        </div>
      </div>

      <button type="button" className="pixel-button manage-button" onClick={onManage}>
        MANAGE PLAYERS
      </button>
    </div>
  );
}
