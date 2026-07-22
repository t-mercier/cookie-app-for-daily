import { computeBoard } from "../board";
import type { Member } from "../../types";

const members: Member[] = [
  { id: "a", name: "Ann", avatarKey: "cat" },
  { id: "b", name: "Bob", avatarKey: "fox" },
  { id: "c", name: "Cy", avatarKey: "dino" },
];

test("sorts by cookie count, highest first", () => {
  const board = computeBoard(members, { a: 1, b: 5, c: 3 });
  expect(board.map((m) => m.id)).toEqual(["b", "c", "a"]);
});

test("keeps input order as a stable tiebreak on equal counts", () => {
  const board = computeBoard(members, { a: 2, b: 2, c: 2 });
  expect(board.map((m) => m.id)).toEqual(["a", "b", "c"]);
});

test("counts default to 0 when missing", () => {
  const board = computeBoard(members, { b: 2 });
  const ann = board.find((m) => m.id === "a")!;
  expect(ann.cookieCount).toBe(0);
});

test("flags only members at the minimum count as lagging", () => {
  const board = computeBoard(members, { a: 1, b: 5, c: 3 });
  expect(board.find((m) => m.id === "a")!.isLagging).toBe(true);
  expect(board.find((m) => m.id === "b")!.isLagging).toBe(false);
  expect(board.find((m) => m.id === "c")!.isLagging).toBe(false);
});

test("flags all tied minimum members", () => {
  const board = computeBoard(members, { a: 2, b: 2, c: 2 });
  expect(board.every((m) => m.isLagging)).toBe(true);
});

test("empty members returns empty array", () => {
  expect(computeBoard([], {})).toEqual([]);
});
