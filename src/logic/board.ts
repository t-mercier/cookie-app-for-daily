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

  // Rank by cookie count (highest first). Array.sort is stable, so ties keep
  // the input order (the fixed Miro order) as a deterministic tiebreak.
  return withCounts
    .map((m) => ({ ...m, isLagging: m.cookieCount === minCount }))
    .sort((a, b) => b.cookieCount - a.cookieCount);
}
