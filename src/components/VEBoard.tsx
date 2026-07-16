export function VEBoard() {
  const dashboardUrl = "https://tomtom.atlassian.net/jira/dashboards/40143";

  return (
    <div className="box" data-testid="ve-board">
      <div className="box-label">VE BOARD</div>
      <p className="jira-note" style={{ margin: "8px 0", fontSize: "12px", color: "var(--ink)" }}>
        IF THE BOARD STAYS BLANK, JIRA REFUSES EMBEDDING.
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
      <iframe
        src={dashboardUrl}
        title="Jira dashboard"
        style={{
          width: "100%",
          height: "60vh",
          border: "3px solid var(--border)",
          borderRadius: "4px",
          marginTop: "12px",
          backgroundColor: "var(--screen)",
        }}
      />
    </div>
  );
}
