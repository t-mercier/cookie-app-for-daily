type Grid = string[]; // 8 rows of 8 chars; keys index into palette, "." = transparent

const PIXEL = 1; // logical unit; scaled by viewBox

// palette per sprite: char -> color
type Sprite8 = { grid: Grid; palette: Record<string, string> };

const SPRITES: Record<string, Sprite8> = {
  knight: {
    palette: { a: "#b8c0d8", b: "#7d86a8", c: "#3a3f5c" },
    grid: [
      "..aaaa..",
      ".aabbaa.",
      ".abbbba.",
      ".acccca.",
      ".acccca.",
      "..cccc..",
      "..c..c..",
      ".cc..cc.",
    ],
  },
  robot: {
    palette: { a: "#4be3c0", b: "#2a9d8f", c: "#111" },
    grid: [
      ".aaaaaa.",
      ".acccca.",
      ".acbcba.",
      ".acccca.",
      ".aaaaaa.",
      "..a..a..",
      ".aa..aa.",
      ".a....a.",
    ],
  },
  alien: {
    palette: { a: "#3ade8d", b: "#2a8f6f", c: "#1a5a4a" },
    grid: [
      "..aaaa..",
      ".abbbba.",
      "abbbbba.",
      ".abbbba.",
      ".abbbba.",
      "..aaaa..",
      ".aa..aa.",
      ".a....a.",
    ],
  },
  ninja: {
    palette: { a: "#111111", b: "#ffffff" },
    grid: [
      "..aaaa..",
      ".aabbaa.",
      ".aabbaa.",
      ".aaaaaa.",
      ".aaaaaa.",
      "..aaaa..",
      ".aa..aa.",
      ".a....a.",
    ],
  },
  mage: {
    palette: { a: "#6b4fa5", b: "#9b6db8", c: "#ffeb3b" },
    grid: [
      ".aaaaaa.",
      ".a....a.",
      ".aabbaa.",
      ".abbbba.",
      "..accca.",
      "..accca.",
      "..accca.",
      "...c....",
    ],
  },
  ghost: {
    palette: { a: "#ffffff", b: "#e8d5f2" },
    grid: [
      ".aaaaaa.",
      ".a....a.",
      ".a.aa.a.",
      ".a....a.",
      ".aaaaaa.",
      ".a....a.",
      ".a.aa.a.",
      ".a....a.",
    ],
  },
  cowboy: {
    palette: { a: "#8b5a2b", b: "#d4a574", c: "#111111" },
    grid: [
      ".aaaaaa.",
      ".a.aa.a.",
      ".acccca.",
      ".ac..ca.",
      ".abbbba.",
      ".abbaba.",
      "..abba..",
      ".aa..aa.",
    ],
  },
  skeleton: {
    palette: { a: "#f5f5f5", b: "#333333" },
    grid: [
      ".aaaaaa.",
      ".ab..ba.",
      ".aabbaa.",
      ".aaaaaa.",
      ".a.aa.a.",
      ".a.aa.a.",
      "..aaaa..",
      ".aa..aa.",
    ],
  },
  astronaut: {
    palette: { a: "#c0c0c0", b: "#0066cc", c: "#ffeb3b" },
    grid: [
      "...c....",
      ".aaaaaa.",
      ".a.bb.a.",
      ".aaaaaa.",
      ".abbaba.",
      ".abbaba.",
      "..aaaa..",
      ".aa..aa.",
    ],
  },
  vampire: {
    palette: { a: "#8b0000", b: "#ff0000", c: "#000000" },
    grid: [
      ".aaaaaa.",
      ".abaaab.",
      ".abaaab.",
      ".c....c.",
      ".ccaac..",
      ".ccaacc.",
      "..caac..",
      "...aa...",
    ],
  },
};

const FALLBACK: Sprite8 = {
  palette: { a: "#6b6690" },
  grid: ["aaaaaaaa", "a......a", "a.a..a.a", "a......a", "a..aa..a", "a.a..a.a", "a......a", "aaaaaaaa"],
};

export function Sprite({ avatarKey, size = 32 }: { avatarKey: string; size?: number }) {
  const known = Object.prototype.hasOwnProperty.call(SPRITES, avatarKey);
  const sprite = known ? SPRITES[avatarKey] : FALLBACK;
  const testId = known ? `sprite-${avatarKey}` : "sprite-unknown";
  const rects: React.ReactElement[] = [];
  sprite.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === ".") continue;
      const color = sprite.palette[ch];
      if (!color) continue;
      rects.push(
        <rect key={`${x}-${y}`} x={x * PIXEL} y={y * PIXEL} width={PIXEL} height={PIXEL} fill={color} />
      );
    }
  });
  return (
    <svg
      data-testid={testId}
      width={size}
      height={size}
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      role="img"
      aria-label={`${avatarKey} avatar`}
    >
      {rects}
    </svg>
  );
}
