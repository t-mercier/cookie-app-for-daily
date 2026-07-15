import { renderHook, act, waitFor } from "@testing-library/react";
import { useBoard } from "../useBoard";
import type { CookiesApi } from "../../data/cookiesApi";

function makeApi(overrides: Partial<CookiesApi> = {}): CookiesApi {
  return {
    getMembers: async () => [{ id: "a", name: "Ann", avatarKey: "cat" }],
    getCookieCounts: async () => ({ a: 1 }),
    awardCookie: async () => {},
    addMember: async () => ({ id: "x", name: "X", avatarKey: "cat" }),
    removeMember: async () => {},
    subscribeToChanges: () => () => {},
    ...overrides,
  } as CookiesApi;
}

test("loads and computes the board", async () => {
  const { result } = renderHook(() => useBoard(makeApi()));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.board[0]).toMatchObject({ id: "a", cookieCount: 1 });
});

test("award optimistically increments then persists", async () => {
  let inserted = 0;
  const api = makeApi({ awardCookie: async () => { inserted += 1; } });
  const { result } = renderHook(() => useBoard(api));
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => { await result.current.award("a"); });
  expect(result.current.board.find((m) => m.id === "a")!.cookieCount).toBe(2);
  expect(inserted).toBe(1);
});

test("award rolls back and sets error on failure", async () => {
  const api = makeApi({
    awardCookie: async () => { throw new Error("network"); },
  });
  const { result } = renderHook(() => useBoard(api));
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => { await result.current.award("a"); });
  expect(result.current.board.find((m) => m.id === "a")!.cookieCount).toBe(1);
  expect(result.current.error).toBe("network");
});
