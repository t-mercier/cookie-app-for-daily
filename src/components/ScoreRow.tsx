import type { BoardMember } from "../types";
import { Sprite } from "./Sprite";
import { formatScore } from "../logic/score";

export function ScoreRow({
  member,
  onAward,
}: {
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
      <Sprite avatarKey={member.avatarKey} size={32} />
      <span className="name">{member.name}</span>
      {member.isLagging && (
        <span role="status" className="warn needs-cookies">NEEDS COOKIES!</span>
      )}
      <span className="score">{formatScore(member.cookieCount)}</span>
    </button>
  );
}
