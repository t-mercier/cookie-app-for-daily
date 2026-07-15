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
    getMembers: async () => [{ id: "a", name: "Ann", avatarKey: "cat" }],
    getCookieCounts: async () => ({ a: awarded }),
    awardCookie: async () => { awarded += 1; },
    addMember: async () => ({ id: "x", name: "X", avatarKey: "cat" }),
    removeMember: async () => {},
    subscribeToChanges: () => () => {},
  } as CookiesApi;
}

test("unlock, see board, award a cookie", async () => {
  render(<App api={fakeApi()} />);
  await userEvent.type(screen.getByLabelText(/password/i), "secret");
  await userEvent.click(screen.getByRole("button", { name: /unlock/i }));

  await waitFor(() => expect(screen.getAllByText("Ann")[0]).toBeInTheDocument());
  await userEvent.click(screen.getByTestId("card-a"));
  expect(screen.getByTestId("cookie-award")).toBeInTheDocument();
});
