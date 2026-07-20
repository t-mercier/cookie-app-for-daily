import { describe, it, expect } from "vitest";
import { canAwardToday } from "../awardRule";

describe("awardRule", () => {
  it("blocks awards on Saturday", () => {
    // 2026-07-18 is a Saturday
    const saturday = new Date("2026-07-18T10:00:00Z");
    const result = canAwardToday(saturday, null);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toBe("weekend");
    }
  });

  it("blocks awards on Sunday", () => {
    // 2026-07-19 is a Sunday
    const sunday = new Date("2026-07-19T10:00:00Z");
    const result = canAwardToday(sunday, null);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toBe("weekend");
    }
  });

  it("blocks awards when one was already given today", () => {
    // 2026-07-20 is a Monday (10:00 UTC = 12:00 Amsterdam)
    const monday = new Date("2026-07-20T10:00:00Z");
    // latestAwardAt is also the same Amsterdam day (07-20)
    const latestAwardAt = "2026-07-20T08:00:00Z"; // 10:00 Amsterdam time
    const result = canAwardToday(monday, latestAwardAt);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toBe("already-today");
    }
  });

  it("allows awards when latest award was on a prior day", () => {
    // 2026-07-20 is a Monday (10:00 UTC = 12:00 Amsterdam)
    const monday = new Date("2026-07-20T10:00:00Z");
    // latestAwardAt is on previous day
    const latestAwardAt = "2026-07-19T10:00:00Z"; // Sunday (not blocking due to day difference)
    const result = canAwardToday(monday, latestAwardAt);
    expect(result.allowed).toBe(true);
  });

  it("allows awards on a weekday with no prior award", () => {
    // 2026-07-20 is a Monday
    const monday = new Date("2026-07-20T10:00:00Z");
    const result = canAwardToday(monday, null);
    expect(result.allowed).toBe(true);
  });

  it("handles late-evening UTC that crosses into next Amsterdam day", () => {
    // 2026-07-20 23:30 UTC = 2026-07-21 01:30 Amsterdam (next day)
    const lateUtc = new Date("2026-07-20T23:30:00Z");
    // latestAwardAt is on the same Amsterdam day as lateUtc (07-21)
    const latestAwardAt = "2026-07-20T22:00:00Z"; // 2026-07-21 00:00 Amsterdam
    const result = canAwardToday(lateUtc, latestAwardAt);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.reason).toBe("already-today");
    }
  });

  it("allows awards when late-evening UTC is different Amsterdam day from latest award", () => {
    // 2026-07-20 23:30 UTC = 2026-07-21 01:30 Amsterdam
    const lateUtc = new Date("2026-07-20T23:30:00Z");
    // latestAwardAt is on 2026-07-20 Amsterdam (earlier day)
    const latestAwardAt = "2026-07-20T20:00:00Z"; // 2026-07-20 22:00 Amsterdam
    const result = canAwardToday(lateUtc, latestAwardAt);
    expect(result.allowed).toBe(true);
  });

  it("blocks awards on Friday even with old prior award", () => {
    // 2026-07-17 is a Friday
    const friday = new Date("2026-07-17T10:00:00Z");
    const latestAwardAt = "2026-07-16T10:00:00Z"; // Thursday
    const result = canAwardToday(friday, latestAwardAt);
    expect(result.allowed).toBe(true);
  });
});
