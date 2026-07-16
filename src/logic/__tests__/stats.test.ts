import { describe, it, expect } from "vitest";
import { computeStats } from "../stats";
import type { BoardMember } from "../../types";

describe("computeStats", () => {
  it("returns empty lists for empty board", () => {
    const result = computeStats([]);
    expect(result).toEqual({ leaders: [], losers: [] });
  });

  it("identifies leader as member with highest cookies", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 10, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 30, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 15, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.leaders).toEqual(["Bob"]);
  });

  it("identifies loser as member with lowest cookies", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: true },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 30, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 15, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.losers).toEqual(["Alice"]);
  });

  it("returns all leaders when there are ties at max", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 20, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 20, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 10, isLagging: true },
    ];
    const result = computeStats(board);
    expect(result.leaders).toEqual(["Alice", "Bob"]);
    expect(result.losers).toEqual(["Charlie"]);
  });

  it("returns all losers when there are ties at min", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: true },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 5, isLagging: true },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 20, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.leaders).toEqual(["Charlie"]);
    expect(result.losers).toEqual(["Alice", "Bob"]);
  });

  it("handles single member (is both leader and loser)", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Solo", avatarKey: "knight", cookieCount: 42, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.leaders).toEqual(["Solo"]);
    expect(result.losers).toEqual(["Solo"]);
  });

  it("handles all members with same count (all are both leaders and losers)", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 5, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.leaders).toEqual(["Alice", "Bob"]);
    expect(result.losers).toEqual(["Alice", "Bob"]);
  });
});
