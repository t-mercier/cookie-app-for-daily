import type { BoardMember } from "../types";

export interface StatsResult {
  leaders: string[];
  losers: string[];
}

export function computeStats(board: BoardMember[]): StatsResult {
  if (board.length === 0) {
    return { leaders: [], losers: [] };
  }

  let maxCookies = -Infinity;
  let minCookies = Infinity;
  const leaderNames: string[] = [];
  const loserNames: string[] = [];

  // First pass: find max and min
  for (const member of board) {
    if (member.cookieCount > maxCookies) {
      maxCookies = member.cookieCount;
    }
    if (member.cookieCount < minCookies) {
      minCookies = member.cookieCount;
    }
  }

  // Second pass: collect all members at max and min, preserving board order
  for (const member of board) {
    if (member.cookieCount === maxCookies) {
      leaderNames.push(member.name);
    }
    if (member.cookieCount === minCookies) {
      loserNames.push(member.name);
    }
  }

  return {
    leaders: leaderNames,
    losers: loserNames,
  };
}
