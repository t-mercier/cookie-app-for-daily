export function formatScore(count: number): string {
  const clamped = Math.max(0, Math.min(count, 99999));
  return `x${clamped}`;
}
