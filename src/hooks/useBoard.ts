import { useCallback, useEffect, useState } from "react";
import type { BoardMember, Member } from "../types";
import { computeBoard } from "../logic/board";
import type { CookiesApi } from "../data/cookiesApi";

export function useBoard(api: CookiesApi) {
  const [members, setMembers] = useState<Member[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [nextMembers, nextCounts] = await Promise.all([
        api.getMembers(),
        api.getCookieCounts(),
      ]);
      setMembers(nextMembers);
      setCounts(nextCounts);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void reload();
    try {
      const unsubscribe = api.subscribeToChanges(() => void reload());
      return unsubscribe;
    } catch {
      // Subscription failed (e.g., missing env vars), return no-op unsubscribe
      return () => {};
    }
  }, [api, reload]);

  const award = useCallback(
    async (memberId: string) => {
      setCounts((prev) => ({ ...prev, [memberId]: (prev[memberId] ?? 0) + 1 }));
      try {
        await api.awardCookie(memberId);
        setError(null);
      } catch (caught) {
        setCounts((prev) => ({
          ...prev,
          [memberId]: Math.max((prev[memberId] ?? 1) - 1, 0),
        }));
        setError(caught instanceof Error ? caught.message : String(caught));
      }
    },
    [api]
  );

  const removeCookie = useCallback(
    async (memberId: string) => {
      setCounts((prev) => ({
        ...prev,
        [memberId]: Math.max((prev[memberId] ?? 1) - 1, 0),
      }));
      try {
        await api.removeCookie(memberId);
        setError(null);
      } catch (caught) {
        setCounts((prev) => ({ ...prev, [memberId]: (prev[memberId] ?? 0) + 1 }));
        setError(caught instanceof Error ? caught.message : String(caught));
      }
    },
    [api]
  );

  const board: BoardMember[] = computeBoard(members, counts);
  return { board, loading, error, award, removeCookie, reload };
}
