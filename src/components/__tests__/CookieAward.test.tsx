import { render, screen } from "@testing-library/react";
import { CookieAward } from "../CookieAward";

test("renders the award sequence", () => {
  render(<CookieAward memberName="ALICE" />);
  expect(screen.getByTestId("cookie-award")).toBeInTheDocument();
});

test("renders member name in uppercase", () => {
  render(<CookieAward memberName="piotr" />);
  expect(screen.getByText(/PIOTR LED THE DAILY/)).toBeInTheDocument();
});

test("displays all sequence lines", () => {
  render(<CookieAward memberName="BOB" />);
  expect(screen.getByText(/BOB LED THE DAILY/)).toBeInTheDocument();
  expect(screen.getByText(/GOOD JOB, BRAVE LITTLE ONE/)).toBeInTheDocument();
  expect(screen.getByText(/HERE, HAVE A COOKIE/)).toBeInTheDocument();
});
