import { useState, type ReactNode, type FormEvent } from "react";
import { PixelCookie } from "./PixelCookie";

const STORAGE_KEY = "ve-cookie-unlocked";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === "true"
  );
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (value === import.meta.env.VITE_APP_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
    }
  }

  return (
    <div className="crt">
      <div className="shell">
        <div className="screen">
          <h1>
            <PixelCookie size={22} />
            VE COOKIE BOARD
          </h1>
          <form className="box password-gate-panel" onSubmit={handleSubmit} style={{ maxWidth: 420, margin: "0 auto" }}>
            <label htmlFor="password">INSERT PASSWORD</label>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                id="password"
                className="pixel-input"
                type="password"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(false);
                }}
              />
              <button type="submit" className="pixel-button">UNLOCK</button>
            </div>
            {error && <p role="alert" className="error-text">WRONG PASSWORD</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
