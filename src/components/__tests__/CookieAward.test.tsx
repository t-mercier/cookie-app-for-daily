import { render, screen } from "@testing-library/react";
import { CookieAward } from "../CookieAward";

test("renders nothing when show is false", () => {
  const { container } = render(<CookieAward show={false} onDone={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});

test("renders the overlay when show is true", () => {
  render(<CookieAward show={true} onDone={() => {}} />);
  expect(screen.getByTestId("cookie-award")).toBeInTheDocument();
});
