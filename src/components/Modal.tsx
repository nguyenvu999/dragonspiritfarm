"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, onClose, children }: any) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 p-6 
                       bg-[#0e1630] border-t border-cyan-400/30 
                       rounded-t-2xl shadow-xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
