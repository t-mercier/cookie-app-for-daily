import { formatScore } from "../score";

test("zero-pads to 5 digits", () => {
  expect(formatScore(5)).toBe("00005");
  expect(formatScore(0)).toBe("00000");
  expect(formatScore(12345)).toBe("12345");
});

test("clamps negatives to zero", () => {
  expect(formatScore(-3)).toBe("00000");
});

test("caps at 99999", () => {
  expect(formatScore(1000000)).toBe("99999");
});
