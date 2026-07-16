export function VEBoard() {
  const dashboardUrl = "https://tomtom.atlassian.net/jira/dashboards/40143";

  return (
    <div className="box" data-testid="ve-board">
      <div className="box-label">VE BOARD</div>
      <p className="jira-note" style={{ margin: "8px 0", fontSize: "12px", color: "var(--ink)" }}>
        JIRA CAN'T BE EMBEDDED HERE.
      </p>
      <a
        href={dashboardUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="manage-button"
        style={{ textAlign: "center", textDecoration: "none", display: "block" }}
      >
        ► OPEN IN BROWSER
      </a>
    </div>
  );
}
