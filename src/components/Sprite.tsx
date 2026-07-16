import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";

/** Resolve avatarKey to image source: http(s) URL → direct, bundled asset → glob map, otherwise → DiceBear fallback */
export function resolveAvatarSource(
  avatarKey: string,
  bundledMap: Record<string, string> = {}
): string {
  // 1. HTTP(S) URL
  if (avatarKey.startsWith("http://") || avatarKey.startsWith("https://")) {
    return avatarKey;
  }

  // 2. Bundled asset
  if (avatarKey in bundledMap) {
    return bundledMap[avatarKey];
  }

  // 3. DiceBear fallback
  return createAvatar(pixelArt, { seed: avatarKey, size: 64 }).toDataUri();
}

export function Sprite({ avatarKey, size = 32 }: { avatarKey: string; size?: number }) {
  const bundledMap = useMemo(() => {
    const modules = import.meta.glob(
      "../../assets/avatars/*.{png,jpg,jpeg,svg,gif,webp}",
      { eager: true, query: "?url", import: "default" }
    ) as Record<string, string>;
    const map: Record<string, string> = {};
    for (const [path, url] of Object.entries(modules)) {
      const filename = path.split("/").pop();
      if (filename) {
        map[filename] = url;
      }
    }
    return map;
  }, []);

  const src = useMemo(() => resolveAvatarSource(avatarKey, bundledMap), [avatarKey, bundledMap]);

  return (
    <img
      data-testid={`sprite-${avatarKey}`}
      src={src}
      width={size}
      height={size}
      alt={`${avatarKey} avatar`}
      className="avatar-badge"
      style={{ imageRendering: "pixelated", borderRadius: "50%", objectFit: "cover" }}
    />
  );
}
