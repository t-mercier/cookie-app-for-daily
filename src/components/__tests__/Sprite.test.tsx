import { render, screen } from "@testing-library/react";
import { Sprite, resolveAvatarSource } from "../Sprite";

test("renders a sprite for a URL", () => {
  render(<Sprite avatarKey="https://example.com/avatar.png" size={32} />);
  expect(screen.getByTestId("sprite-https://example.com/avatar.png")).toBeInTheDocument();
});

test("renders placeholder for empty avatarKey", () => {
  render(<Sprite avatarKey="" size={32} />);
  expect(screen.getByTestId("sprite-")).toBeInTheDocument();
});

test("renders distinct src for different URLs", () => {
  const { rerender } = render(<Sprite avatarKey="https://example.com/avatar1.png" size={32} />);
  const img1 = screen.getByTestId("sprite-https://example.com/avatar1.png") as HTMLImageElement;
  const src1 = img1.src;

  rerender(<Sprite avatarKey="https://example.com/avatar2.png" size={32} />);
  const img2 = screen.getByTestId("sprite-https://example.com/avatar2.png") as HTMLImageElement;
  const src2 = img2.src;

  expect(src1).not.toBe(src2);
});

test("resolveAvatarSource: http url passthrough", () => {
  const url = "http://example.com/avatar.png";
  expect(resolveAvatarSource(url)).toBe(url);
});

test("resolveAvatarSource: https url passthrough", () => {
  const url = "https://example.com/avatar.gif";
  expect(resolveAvatarSource(url)).toBe(url);
});

test("resolveAvatarSource: empty key returns null", () => {
  const src = resolveAvatarSource("");
  expect(src).toBeNull();
});

test("resolveAvatarSource: unknown key returns null", () => {
  const src = resolveAvatarSource("unknownkey123");
  expect(src).toBeNull();
});
