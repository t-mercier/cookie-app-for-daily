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
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
          }}
        >
          <span style={{ fontSize: "6rem" }}>🐹🍪</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
