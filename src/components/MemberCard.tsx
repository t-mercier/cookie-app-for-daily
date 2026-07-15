import type { BoardMember } from "../types";

export function MemberCard({
  member,
  onAward,
}: {
  member: BoardMember;
  onAward: (id: string) => void;
}) {
  return (
    <button
      type="button"
      data-testid={`card-${member.id}`}
      data-lagging={member.isLagging}
      onClick={() => onAward(member.id)}
    >
      <span aria-hidden>{`avatar:${member.avatarKey}`}</span>
      <strong>{member.name}</strong>
      <span>{member.cookieCount}</span>
      {member.isLagging && <span role="status">🍪 needs cookies</span>}
    </button>
  );
}
