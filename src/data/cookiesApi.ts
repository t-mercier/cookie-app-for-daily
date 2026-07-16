import type { SupabaseClient } from "@supabase/supabase-js";
import type { Member } from "../types";
import { supabase } from "./supabaseClient";

export function createCookiesApi(client: SupabaseClient) {
  return {
    async getMembers(): Promise<Member[]> {
      const { data, error } = await client
        .from("members")
        .select("id, name, avatar_key")
        .order("created_at", { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        avatarKey: row.avatar_key,
      }));
    },

    async getCookieCounts(): Promise<Record<string, number>> {
      const { data, error } = await client.from("cookies").select("member_id");
      if (error) throw new Error(error.message);
      const counts: Record<string, number> = {};
      for (const row of data ?? []) {
        counts[row.member_id] = (counts[row.member_id] ?? 0) + 1;
      }
      return counts;
    },

    async awardCookie(memberId: string): Promise<void> {
      const { error } = await client
        .from("cookies")
        .insert({ member_id: memberId });
      if (error) throw new Error(error.message);
    },

    async addMember(name: string, avatarKey: string): Promise<Member> {
      const { data, error } = await client
        .from("members")
        .insert({ name, avatar_key: avatarKey })
        .select("id, name, avatar_key")
        .single();
      if (error) throw new Error(error.message);
      return { id: data.id, name: data.name, avatarKey: data.avatar_key };
    },

    async removeMember(id: string): Promise<void> {
      const { error } = await client.from("members").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },

    async updateMember(
      id: string,
      fields: { name?: string; avatarKey?: string }
    ): Promise<void> {
      const payload: Record<string, unknown> = {};
      if (fields.name !== undefined) payload.name = fields.name;
      if (fields.avatarKey !== undefined) payload.avatar_key = fields.avatarKey;
      if (Object.keys(payload).length === 0) return;
      const { error } = await client
        .from("members")
        .update(payload)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },

    async removeCookie(memberId: string): Promise<void> {
      const { data, error: selectError } = await client
        .from("cookies")
        .select("id")
        .eq("member_id", memberId)
        .order("awarded_at", { ascending: false })
        .limit(1);
      if (selectError) throw new Error(selectError.message);
      if (!data || data.length === 0) return;
      const cookieId = data[0].id;
      const { error } = await client.from("cookies").delete().eq("id", cookieId);
      if (error) throw new Error(error.message);
    },

    subscribeToChanges(onChange: () => void): () => void {
      const channel = client
        .channel("ve-cookie-board")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "cookies" },
          onChange
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "members" },
          onChange
        )
        .subscribe();
      return () => {
        client.removeChannel(channel);
      };
    },
  };
}

export const cookiesApi = createCookiesApi(supabase);
export type CookiesApi = ReturnType<typeof createCookiesApi>;
