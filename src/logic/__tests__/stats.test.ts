import { describe, it, expect } from "vitest";
import { computeStats } from "../stats";
import type { BoardMember } from "../../types";

describe("computeStats", () => {
  it("returns nulls and 0 for empty board", () => {
    const result = computeStats([]);
    expect(result).toEqual({ total: 0, leader: null, laggard: null });
  });

  it("computes total cookies correctly", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 10, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 20, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 15, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.total).toBe(45);
  });

  it("identifies leader as member with highest cookies", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 10, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 30, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 15, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.leader).toBe("Bob");
  });

  it("identifies laggard as member with lowest cookies", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: true },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 30, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 15, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.laggard).toBe("Alice");
  });

  it("handles ties: leader and laggard are different names", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 20, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 20, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 10, isLagging: true },
    ];
    const result = computeStats(board);
    expect(result.leader).toBe("Alice"); // First one at max
    expect(result.laggard).toBe("Charlie");
  });

  it("handles single member", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Solo", avatarKey: "knight", cookieCount: 42, isLagging: false },
    ];
    const result = computeStats(board);
    expect(result.total).toBe(42);
    expect(result.leader).toBe("Solo");
    expect(result.laggard).toBe("Solo");
  });

  it("handles ties at min and max", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: true },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 5, isLagging: true },
    ];
    const result = computeStats(board);
    expect(result.leader).toBe("Alice"); // First one at max
    expect(result.laggard).toBe("Alice"); // First one at min
    expect(result.total).toBe(10);
  });
});
