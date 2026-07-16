import { describe, it, expect } from "vitest";
import { computeStats } from "../stats";
import type { BoardMember } from "../../types";

describe("computeStats", () => {
  it("returns empty lists for empty board", () => {
    const result = computeStats([]);
    expect(result).toEqual({ leaders: [], needsCookies: [] });
  });

  it("identifies leader as member with highest cookies", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 10, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 30, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 15, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.leaders).toHaveLength(1);
    expect(result.leaders[0]).toMatchObject({ id: "2", name: "Bob" });
  });

  it("returns the 3 members with lowest cookies", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: true },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 30, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 15, isLagging: false },
      { id: "4", name: "Diana", avatarKey: "cat", cookieCount: 3, isLagging: false },
      { id: "5", name: "Eve", avatarKey: "dog", cookieCount: 8, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.needsCookies).toHaveLength(3);
    expect(result.needsCookies.map((m) => m.id)).toEqual(["4", "1", "5"]); // Diana (3), Alice (5), Eve (8)
  });

  it("returns all leaders when there are ties at max", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 20, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 20, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 10, isLagging: true },
    ];
    const result = computeStats(board);
    expect(result.leaders).toHaveLength(2);
    expect(result.leaders.map((m) => m.id)).toEqual(["1", "2"]);
  });

  it("handles single member (both leader and in needsCookies)", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Solo", avatarKey: "knight", cookieCount: 42, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.leaders).toHaveLength(1);
    expect(result.leaders[0]).toMatchObject({ id: "1", name: "Solo" });
    expect(result.needsCookies).toHaveLength(1);
    expect(result.needsCookies[0]).toMatchObject({ id: "1", name: "Solo" });
  });

  it("returns all members if board has fewer than 3", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 10, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.needsCookies).toHaveLength(2);
    expect(result.needsCookies.map((m) => m.id)).toEqual(["1", "2"]); // sorted by count
  });
});
