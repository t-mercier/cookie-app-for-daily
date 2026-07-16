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

test("updateMember maps avatarKey to avatar_key and includes only provided fields", async () => {
  let updatePayload: Record<string, unknown> | null = null;
  const client = {
    from: (table: string) => {
      if (table === "members") {
        return {
          update: (payload: Record<string, unknown>) => {
            updatePayload = payload;
            return {
              eq: () => Promise.resolve({ error: null }),
            };
          },
        };
      }
      return {} as never;
    },
  } as never;
  const api = createCookiesApi(client);
  await api.updateMember("m1", { name: "Bob", avatarKey: "dog" });
  expect(updatePayload).toEqual({ name: "Bob", avatar_key: "dog" });
});

test("updateMember with name only sends only name", async () => {
  let updatePayload: Record<string, unknown> | null = null;
  const client = {
    from: (table: string) => {
      if (table === "members") {
        return {
          update: (payload: Record<string, unknown>) => {
            updatePayload = payload;
            return {
              eq: () => Promise.resolve({ error: null }),
            };
          },
        };
      }
      return {} as never;
    },
  } as never;
  const api = createCookiesApi(client);
  await api.updateMember("m1", { name: "Charlie" });
  expect(updatePayload).toEqual({ name: "Charlie" });
});

test("updateMember with avatar only sends only avatar_key", async () => {
  let updatePayload: Record<string, unknown> | null = null;
  const client = {
    from: (table: string) => {
      if (table === "members") {
        return {
          update: (payload: Record<string, unknown>) => {
            updatePayload = payload;
            return {
              eq: () => Promise.resolve({ error: null }),
            };
          },
        };
      }
      return {} as never;
    },
  } as never;
  const api = createCookiesApi(client);
  await api.updateMember("m1", { avatarKey: "fish" });
  expect(updatePayload).toEqual({ avatar_key: "fish" });
});

test("updateMember with empty fields does not call client", async () => {
  let updateCalled = false;
  const client = {
    from: () => ({
      update: () => {
        updateCalled = true;
        return { eq: () => Promise.resolve({ error: null }) };
      },
    }),
  } as never;
  const api = createCookiesApi(client);
  await api.updateMember("m1", {});
  expect(updateCalled).toBe(false);
});

test("updateMember throws on Supabase error", async () => {
  const client = {
    from: () => ({
      update: () => ({
        eq: () => Promise.resolve({ error: { message: "update failed" } }),
      }),
    }),
  } as never;
  const api = createCookiesApi(client);
  await expect(api.updateMember("m1", { name: "Dave" })).rejects.toThrow(
    "update failed"
  );
});

test("removeCookie deletes the most recent cookie for a member", async () => {
  let deletedId: string | null = null;
  const client = {
    from: (table: string) => {
      if (table === "cookies") {
        return {
          select: () => ({
            eq: () => ({
              order: () => ({
                limit: () =>
                  Promise.resolve({
                    data: [{ id: "c42" }],
                    error: null,
                  }),
              }),
            }),
          }),
          delete: () => ({
            eq: (field: string, value: string) => {
              if (field === "id" && value === "c42") {
                deletedId = value;
              }
              return Promise.resolve({ error: null });
            },
          }),
        };
      }
      return {} as never;
    },
  } as never;
  const api = createCookiesApi(client);
  await api.removeCookie("m1");
  expect(deletedId).toBe("c42");
});

test("removeCookie is a no-op if member has no cookies", async () => {
  let deleteCalled = false;
  const client = {
    from: (table: string) => {
      if (table === "cookies") {
        return {
          select: () => ({
            eq: () => ({
              order: () => ({
                limit: () =>
                  Promise.resolve({
                    data: [],
                    error: null,
                  }),
              }),
            }),
          }),
          delete: () => {
            deleteCalled = true;
            return {
              eq: () => Promise.resolve({ error: null }),
            };
          },
        };
      }
      return {} as never;
    },
  } as never;
  const api = createCookiesApi(client);
  await api.removeCookie("m1");
  expect(deleteCalled).toBe(false);
});

test("removeCookie throws on Supabase error", async () => {
  const client = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () =>
              Promise.resolve({
                data: [{ id: "c42" }],
                error: null,
              }),
          }),
        }),
      }),
      delete: () => ({
        eq: () =>
          Promise.resolve({ error: { message: "delete failed" } }),
      }),
    }),
  } as never;
  const api = createCookiesApi(client);
  await expect(api.removeCookie("m1")).rejects.toThrow("delete failed");
});
