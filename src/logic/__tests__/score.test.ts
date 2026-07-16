import { formatScore } from "../score";

test("formats as cookie counter", () => {
  expect(formatScore(5)).toBe("x5");
  expect(formatScore(0)).toBe("x0");
  expect(formatScore(12345)).toBe("x12345");
});

test("clamps negatives to zero", () => {
  expect(formatScore(-3)).toBe("x0");
});

test("caps at 99999", () => {
  expect(formatScore(1000000)).toBe("x99999");
});
