import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Beaker, ChevronDown } from 'lucide-react';

const TestCard = ({ title, passed, stats, details }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${passed ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
      <div 
        className={`p-5 flex items-center justify-between cursor-pointer ${passed ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-rose-500/5 hover:bg-rose-500/10'}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {passed ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-200">{title}</h4>
            <p className={`text-sm font-medium ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {passed ? 'No se rechaza la Hipótesis Nula (Cumple)' : 'Se rechaza la Hipótesis Nula (No Cumple)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm text-slate-400">
            {stats.map((stat, i) => (
              <span key={i}>
                <strong className="text-slate-200">{stat.label}:</strong> {stat.value}
              </span>
            ))}
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-700/50 bg-slate-900/50"
          >
            <div className="p-6 overflow-auto">
              {details}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function TestResults({ tests }) {
  const { chiSquare, ks, poker } = tests;

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-300">
        <Beaker className="w-6 h-6" /> Pruebas de Uniformidad e Independencia
      </h3>

      <div className="space-y-4">
        {/* Chi-Cuadrado */}
        <TestCard 
          title="Prueba de Chi-Cuadrado (χ²)"
          passed={chiSquare.passed}
          stats={[
            { label: 'χ² Calculado', value: chiSquare.chiSquare.toFixed(4) },
            { label: 'χ² Crítico', value: chiSquare.criticalValue.toFixed(4) },
            { label: 'Grados Libertad', value: chiSquare.df }
          ]}
          details={
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-2">Intervalo</th>
                  <th className="px-4 py-2">Observado (Oi)</th>
                  <th className="px-4 py-2">Esperado (Ei)</th>
                  <th className="px-4 py-2">(Oi-Ei)²/Ei</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {chiSquare.observations.map((obs, i) => (
                  <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-2">{obs.bin}</td>
                    <td className="px-4 py-2">{obs.observed}</td>
                    <td className="px-4 py-2">{obs.expected}</td>
                    <td className="px-4 py-2 text-indigo-300">{obs.value.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        />

        {/* Kolmogorov-Smirnov */}
        <TestCard 
          title="Prueba Kolmogorov-Smirnov (K-S)"
          passed={ks.passed}
          stats={[
            { label: 'D Mayor', value: ks.dMax.toFixed(5) },
            { label: 'D Crítico', value: ks.criticalValue.toFixed(5) }
          ]}
          details={
             <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800 border-b border-slate-700 sticky top-0">
                  <tr>
                    <th className="px-4 py-2">i</th>
                    <th className="px-4 py-2">Ri</th>
                    <th className="px-4 py-2">F(X) = i/N</th>
                    <th className="px-4 py-2">D+</th>
                    <th className="px-4 py-2">D-</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {ks.data.map((d) => (
                    <tr key={d.i} className={`hover:bg-slate-800/50 transition-colors ${d.maxLocalD === ks.dMax ? 'bg-amber-500/10' : ''}`}>
                      <td className="px-4 py-2">{d.i}</td>
                      <td className="px-4 py-2">{d.ri.toFixed(4)}</td>
                      <td className="px-4 py-2">{d.fn.toFixed(4)}</td>
                      <td className="px-4 py-2">{d.dp.toFixed(4)}</td>
                      <td className="px-4 py-2">{d.dm.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        />

        {/* Poker */}
        <TestCard 
          title="Prueba de Póker"
          passed={poker.passed}
          stats={[
            { label: 'χ² Calculado', value: poker.chiSquare.toFixed(4) },
            { label: 'χ² Crítico', value: poker.criticalValue.toFixed(4) },
            { label: 'Grados Libertad', value: poker.df }
          ]}
          details={
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-2">Categoría</th>
                  <th className="px-4 py-2">Oi</th>
                  <th className="px-4 py-2">Ei</th>
                  <th className="px-4 py-2">(Oi-Ei)²/Ei</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {poker.observations.map((obs, i) => (
                  <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-2 font-medium">{obs.category}</td>
                    <td className="px-4 py-2">{obs.observed}</td>
                    <td className="px-4 py-2">{obs.expected.toFixed(2)}</td>
                    <td className="px-4 py-2 text-indigo-300">{obs.value.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        />
      </div>
    </div>
  );
}