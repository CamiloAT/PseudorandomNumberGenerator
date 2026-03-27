import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 text-center max-w-4xl px-6 flex flex-col items-center"
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="inline-block mb-6">
          <Sparkles className="w-24 h-24 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-linear-to-br from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
          Motor de Simulación
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-12 font-light leading-relaxed max-w-2xl">
          Generador de variables pseudoaleatorias y plataforma de validación estadística para pruebas de uniformidad e independencia.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(99, 102, 241, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="bg-linear-to-r from-indigo-600 to-cyan-600 px-10 py-5 rounded-full text-white font-bold text-xl flex items-center gap-3 transition-all outline-none border border-cyan-400/30 shadow-2xl"
        >
          <Play className="fill-current w-6 h-6" /> INICIAR ENTORNO
        </motion.button>
      </motion.div>
    </div>
  );
}