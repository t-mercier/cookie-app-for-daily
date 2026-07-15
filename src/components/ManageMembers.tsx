import { useState } from "react";
import type { Member } from "../types";
import { AVATAR_KEYS } from "../avatars";

export function ManageMembers({
  members,
  onAdd,
  onRemove,
}: {
  members: Member[];
  onAdd: (name: string, avatarKey: string) => void | Promise<void>;
  onRemove: (id: string) => void | Promise<void>;
}) {
  const [name, setName] = useState("");
  const [avatarKey, setAvatarKey] = useState<string>(AVATAR_KEYS[0]);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    try {
      await Promise.resolve(onAdd(trimmed, avatarKey));
      setName("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not add member, try again");
    }
  }

  async function handleRemove(id: string) {
    setError(null);
    try {
      await Promise.resolve(onRemove(id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not remove member, try again");
    }
  }

  return (
    <section>
      <h2>Manage members</h2>
      {error && <p role="alert">{error}</p>}
      <label htmlFor="member-name">Name</label>
      <input id="member-name" value={name} onChange={(e) => setName(e.target.value)} />

      <label htmlFor="member-avatar">Avatar</label>
      <select
        id="member-avatar"
        value={avatarKey}
        onChange={(e) => setAvatarKey(e.target.value)}
      >
        {AVATAR_KEYS.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      <button type="button" onClick={handleAdd}>
        Add
      </button>

      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name}
            <button
              type="button"
              aria-label={`Remove ${member.name}`}
              onClick={() => void handleRemove(member.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
