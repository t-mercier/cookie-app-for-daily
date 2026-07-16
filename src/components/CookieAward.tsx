import { PixelCookie } from "./PixelCookie";
import "./CookieAward.css";

export function CookieAward({
  memberName,
}: {
  memberName: string;
}) {
  return (
    <div
      data-testid="cookie-award"
      className="cookie-award-dialog"
    >
      <div className="box dialog-box">
        <div className="dl dl-1">{memberName.toUpperCase()} LED THE DAILY!</div>
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
