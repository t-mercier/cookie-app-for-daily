import type { BoardMember } from "../types";
import { ScoreRow } from "./ScoreRow";

export function ScoreTable({
  board,
  onAward,
  onManage,
  needyIds,
}: {
  board: BoardMember[];
  onAward: (id: string) => void;
  onManage?: () => void;
  needyIds?: string[];
}) {
  const needySet = new Set(needyIds || []);

  return (
    <div className="score-table">
      {board.map((member) => (
        <ScoreRow
          key={member.id}
          member={member}
          onAward={onAward}
          isNeedy={needySet.has(member.id)}
        />
      ))}
      {onManage && (
        <button
          type="button"
          className="manage-button"
          onClick={onManage}
          style={{ breakInside: "avoid" }}
        >
          ► MANAGE
        </button>
      )}
    </div>
  );
}
