"use client";

import { motion } from "framer-motion";

export default function Particles({ particles }: { particles: any[] }) {
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            scale: 0.3,
            x: p.x + "%",
            y: p.y + "%",
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.3, 1.4],
          }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute w-2 h-2 rounded-full
                     bg-cyan-400 shadow-[0_0_12px_4px_rgba(0,200,255,0.7)]"
        />
      ))}
    </>
  );
}
