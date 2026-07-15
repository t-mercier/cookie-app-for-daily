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

test("renders a fallback for an unknown key", () => {
  render(<Sprite avatarKey="not-real" size={32} />);
  expect(screen.getByTestId("sprite-unknown")).toBeInTheDocument();
});
