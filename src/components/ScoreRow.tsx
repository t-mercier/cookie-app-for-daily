import { useState, useEffect } from "react";
import type { BoardMember } from "../types";
import { Sprite } from "./Sprite";
import { PixelCookie } from "./PixelCookie";
import { formatScore } from "../logic/score";
import "./ScoreRow.css";

export function ScoreRow({
  member,
  onAward,
  isNeedy,
}: {
  member: BoardMember;
  onAward: (id: string) => void;
  isNeedy?: boolean;
}) {
  const [awarding, setAwarding] = useState(false);

  useEffect(() => {
    if (!awarding) return;
    const timer = setTimeout(() => {
      setAwarding(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [awarding]);

  const handleClick = () => {
    setAwarding(true);
    onAward(member.id);
  };

  return (
    <button
      type="button"
      data-testid={`row-${member.id}`}
      data-lagging={member.isLagging}
      onClick={handleClick}
      className="score-row"
      style={{ position: "relative" }}
    >
      <Sprite avatarKey={member.avatarKey} size={32} />
      <span className="name">{member.name}</span>
      {isNeedy && (
        <span role="status" className="warn needs-cookies">NEEDS COOKIES!</span>
      )}
      <span className="score"><PixelCookie size={15} /> {formatScore(member.cookieCount)}</span>

      {awarding && (
        <div data-testid={`cookie-fly-${member.id}`} className="cookie-fly">
          <PixelCookie size={22} />
        </div>
      )}
    </button>
  );
}
