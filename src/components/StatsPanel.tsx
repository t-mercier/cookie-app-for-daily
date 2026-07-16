import type { BoardMember } from "../types";
import { computeStats } from "../logic/stats";

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
        <div className="stat-label">TOTAL</div>
        <div className="stat-value">{stats.total} 🍪</div>
      </div>

      <div className="stats-row">
        <div className="stat-label">LEADER</div>
        <div className="stat-value">{stats.leader || "—"}</div>
      </div>

      <div className="stats-row">
        <div className="stat-label">NEEDS COOKIES</div>
        <div className="stat-value warn">{stats.laggard || "—"}</div>
      </div>

      <button type="button" className="pixel-button manage-button" onClick={onManage}>
        MANAGE PLAYERS
      </button>
    </div>
  );
}
