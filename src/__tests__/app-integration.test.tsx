import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import type { CookiesApi } from "../data/cookiesApi";

beforeEach(() => {
  localStorage.clear();
  vi.stubEnv("VITE_APP_PASSWORD", "secret");
  // Stub to a Monday to avoid weekend blocks
  vi.setSystemTime(new Date("2026-07-20T10:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
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
    resetAllCookies: async () => { awarded = 0; },
    getLatestAwardAt: async () => null,
  } as CookiesApi;
}

test("unlock, see board, award a cookie", async () => {
  render(<App api={fakeApi()} />);
  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /unlock/i }));

  await waitFor(() => expect(screen.getByTestId("row-a")).toBeInTheDocument());

  // Click to award a cookie
  await userEvent.click(screen.getByTestId("row-a"));

  // Award dialog should appear (now below stats panel)
  await waitFor(() => expect(screen.getByTestId("cookie-award")).toBeInTheDocument());
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

test("blocks award when already given today", async () => {
  const apiWithToday = fakeApi();
  apiWithToday.getLatestAwardAt = async () => "2026-07-20T08:00:00Z"; // Same day
  render(<App api={apiWithToday} />);
  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /unlock/i }));
  await waitFor(() => expect(screen.getByTestId("row-a")).toBeInTheDocument());

  // Click to award a cookie
  await userEvent.click(screen.getByTestId("row-a"));

  // Should show notice instead of awarding
  await waitFor(() =>
    expect(screen.getByTestId("award-notice")).toHaveTextContent(
      "TODAY'S COOKIE IS ALREADY GIVEN!"
    )
  );
  // Cookie award animation should NOT appear
  expect(screen.queryByTestId("cookie-award")).not.toBeInTheDocument();
});

test("blocks award on weekend", async () => {
  // Saturday: 2026-07-18
  vi.setSystemTime(new Date("2026-07-18T10:00:00Z"));
  const api = fakeApi();
  render(<App api={api} />);
  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /unlock/i }));
  await waitFor(() => expect(screen.getByTestId("row-a")).toBeInTheDocument());

  // Click to award a cookie
  await userEvent.click(screen.getByTestId("row-a"));

  // Should show weekend notice
  await waitFor(() =>
    expect(screen.getByTestId("award-notice")).toHaveTextContent(
      "NO COOKIES ON WEEKENDS!"
    )
  );
  // Cookie award animation should NOT appear
  expect(screen.queryByTestId("cookie-award")).not.toBeInTheDocument();
});
