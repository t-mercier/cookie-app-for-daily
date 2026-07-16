import { render, screen } from "@testing-library/react";
import { Sprite } from "../Sprite";
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
