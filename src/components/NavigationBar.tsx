export function NavigationBar({
  active,
  onNavigate,
}: {
  active: "board" | "players" | "ve";
  onNavigate: (view: "board" | "players" | "ve") => void;
}) {
  return (
    <div className="nav-bar">
      <button
        type="button"
        className={`nav-button ${active === "board" ? "active" : ""}`}
        onClick={() => onNavigate("board")}
      >
        COOKIE BOARD
      </button>
      <button
        type="button"
        className={`nav-button ${active === "players" ? "active" : ""}`}
        onClick={() => onNavigate("players")}
      >
        EDIT PLAYERS
      </button>
      <button
        type="button"
        className={`nav-button ${active === "ve" ? "active" : ""}`}
        onClick={() => onNavigate("ve")}
      >
        VE BOARD
      </button>
    </div>
  );
}
