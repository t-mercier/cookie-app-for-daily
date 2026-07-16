import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";

export function Sprite({ avatarKey, size = 32 }: { avatarKey: string; size?: number }) {
  const uri = useMemo(
    () => createAvatar(pixelArt, { seed: avatarKey, size }).toDataUri(),
    [avatarKey, size]
  );
  return (
    <img
      data-testid={`sprite-${avatarKey}`}
      src={uri}
      width={size}
      height={size}
      alt={`${avatarKey} avatar`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
