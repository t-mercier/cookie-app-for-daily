import { useEffect, useRef } from "react";
import { PixelCookie } from "./PixelCookie";
import "./CookieAward.css";

export function CookieAward({
  show,
  memberName,
  onDone,
}: {
  show: boolean;
  memberName?: string;
  onDone: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;

    // Reset animation by triggering reflow
    if (containerRef.current) {
      void containerRef.current.offsetHeight;
    }
  }, [show]);

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLDivElement>) => {
    // Only fire when the sequence animation completes, not child animations
    if (event.target === event.currentTarget) {
      onDone();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      data-testid="cookie-award"
      className="cookie-award-dialog active"
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="box dialog-box">
        <div className="dl dl-1">{(memberName ?? "SOMEONE").toUpperCase()} LED THE DAILY!</div>
        <div className="dl dl-2">GOOD JOB, BRAVE LITTLE ONE... *PAT PAT*</div>
        <div className="dl dl-3">
          HERE, HAVE A COOKIE!
          <PixelCookie size={18} />
        </div>
        <span className="adv">▼</span>
      </div>
    </div>
  );
}
