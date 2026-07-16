import { useState } from "react";
import type { Member } from "../types";
import { Sprite } from "./Sprite";
import { PixelCookie } from "./PixelCookie";

export function CharacterSelect({
  open,
  onClose,
  members,
  onAdd,
  onRemove,
  cookieCounts,
  onAward,
  onRemoveCookie,
  onUpdateMember,
  inline = false,
}: {
  open: boolean;
  onClose: () => void;
  members: Member[];
  onAdd: (name: string, avatarKey: string) => void | Promise<void>;
  onRemove: (id: string) => void | Promise<void>;
  cookieCounts: Record<string, number>;
  onAward: (id: string) => void | Promise<void>;
  onRemoveCookie: (id: string) => void | Promise<void>;
  onUpdateMember: (id: string, fields: { name?: string; avatarKey?: string }) => void | Promise<void>;
  inline?: boolean;
}) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  if (!open) return null;

  async function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setError(null);
    const url = imageUrl.trim();
    try {
      await Promise.resolve(onAdd(trimmed, url));
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

  function startEdit(member: Member) {
    setEditingId(member.id);
    setEditName(member.name);
    setEditImageUrl(member.avatarKey);
  }

  async function handleUpdateMember() {
    const trimmedName = editName.trim();
    if (!trimmedName) return;
    setError(null);
    try {
      const updates: { name?: string; avatarKey?: string } = {};
      // Only include changed fields
      if (editName.trim() !== members.find((m) => m.id === editingId)?.name) {
        updates.name = trimmedName;
      }
      if (editImageUrl !== members.find((m) => m.id === editingId)?.avatarKey) {
        updates.avatarKey = editImageUrl;
      }
      // Only call if there are changes
      if (Object.keys(updates).length > 0) {
        await Promise.resolve(onUpdateMember(editingId!, updates));
      }
      setEditingId(null);
      setEditName("");
      setEditImageUrl("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "COULD NOT UPDATE");
    }
  }

  async function handleAward(id: string) {
    setError(null);
    try {
      await Promise.resolve(onAward(id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "COULD NOT AWARD");
    }
  }

  async function handleRemoveCookie(id: string) {
    setError(null);
    try {
      await Promise.resolve(onRemoveCookie(id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "COULD NOT REMOVE COOKIE");
    }
  }

  return (
    <div
      className={`crt${!inline ? " character-select" : ""}`}
      data-testid="character-select"
      style={!inline ? { position: "fixed", inset: 0, overflow: "auto" } : undefined}
    >
      {!inline && <h1 className="arcade-title">SELECT YOUR CHARACTER</h1>}
      <div className={inline ? "box" : "pixel-panel"} style={!inline ? { maxWidth: 640, margin: "0 auto" } : undefined}>
        <div style={{ display: "flex", gap: 8, marginTop: 0, flexWrap: "wrap", alignItems: "center" }}>
          <label htmlFor="cs-name">NAME</label>
          <input id="cs-name" className="pixel-input" value={name} onChange={(e) => setName(e.target.value)} />
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

        <div style={{ marginTop: 12 }}>
          <button type="button" className="pixel-button" onClick={handleAdd}>START</button>
        </div>
        {error && <p role="alert" className="error-text">{error}</p>}

        <h2 style={{ marginTop: 24, marginBottom: 12, fontSize: 12, color: "var(--text-light)" }}>MANAGE PLAYERS</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {members.map((member) => {
            const isEditing = editingId === member.id;
            const count = cookieCounts[member.id] ?? 0;
            return (
              <li key={member.id} style={{ marginBottom: 12, padding: 8, background: "var(--bg-dark)", borderRadius: 4 }}>
                {isEditing ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <label htmlFor={`edit-name-${member.id}`}>NAME</label>
                      <input
                        id={`edit-name-${member.id}`}
                        className="pixel-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <label htmlFor={`edit-url-${member.id}`}>IMAGE URL</label>
                      <input
                        id={`edit-url-${member.id}`}
                        className="pixel-input"
                        placeholder="https://..."
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" className="pixel-button" onClick={handleUpdateMember}>SAVE</button>
                      <button type="button" className="pixel-button" onClick={() => setEditingId(null)}>CANCEL</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                      <Sprite avatarKey={member.avatarKey} size={24} />
                      <span>{member.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <span><PixelCookie size={12} /> x{count}</span>
                      <button type="button" className="pixel-button" aria-label={`Give cookie to ${member.name}`}
                              onClick={() => void handleAward(member.id)}>+</button>
                      <button type="button" className="pixel-button" aria-label={`Remove cookie from ${member.name}`}
                              onClick={() => void handleRemoveCookie(member.id)}>−</button>
                    </div>
                    <button type="button" className="pixel-button" onClick={() => startEdit(member)}>EDIT</button>
                    <button type="button" className="pixel-button" aria-label={`Remove ${member.name}`}
                            onClick={() => void handleRemove(member.id)}>✕</button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {!inline && <button type="button" className="pixel-button" style={{ marginTop: 16 }} onClick={onClose}>CLOSE</button>}
      </div>
    </div>
  );
}
