import { AnimatePresence, motion } from "framer-motion";

export function CookieAward({
  show,
  onDone,
}: {
  show: boolean;
  onDone: () => void;
}) {
  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          data-testid="cookie-award"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
          transition={{
            scale: { type: "spring", stiffness: 460, damping: 11 },
            opacity: { duration: 0.15 },
          }}
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            imageRendering: "pixelated",
          }}
        >
          <span style={{ fontSize: "5rem", textShadow: "4px 4px 0 #000" }}>🍪</span>
          <span className="arcade-title" style={{ position: "absolute", bottom: "20%" }}>
            +1 COOKIE!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
