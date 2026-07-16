import "./ResetConfirm.css";

export function ResetConfirm({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="reset-confirm-overlay">
      <div className="reset-confirm-box box">
        <div className="reset-title">RESET ALL COOKIES?</div>
        <div className="reset-warning">THIS CAN'T BE UNDONE.</div>
        <div className="reset-buttons">
          <button
            className="pixel-button danger"
            onClick={onConfirm}
            data-testid="reset-confirm-yes"
          >
            YES, RESET
          </button>
          <button
            className="pixel-button"
            onClick={onCancel}
            data-testid="reset-confirm-cancel"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
