import { motion } from "framer-motion";

export default function AnimatedWrapper({ children, initial, animate, transition }) {
  return (
    <motion.div
      initial={initial || { opacity: 0, y: 10 }}
      animate={animate || { opacity: 1, y: 0 }}
      transition={transition || { duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
