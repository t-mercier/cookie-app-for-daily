import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StatsPanel } from "../StatsPanel";
import type { BoardMember } from "../../types";

describe("StatsPanel", () => {
  it("renders stats from a non-empty board", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 10, isLagging: false },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 20, isLagging: false },
    ];
    render(<StatsPanel board={board} onManage={() => {}} />);

    expect(screen.getByText(/^30 🍪$/)).toBeInTheDocument(); // total
    expect(screen.getByText("Bob")).toBeInTheDocument(); // leader
    expect(screen.getByText("Alice")).toBeInTheDocument(); // laggard
  });

  it("shows dashes for empty board", () => {
    render(<StatsPanel board={[]} onManage={() => {}} />);

    expect(screen.getByText(/^0 🍪$/)).toBeInTheDocument();
    expect(screen.getAllByText("—")).toHaveLength(2); // leader and laggard dashes
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

  it("marks laggard stat with warn class", () => {
    const board: BoardMember[] = [
      { id: "1", name: "Alice", avatarKey: "knight", cookieCount: 5, isLagging: true },
      { id: "2", name: "Bob", avatarKey: "robot", cookieCount: 20, isLagging: false },
    ];
    render(<StatsPanel board={board} onManage={() => {}} />);

    const laggardValue = screen.getByText("Alice", { selector: ".stat-value.warn" });
    expect(laggardValue).toBeInTheDocument();
  });
});
