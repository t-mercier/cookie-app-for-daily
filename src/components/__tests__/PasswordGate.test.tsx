import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordGate } from "../PasswordGate";

beforeEach(() => {
  sessionStorage.clear();
  vi.stubEnv("VITE_APP_PASSWORD", "secret");
});

test("hides children until correct password entered", async () => {
  render(<PasswordGate><div>SECRET BOARD</div></PasswordGate>);
  expect(screen.queryByText("SECRET BOARD")).not.toBeInTheDocument();

  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /unlock/i }));
  expect(screen.getByText("SECRET BOARD")).toBeInTheDocument();
});

test("shows error on wrong password", async () => {
  render(<PasswordGate><div>SECRET BOARD</div></PasswordGate>);
  await userEvent.type(screen.getByLabelText(/password/i), "nope");
  await userEvent.click(screen.getByRole("button", { name: /unlock/i }));
  expect(screen.queryByText("SECRET BOARD")).not.toBeInTheDocument();
  expect(screen.getByText(/wrong password/i)).toBeInTheDocument();
});
