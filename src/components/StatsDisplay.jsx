import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart2, RefreshCcw, Info } from 'lucide-react';

export default function StatsDisplay({ statsRi, statsXi, period, n }) {
  const isFullPeriod = period === n;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Media */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm text-slate-400 font-medium tracking-wider">MEDIA (μ)</p>
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <Activity className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 divide-x divide-slate-700">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold">Ri (0-1)</p>
            <h3 className="text-2xl font-bold bg-gradient-to-br from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
              {statsRi.mean.toFixed(4)}
            </h3>
          </div>
          <div className="pl-4">
            <p className="text-xs text-slate-500 mb-1 font-semibold">Xi (Semilla)</p>
            <h3 className="text-xl font-bold bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-transparent">
              {statsXi.mean.toFixed(2)}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Varianza */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm text-slate-400 font-medium tracking-wider">VARIANZA (σ²)</p>
          <div className="p-2 bg-cyan-500/10 rounded-xl">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 divide-x divide-slate-700">
          <div>
            <p className="text-xs text-slate-500 mb-1 font-semibold">Ri (0-1)</p>
            <h3 className="text-2xl font-bold bg-gradient-to-br from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
              {statsRi.variance.toFixed(4)}
            </h3>
          </div>
          <div className="pl-4">
            <p className="text-xs text-slate-500 mb-1 font-semibold">Xi (Semilla)</p>
            <h3 className="text-xl font-bold bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-transparent">
              {statsXi.variance.toFixed(1)}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Periodo */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-1 relative group cursor-help transition-colors w-max">
            <p className="text-sm text-slate-400 font-medium tracking-wider group-hover:text-emerald-400 transition-colors">PERIODO (P)</p>
            <Info className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            <div className="absolute top-full right-0 md:left-0 mt-2 hidden group-hover:block w-56 bg-slate-800 text-xs text-indigo-50 p-3 rounded-lg shadow-xl shadow-black/50 border border-emerald-500/30 z-[100] whitespace-normal normal-case font-normal text-left pointer-events-none">
              {isFullPeriod 
                ? "El generador ha originado todos los valores posibles antes de volver a empezar el ciclo." 
                : "La secuencia comenzó a repetirse prematuramente, sin agotar todos los valores posibles."}
            </div>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <RefreshCcw className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <div className="flex flex-col justify-center flex-1">
          <h3 className="text-3xl font-bold bg-gradient-to-br from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
            {period}
          </h3>
          <p className={`text-sm mt-1 font-medium ${isFullPeriod ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isFullPeriod ? 'Longitud completa (sin repeticiones)' : 'Ciclo de repeticion detectado'}
          </p>
        </div>
      </motion.div>

    </div>
  );
}