import type { BoardMember } from "../types";
import { Sprite } from "./Sprite";
import { formatScore } from "../logic/score";

export function ScoreRow({
  rank,
  member,
  onAward,
}: {
  rank: number;
  member: BoardMember;
  onAward: (id: string) => void;
}) {
  return (
    <button
      type="button"
      data-testid={`row-${member.id}`}
      data-lagging={member.isLagging}
      onClick={() => onAward(member.id)}
      className="score-row"
    >
      <span className="rank">{rank}</span>
      <Sprite avatarKey={member.avatarKey} size={32} />
      <span className="name">{member.name}</span>
      <span className="score">{formatScore(member.cookieCount)}</span>
      {member.isLagging && (
        <span role="status" className="warn">◄ NEEDS COOKIES!</span>
      )}
    </button>
  );
}
