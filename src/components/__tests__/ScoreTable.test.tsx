import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScoreTable } from "../ScoreTable";
import type { BoardMember } from "../../types";

const board: BoardMember[] = [
  { id: "b", name: "Bob", avatarKey: "robot", cookieCount: 5, isLagging: false },
  { id: "a", name: "Ann", avatarKey: "knight", cookieCount: 1, isLagging: true },
];

test("renders rows in given order with cookie counter scores", () => {
  render(<ScoreTable board={board} onAward={() => {}} />);
  const rows = screen.getAllByTestId(/^row-/);
  expect(rows[0]).toHaveAttribute("data-testid", "row-b");
  expect(rows[1]).toHaveAttribute("data-testid", "row-a");
  expect(screen.getByText("🍪×5")).toBeInTheDocument();
  expect(screen.getByText("🍪×1")).toBeInTheDocument();
});

test("marks lagging members", () => {
  render(<ScoreTable board={board} onAward={() => {}} />);
  expect(screen.getByTestId("row-a")).toHaveAttribute("data-lagging", "true");
  expect(screen.getByTestId("row-b")).toHaveAttribute("data-lagging", "false");
});

test("clicking a row awards to that member", async () => {
  const onAward = vi.fn();
  render(<ScoreTable board={board} onAward={onAward} />);
  await userEvent.click(screen.getByTestId("row-a"));
  expect(onAward).toHaveBeenCalledWith("a");
});
