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
        <div className="stat-label">LEADERS</div>
        <div className="stat-value">{stats.leaders.length > 0 ? stats.leaders.join(", ") : "—"}</div>
      </div>

      <div className="stats-row">
        <div className="stat-label">LOSERS</div>
        <div className="stat-value warn">{stats.losers.length > 0 ? stats.losers.join(", ") : "—"}</div>
      </div>

      <button type="button" className="pixel-button manage-button" onClick={onManage}>
        MANAGE PLAYERS
      </button>
    </div>
  );
}
