import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StatsPanel } from "../StatsPanel";
import type { BoardMember } from "../../types";

describe("StatsPanel", () => {
  it("renders sprite avatars for leaders and needsCookies members", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 10, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 20, isLagging: false },
    ];
    render(<StatsPanel board={board} onManage={() => {}} />);

    // Both should appear (Bob as leader, Alice in needsCookies)
    expect(screen.getAllByTestId("sprite-robot")).toHaveLength(2); // Bob appears in both leaders and needsCookies (3 lowest)
    expect(screen.getAllByTestId("sprite-knight")).toHaveLength(1); // Alice only in needsCookies
  });

  it("shows dashes for empty board", () => {
    render(<StatsPanel board={[]} onManage={() => {}} />);

    expect(screen.getAllByText("—")).toHaveLength(2); // leaders and needsCookies dashes
  });

  it("calls onManage when MANAGE PLAYERS button is clicked", async () => {
    const onManage = vi.fn();
    render(<StatsPanel board={[]} onManage={onManage} />);

    await userEvent.click(screen.getByRole("button", { name: /manage players/i }));
    expect(onManage).toHaveBeenCalledOnce();
  });

  it("renders the panel with correct testid", () => {
    render(<StatsPanel board={[]} onManage={() => {}} />);
    expect(screen.getByTestId("stats-panel")).toBeInTheDocument();
  });

  it("marks needs-cookies label with warn class", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: true },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 20, isLagging: false },
    ];
    render(<StatsPanel board={board} onManage={() => {}} />);

    const label = screen.getByText("NEEDS COOKIES", { selector: ".stat-label.warn" });
    expect(label).toBeInTheDocument();
  });

  it("renders all tied leaders when multiple members have max cookies", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 20, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 20, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 10, isLagging: true },
    ];
    render(<StatsPanel board={board} onManage={() => {}} />);

    // Alice and Bob are leaders (both have 20)
    // needsCookies: 3 lowest = Alice (20), Bob (20), Charlie (10)
    expect(screen.getAllByTestId("sprite-knight")).toHaveLength(2); // Alice in leaders + needsCookies
    expect(screen.getAllByTestId("sprite-robot")).toHaveLength(2); // Bob in leaders + needsCookies
    expect(screen.getByTestId("sprite-wizard")).toBeInTheDocument(); // Charlie only in needsCookies
  });

  it("renders up to 3 members in needsCookies", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: true },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 8, isLagging: false },
      { id: "3", name: "Charlie", avatarKey: "wizard", cookieCount: 10, isLagging: false },
      { id: "4", name: "Diana", avatarKey: "cat", cookieCount: 20, isLagging: false },
    ];
    render(<StatsPanel board={board} onManage={() => {}} />);

    // needsCookies should have the 3 lowest: Alice (5), Bob (8), Charlie (10)
    // Diana (20) is the leader but not in needsCookies
    expect(screen.getByTestId("sprite-knight")).toBeInTheDocument(); // Alice in needsCookies
    expect(screen.getByTestId("sprite-robot")).toBeInTheDocument(); // Bob in needsCookies
    expect(screen.getByTestId("sprite-wizard")).toBeInTheDocument(); // Charlie in needsCookies
    expect(screen.getByTestId("sprite-cat")).toBeInTheDocument(); // Diana in leaders (only place)
  });
});
