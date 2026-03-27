import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, BookOpen, FileText } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 30 }}
            className="bg-slate-900 border border-indigo-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.2)] max-w-2xl w-full relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Información del Proyecto
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200 mb-4">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> Asignatura
                </h3>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <p className="text-slate-300 font-medium">SIMULACIÓN DE COMPUTADORES</p>
                  <p className="text-slate-400 mt-1"><strong>Código:</strong> 8108278 | <strong>Grupo:</strong> 2-0</p>
                  <p className="text-slate-400 mt-1"><strong>Docente:</strong> Ing. JOSE OSBALDO ROJAS MORENO</p>
                  <div className="mt-4 inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-sm font-semibold border border-indigo-500/30">
                    Proyecto del 1er 50%
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200 mb-4">
                  <Users className="w-5 h-5 text-cyan-400" /> Integrantes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                    <p className="font-bold text-slate-200 text-lg mb-1">Camilo Andres<br/>Arias Tenjo</p>
                    <p className="text-slate-400 text-sm">Código: 202210549</p>
                    <p className="text-cyan-400 text-sm mt-2 truncate">camilo.arias@uptc.edu.co</p>
                  </div>
                  <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-colors">
                    <p className="font-bold text-slate-200 text-lg mb-1">Jose Ortega<br/>Luis Castillo</p>
                    <p className="text-slate-400 text-sm">Código: 202210773</p>
                    <p className="text-cyan-400 text-sm mt-2 truncate">jose.ortega01@uptc.edu.co</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200 mb-4">
                  <FileText className="w-5 h-5 text-emerald-400" /> Documentación y Manuales
                </h3>
                <a 
                  href="https://docs.google.com/document/d/1iZHUzVeRkD2zG4jbmzTSvAfHUOksLigk/edit" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-4 bg-slate-800/50 hover:bg-emerald-500/10 p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all group"
                >
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-emerald-400 font-bold text-lg group-hover:text-emerald-300 transition-colors">Manual de Usuario</h4>
                    <p className="text-slate-400 text-sm mt-1">Haz clic aquí para leer la guía completa de uso, características y teoría del proyecto.</p>
                  </div>
                </a>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}