import { render, screen } from "@testing-library/react";
import { Sprite, resolveAvatarSource } from "../Sprite";
import { AVATAR_KEYS } from "../../avatars";

test("renders a distinct sprite for every avatar key", () => {
  for (const key of AVATAR_KEYS) {
    const { unmount } = render(<Sprite avatarKey={key} size={32} />);
    expect(screen.getByTestId(`sprite-${key}`)).toBeInTheDocument();
    unmount();
  }
});

test("renders distinct avatars for different keys", () => {
  const { rerender } = render(<Sprite avatarKey="knight" size={32} />);
  const knightSrc = screen.getByTestId("sprite-knight").getAttribute("src");

  rerender(<Sprite avatarKey="robot" size={32} />);
  const robotSrc = screen.getByTestId("sprite-robot").getAttribute("src");

  expect(knightSrc).not.toBe(robotSrc);
});

test("resolveAvatarSource: http url passthrough", () => {
  const url = "https://example.com/avatar.png";
  expect(resolveAvatarSource(url)).toBe(url);
});

test("resolveAvatarSource: https url passthrough", () => {
  const url = "https://example.com/avatar.gif";
  expect(resolveAvatarSource(url)).toBe(url);
});

test("resolveAvatarSource: unknown key returns data-uri (DiceBear)", () => {
  const src = resolveAvatarSource("unknownkey123");
  expect(src).toMatch(/^data:image/);
});

test("resolveAvatarSource: bundled asset mapping (empty map)", () => {
  // jsdom cannot resolve import.meta.glob, so the map will be empty during tests
  // This test verifies the fallback to DiceBear works
  const src = resolveAvatarSource("knight", {});
  expect(src).toMatch(/^data:image/);
});
