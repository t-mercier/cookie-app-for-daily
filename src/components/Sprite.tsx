import { useMemo } from "react";

/** Resolve avatarKey to image source: http(s) URL → direct, bundled asset → glob map, otherwise → null (placeholder) */
export function resolveAvatarSource(
  avatarKey: string,
  bundledMap: Record<string, string> = {}
): string | null {
  // Empty key → placeholder
  if (!avatarKey) {
    return null;
  }

  // 1. HTTP(S) URL
  if (avatarKey.startsWith("http://") || avatarKey.startsWith("https://")) {
    return avatarKey;
  }

  // 2. Bundled asset
  if (avatarKey in bundledMap) {
    return bundledMap[avatarKey];
  }

  // 3. Unknown key → placeholder (no DiceBear fallback)
  return null;
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

  // Render placeholder badge if no valid source
  if (!src) {
    return (
      <div
        data-testid={`sprite-${avatarKey}`}
        className="avatar-badge"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "var(--text-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.5,
          color: "var(--bg-dark)",
          fontWeight: "bold",
        }}
      >
        ?
      </div>
    );
  }

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
