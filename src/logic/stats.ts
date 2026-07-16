import type { BoardMember } from "../types";

export interface StatsResult {
  leaders: BoardMember[];
  needsCookies: BoardMember[];
}

export function computeStats(board: BoardMember[]): StatsResult {
  if (board.length === 0) {
    return { leaders: [], needsCookies: [] };
  }

  // Find max for leaders
  let maxCookies = -Infinity;
  for (const member of board) {
    if (member.cookieCount > maxCookies) {
      maxCookies = member.cookieCount;
    }
  }

  // Collect all members at max, preserving board order
  const leaders = board.filter((m) => m.cookieCount === maxCookies);

  // Get the 3 members with lowest cookieCount, sorted ascending by count (stable)
  const sorted = [...board].sort((a, b) => a.cookieCount - b.cookieCount);
  const needsCookies = sorted.slice(0, Math.min(3, board.length));

  return {
    leaders,
    needsCookies,
  };
}
