import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board } from "../Board";
import type { BoardMember } from "../../types";

const board: BoardMember[] = [
  { id: "b", name: "Bob", avatarKey: "fox", cookieCount: 5, isLagging: false },
  { id: "a", name: "Ann", avatarKey: "cat", cookieCount: 1, isLagging: true },
];

test("renders one card per member with counts", () => {
  render(<Board board={board} onAward={() => {}} />);
  expect(screen.getByText("Bob")).toBeInTheDocument();
  expect(screen.getByText("Ann")).toBeInTheDocument();
  expect(screen.getByText("5")).toBeInTheDocument();
});

test("marks lagging members", () => {
  render(<Board board={board} onAward={() => {}} />);
  expect(screen.getByTestId("card-a")).toHaveAttribute("data-lagging", "true");
  expect(screen.getByTestId("card-b")).toHaveAttribute("data-lagging", "false");
});

test("clicking a card awards a cookie to that member", async () => {
  const onAward = vi.fn();
  render(<Board board={board} onAward={onAward} />);
  await userEvent.click(screen.getByTestId("card-a"));
  expect(onAward).toHaveBeenCalledWith("a");
});
