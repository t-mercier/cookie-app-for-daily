import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import type { CookiesApi } from "../data/cookiesApi";

beforeEach(() => {
  sessionStorage.clear();
  vi.stubEnv("VITE_APP_PASSWORD", "secret");
});

function fakeApi(): CookiesApi {
  let awarded = 0;
  return {
    getMembers: async () => [{ id: "a", name: "Ann", avatarKey: "knight" }],
    getCookieCounts: async () => ({ a: awarded }),
    awardCookie: async () => { awarded += 1; },
    addMember: async () => ({ id: "x", name: "X", avatarKey: "robot" }),
    removeMember: async () => {},
    updateMember: async () => {},
    removeCookie: async () => { awarded = Math.max(awarded - 1, 0); },
    subscribeToChanges: () => () => {},
  } as CookiesApi;
}

test("unlock, see board, award a cookie", async () => {
  render(<App api={fakeApi()} />);
  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /unlock/i }));

  await waitFor(() => expect(screen.getByTestId("row-a")).toBeInTheDocument());
  await userEvent.click(screen.getByTestId("row-a"));
  expect(screen.getByTestId("cookie-award")).toBeInTheDocument();
});

test("opens the character-select overlay", async () => {
  render(<App api={fakeApi()} />);
  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /unlock/i }));
  await waitFor(() => expect(screen.getByTestId("row-a")).toBeInTheDocument());
  await userEvent.click(screen.getByRole("button", { name: /manage/i }));
  expect(screen.getByTestId("character-select")).toBeInTheDocument();
});

test("navigates between views", async () => {
  render(<App api={fakeApi()} />);
  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /unlock/i }));
  await waitFor(() => expect(screen.getByTestId("row-a")).toBeInTheDocument());

  // Navigate to VE Board
  await userEvent.click(screen.getByRole("button", { name: /ve board/i }));
  expect(screen.getByTestId("ve-board")).toBeInTheDocument();

  // Navigate back to Cookie Board
  await userEvent.click(screen.getByRole("button", { name: /cookie board/i }));
  expect(screen.getByTestId("row-a")).toBeInTheDocument();
});
