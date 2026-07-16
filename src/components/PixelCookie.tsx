export function PixelCookie({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      shape-rendering="crispEdges"
      style={{ display: "inline-block", verticalAlign: "middle" }}
      aria-hidden="true"
    >
      {/* crust #a5651f */}
      <rect x="2" y="0" width="4" height="1" fill="#a5651f" />
      <rect x="1" y="1" width="1" height="1" fill="#a5651f" />
      <rect x="6" y="1" width="1" height="1" fill="#a5651f" />
      <rect x="0" y="2" width="1" height="4" fill="#a5651f" />
      <rect x="7" y="2" width="1" height="4" fill="#a5651f" />
      <rect x="1" y="6" width="1" height="1" fill="#a5651f" />
      <rect x="6" y="6" width="1" height="1" fill="#a5651f" />
      <rect x="2" y="7" width="4" height="1" fill="#a5651f" />
      {/* dough #e8b855 */}
      <rect x="2" y="1" width="4" height="1" fill="#e8b855" />
      <rect x="1" y="2" width="6" height="4" fill="#e8b855" />
      <rect x="2" y="6" width="4" height="1" fill="#e8b855" />
      {/* chips #5c2e0e */}
      <rect x="3" y="2" width="1" height="1" fill="#5c2e0e" />
      <rect x="5" y="3" width="1" height="1" fill="#5c2e0e" />
      <rect x="2" y="4" width="1" height="1" fill="#5c2e0e" />
      <rect x="4" y="5" width="1" height="1" fill="#5c2e0e" />
    </svg>
  );
}
