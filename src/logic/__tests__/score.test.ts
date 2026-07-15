import { formatScore } from "../score";

test("formats as cookie counter", () => {
  expect(formatScore(5)).toBe("🍪×5");
  expect(formatScore(0)).toBe("🍪×0");
  expect(formatScore(12345)).toBe("🍪×12345");
});

test("clamps negatives to zero", () => {
  expect(formatScore(-3)).toBe("🍪×0");
});

test("caps at 99999", () => {
  expect(formatScore(1000000)).toBe("🍪×99999");
});
