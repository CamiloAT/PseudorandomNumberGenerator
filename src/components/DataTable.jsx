import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

export default function DataTable({ data, method }) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 20;
  const pageCount = Math.ceil(data.length / rowsPerPage);

  const start = page * rowsPerPage;
  const visibleData = data.slice(start, start + rowsPerPage);

  // Helper for Tooltip Header
  const TooltipHeader = ({ title, desc, alignRight }) => (
    <th className="px-6 py-4 relative group cursor-help transition-colors hover:bg-slate-800">
      <div className="flex items-center gap-1 w-max">
        {title} <Info className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
      </div>
      <div className={`absolute top-full ${alignRight ? 'right-6' : 'left-6'} mt-2 hidden group-hover:block w-max max-w-xs bg-slate-800 text-xs text-indigo-50 p-3 rounded-lg shadow-xl shadow-black/50 border border-indigo-500/30 z-[100] whitespace-normal normal-case font-normal text-left pointer-events-none`}>
        {desc}
      </div>
    </th>
  );

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl flex flex-col h-[650px]">
      <div className="p-5 border-b border-slate-700 font-semibold text-slate-200">
        <h3 className="text-lg">Números Generados</h3>
      </div>
      
      <div className="flex-1 overflow-auto overflow-x-hidden p-0 relative custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-300 bg-slate-900 border-b border-slate-700 sticky top-0 z-10 uppercase tracking-wider">
            <tr>
              <TooltipHeader title="i" desc="Número de iteración actual" />
              {method !== 'MS' && <TooltipHeader title="Xi" desc="Valor de la semilla en esta iteración" />}
              {method === 'MS' && (
                <>
                  <TooltipHeader title="Xi" desc="Valor de la semilla en esta iteración" />
                  <TooltipHeader title="Xi²" desc="Cuadrado de la semilla (rellenado con ceros a la izquierda si es necesario)" />
                </>
              )}
              <TooltipHeader 
                title="Ri" 
                desc={`Número pseudoaleatorio (0-1). Fórmula: Ri = X(i+1) / ${method === 'MS' ? '10^D' : 'm'}`} 
                alignRight
              />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {visibleData.map((row, index) => (
                <motion.tr 
                  key={row.i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-3 text-slate-400">{row.i}</td>
                  {method !== 'MS' && <td className="px-6 py-3 font-medium text-slate-300">{row.xi}</td>}
                  {method === 'MS' && (
                    <>
                      <td className="px-6 py-3 font-medium text-slate-300">{row.xi}</td>
                      <td className="px-6 py-3 font-mono text-xs text-slate-400">{row.squared}</td>
                    </>
                  )}
                  <td className="px-6 py-3 font-semibold text-indigo-300 bg-indigo-500/5">{row.ri.toFixed(5)}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-800 rounded-b-2xl flex justify-between items-center text-sm">
        <span className="text-slate-400">
          Mostrando {start + 1} - {Math.min(start + rowsPerPage, data.length)} de {data.length}
        </span>
        <div className="flex gap-2">
          <button 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg bg-slate-700 text-slate-300 disabled:opacity-50 hover:bg-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            disabled={page >= pageCount - 1}
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg bg-slate-700 text-slate-300 disabled:opacity-50 hover:bg-slate-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}