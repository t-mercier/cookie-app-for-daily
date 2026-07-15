import { AVATAR_KEYS, isAvatarKey } from "../avatars";

test("avatar set is non-empty and unique", () => {
  expect(AVATAR_KEYS.length).toBeGreaterThan(0);
  expect(new Set(AVATAR_KEYS).size).toBe(AVATAR_KEYS.length);
});

test("isAvatarKey validates membership", () => {
  expect(isAvatarKey(AVATAR_KEYS[0])).toBe(true);
  expect(isAvatarKey("not-an-avatar")).toBe(false);
});
