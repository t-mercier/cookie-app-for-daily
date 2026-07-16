import type { BoardMember } from "../types";
import { computeStats } from "../logic/stats";
import { Sprite } from "./Sprite";

export function StatsPanel({
  board,
}: {
  board: BoardMember[];
}) {
  const stats = computeStats(board);

  return (
    <div className="stats-panel" data-testid="stats-panel">
      <div className="box">
        <div className="box-label">STATS</div>

        <div className="stats-section">
          <div className="section-title">RECORDS</div>
          <div className="stats-row">
            <div className="stat-value leaders">
              {stats.leaders.length > 0 ? (
                stats.leaders.map((m) => (
                  <span key={m.id} title={m.name} className="leader-with-star">
                    <Sprite avatarKey={m.avatarKey} size={22} />
                    <span className="gold-star">★</span>
                  </span>
                ))
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>

        <div className="stats-section">
          <div className="section-title warn">NEEDS COOKIES</div>
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
        </div>
      </div>
    </div>
  );
}
