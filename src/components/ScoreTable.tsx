import type { BoardMember } from "../types";
import { ScoreRow } from "./ScoreRow";

export function ScoreTable({
  board,
  onAward,
}: {
  board: BoardMember[];
  onAward: (id: string) => void;
}) {
  return (
    <div className="score-table">
      {board.map((member) => (
        <ScoreRow key={member.id} member={member} onAward={onAward} />
      ))}
    </div>
  );
}
