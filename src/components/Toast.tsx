// components/Toast.tsx
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  text: string;
  onClose: () => void;
}

export default function Toast({ text, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2
            px-4 py-2 rounded-xl
            bg-[#0f1a2f] text-cyan-300 
            border border-cyan-500/50 shadow-[0_0_12px_rgba(0,255,255,0.5)] 
            backdrop-blur-md"
        >
          {text}
          <button onClick={onClose} className="absolute top-0 right-0 text-cyan-500">X</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
