import { useState, useMemo } from "react";
import type { Member } from "../types";
import { AVATAR_KEYS, bundledAvatarIds } from "../avatars";
import { Sprite } from "./Sprite";

export function CharacterSelect({
  open,
  onClose,
  members,
  onAdd,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  members: Member[];
  onAdd: (name: string, avatarKey: string) => void | Promise<void>;
  onRemove: (id: string) => void | Promise<void>;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string>(AVATAR_KEYS[0]);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const bundled = useMemo(() => bundledAvatarIds(), []);
  const allAvatarIds = useMemo(() => [...bundled, ...AVATAR_KEYS], [bundled]);

  if (!open) return null;

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    // If imageUrl is set, use it; otherwise use selected
    const avatarKey = imageUrl.trim() || selected;
    try {
      await Promise.resolve(onAdd(trimmed, avatarKey));
      setName("");
      setImageUrl("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "COULD NOT ADD");
    }
  }

  async function handleRemove(id: string) {
    setError(null);
    try {
      await Promise.resolve(onRemove(id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "COULD NOT REMOVE");
    }
  }

  return (
    <div className="crt character-select" data-testid="character-select"
         style={{ position: "fixed", inset: 0, overflow: "auto" }}>
      <h1 className="arcade-title">SELECT YOUR CHARACTER</h1>
      <div className="pixel-panel" style={{ maxWidth: 640, margin: "0 auto" }}>
        <div className="sprite-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {allAvatarIds.map((key) => (
            <button
              key={key}
              type="button"
              data-testid={`pick-${key}`}
              aria-pressed={selected === key && !imageUrl}
              className={selected === key && !imageUrl ? "pixel-button selected" : "pixel-button"}
              onClick={() => {
                setSelected(key);
                setImageUrl("");
              }}
            >
              <Sprite avatarKey={key} size={40} />
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
          <label htmlFor="cs-name">NAME</label>
          <input id="cs-name" className="pixel-input" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="button" className="pixel-button" onClick={handleAdd}>START</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
          <label htmlFor="cs-url">IMAGE URL</label>
          <input
            id="cs-url"
            className="pixel-input"
            placeholder="https://..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        {error && <p role="alert" className="error-text">{error}</p>}

        <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
          {members.map((member) => (
            <li key={member.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Sprite avatarKey={member.avatarKey} size={24} />
              <span>{member.name}</span>
              <button type="button" className="pixel-button" aria-label={`Remove ${member.name}`}
                      onClick={() => void handleRemove(member.id)}>✕</button>
            </li>
          ))}
        </ul>

        <button type="button" className="pixel-button" style={{ marginTop: 16 }} onClick={onClose}>CLOSE</button>
      </div>
    </div>
  );
}
