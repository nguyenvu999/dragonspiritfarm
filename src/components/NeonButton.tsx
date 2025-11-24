"use client";

import { motion } from "framer-motion";

export default function NeonButton({ children, onClick, variant = "primary" }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`
        w-full py-3 rounded-xl font-bold text-sm shadow-lg
        ${variant === "primary"
          ? "bg-cyan-400 text-black shadow-cyan-500/50"
          : "bg-[#222] text-cyan-300 border border-cyan-500/40"}
      `}
    >
      {children}
    </motion.button>
  );
}
