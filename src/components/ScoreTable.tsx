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
    <div className="score-table pixel-panel">
      {board.map((member, index) => (
        <ScoreRow key={member.id} rank={index + 1} member={member} onAward={onAward} />
      ))}
    </div>
  );
}
