import { motion } from "framer-motion";

export default function DragonDisplay() {
  return (
    <div className="glass p-6 rounded-2xl card-glow text-center">
      <motion.img
        src="/dragon.svg"
        alt="dragon"
        className="w-48 mx-auto drop-shadow-[0_0_18px_#7afcff]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="mt-2 text-sm text-cyan-200 opacity-80">
        Rồng Linh Thạch
      </div>
    </div>
  );
}
