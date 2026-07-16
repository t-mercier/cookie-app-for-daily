import type { Member, BoardMember } from "../types";

export function computeBoard(
  members: Member[],
  counts: Record<string, number>
): BoardMember[] {
  if (members.length === 0) return [];

  const withCounts = members.map((member) => ({
    ...member,
    cookieCount: counts[member.id] ?? 0,
  }));

  const minCount = Math.min(...withCounts.map((m) => m.cookieCount));

  return withCounts.map((m) => ({ ...m, isLagging: m.cookieCount === minCount }));
}
