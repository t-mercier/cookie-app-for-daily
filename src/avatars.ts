export const AVATAR_KEYS = [
  "knight",
  "robot",
  "alien",
  "ninja",
  "mage",
  "ghost",
  "cowboy",
  "skeleton",
  "astronaut",
  "vampire",
] as const;

export type AvatarKey = (typeof AVATAR_KEYS)[number];

export function isAvatarKey(value: string): value is AvatarKey {
  return (AVATAR_KEYS as readonly string[]).includes(value);
}

/** Return list of bundled avatar asset filenames discovered in src/assets/avatars/ */
export function bundledAvatarIds(): string[] {
  const modules = import.meta.glob(
    "../assets/avatars/*.{png,jpg,jpeg,svg,gif,webp}",
    { eager: true, query: "?url", import: "default" }
  ) as Record<string, string>;
  const ids: string[] = [];
  for (const path of Object.keys(modules)) {
    const filename = path.split("/").pop();
    if (filename) {
      ids.push(filename);
    }
  }
  return ids;
}
