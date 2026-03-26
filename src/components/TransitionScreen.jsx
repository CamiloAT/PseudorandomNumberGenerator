import React from 'react';
import { motion } from 'framer-motion';
import { Settings2 } from 'lucide-react';

export default function TransitionScreen() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center fixed inset-0 z-[1000] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 1.1] }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="flex flex-col items-center justify-center gap-6"
      >
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
           <Settings2 className="w-20 h-20 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        </motion.div>
        <div className="text-2xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-[0.3em]">
          INICIALIZANDO...
        </div>
      </motion.div>
    </div>
  );
}
