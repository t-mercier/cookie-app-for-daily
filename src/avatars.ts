export const AVATAR_KEYS = [
  "hamster",
  "raccoon",
  "dino",
  "cat",
  "fox",
  "penguin",
  "robot",
  "alien",
] as const;

export type AvatarKey = (typeof AVATAR_KEYS)[number];

export function isAvatarKey(value: string): value is AvatarKey {
  return (AVATAR_KEYS as readonly string[]).includes(value);
}
