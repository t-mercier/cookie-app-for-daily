import type { BoardMember } from "../types";
import { MemberCard } from "./MemberCard";

export function Board({
  board,
  onAward,
}: {
  board: BoardMember[];
  onAward: (id: string) => void;
}) {
  return (
    <div className="board">
      {board.map((member) => (
        <MemberCard key={member.id} member={member} onAward={onAward} />
      ))}
    </div>
  );
}
