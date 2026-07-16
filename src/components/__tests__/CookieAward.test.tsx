import { render, screen } from "@testing-library/react";
import { CookieAward } from "../CookieAward";

test("renders nothing when show is false", () => {
  const { container } = render(<CookieAward show={false} onDone={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});

test("renders the dialog when show is true", () => {
  render(<CookieAward show={true} onDone={() => {}} />);
  expect(screen.getByTestId("cookie-award")).toBeInTheDocument();
});

test("renders member name when memberName is provided", () => {
  render(<CookieAward show={true} memberName="PIOTR" onDone={() => {}} />);
  expect(screen.getByText(/PIOTR LED THE DAILY/)).toBeInTheDocument();
});

test("renders SOMEONE when memberName is not provided", () => {
  render(<CookieAward show={true} onDone={() => {}} />);
  expect(screen.getByText(/SOMEONE LED THE DAILY/)).toBeInTheDocument();
});
