import type { BoardMember } from "../types";

export interface StatsResult {
  total: number;
  leader: string | null;
  laggard: string | null;
}

export function computeStats(board: BoardMember[]): StatsResult {
  if (board.length === 0) {
    return { total: 0, leader: null, laggard: null };
  }

  let total = 0;
  let maxCookies = -Infinity;
  let minCookies = Infinity;
  let leaderName: string | null = null;
  let laggardName: string | null = null;

  for (const member of board) {
    total += member.cookieCount;

    if (member.cookieCount > maxCookies) {
      maxCookies = member.cookieCount;
      leaderName = member.name;
    }

    if (member.cookieCount < minCookies) {
      minCookies = member.cookieCount;
      laggardName = member.name;
    }
  }

  return {
    total,
    leader: leaderName,
    laggard: laggardName,
  };
}
