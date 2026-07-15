import { useState, type ReactNode, type FormEvent } from "react";

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
    <form onSubmit={handleSubmit}>
      <h1>VE Cookie Board</h1>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError(false);
        }}
      />
      <button type="submit">Unlock</button>
      {error && <p role="alert">Wrong password</p>}
    </form>
  );
}
