import { createCookiesApi } from "../cookiesApi";

function makeClientForCounts(rows: { member_id: string }[]) {
  return {
    from: () => ({
      select: () => Promise.resolve({ data: rows, error: null }),
    }),
  } as never;
}

test("getCookieCounts aggregates rows per member", async () => {
  const api = createCookiesApi(
    makeClientForCounts([
      { member_id: "a" },
      { member_id: "a" },
      { member_id: "b" },
    ])
  );
  const counts = await api.getCookieCounts();
  expect(counts).toEqual({ a: 2, b: 1 });
});

test("getMembers maps avatar_key to avatarKey", async () => {
  const client = {
    from: () => ({
      select: () =>
        Promise.resolve({
          data: [{ id: "a", name: "Ann", avatar_key: "cat" }],
          error: null,
        }),
    }),
  } as never;
  const api = createCookiesApi(client);
  const members = await api.getMembers();
  expect(members).toEqual([{ id: "a", name: "Ann", avatarKey: "cat" }]);
});

test("getCookieCounts throws on Supabase error", async () => {
  const client = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: "boom" } }),
    }),
  } as never;
  const api = createCookiesApi(client);
  await expect(api.getCookieCounts()).rejects.toThrow("boom");
});
