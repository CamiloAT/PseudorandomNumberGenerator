import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Beaker, ChevronDown, Info } from 'lucide-react';

const TestCard = ({ title, passed, stats, details, info }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border rounded-2xl transition-all duration-300 shadow-lg ${passed ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
      <div
        className={`p-5 flex items-center justify-between cursor-pointer rounded-2xl ${open ? 'rounded-b-none' : ''} ${passed ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-rose-500/5 hover:bg-rose-500/10'}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {passed ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 relative group w-max">
              <h4 className="text-lg font-bold text-slate-200">{title}</h4>
              {info && (
                <>
                  <Info className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-72 bg-slate-900 text-xs text-indigo-50 p-4 rounded-lg shadow-2xl shadow-black/50 border border-indigo-500/30 font-normal leading-relaxed pointer-events-none z-50">
                    {info}
                  </div>
                </>
              )}
            </div>
            <p className={`text-sm font-medium ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {passed ? 'No se rechaza la Hipótesis Nula (Cumple)' : 'Se rechaza la Hipótesis Nula (No Cumple)'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm text-slate-400">
            {stats && stats.map((stat, i) => (
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
            className="border-t border-slate-700/50 bg-slate-900/50 rounded-b-2xl overflow-hidden"
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
  if (!tests) return null;
  const { chiSquare, ks, poker } = tests;

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-300">
        <Beaker className="w-6 h-6" /> Pruebas de Uniformidad e Independencia
      </h3>

      <div className="space-y-4">
        {/* Chi-Cuadrado */}
        {chiSquare && (
          <TestCard
            title="Prueba de Chi-Cuadrado (χ²)"
            info="¿Cómo aprueba? El valor de χ² Calculado debe ser MENOR o igual al χ² Crítico. Esto confirma que las irregularidades en la frecuencia de los números son por azar y no por un sesgo."
            passed={chiSquare.passed}
            stats={[
              { label: 'χ² Calculado', value: chiSquare.chiSquare?.toFixed(4) ?? 'N/A' },
              { label: 'χ² Crítico', value: chiSquare.criticalValue?.toFixed(4) ?? 'N/A' },
              { label: 'Grados Libertad', value: chiSquare.df ?? 'N/A' }
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
                  {chiSquare.observations?.map((obs, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-2">{obs.bin}</td>
                      <td className="px-4 py-2">{obs.observed}</td>
                      <td className="px-4 py-2">{obs.expected}</td>
                      <td className="px-4 py-2 text-indigo-300">{obs.value?.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          />
        )}

        {/* Kolmogorov-Smirnov */}
        {ks && (
          <TestCard
            title="Prueba Kolmogorov-Smirnov (K-S)"
            info="¿Cómo aprueba? La diferencia máxima (D Mayor) entre la distribución teórica y la real debe ser MENOR o igual al D Crítico. Esto confirma que los datos siguen una distribución uniforme, especialmente útil para muestras pequeñas."
            passed={ks.passed}
            stats={[
              { label: 'D Mayor', value: ks.dMax?.toFixed(5) ?? 'N/A' },
              { label: 'D Crítico', value: ks.criticalValue?.toFixed(5) ?? 'N/A' }
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
                   {ks.data?.map((d) => (
                      <tr key={d.i} className={`hover:bg-slate-800/50 transition-colors ${d.maxLocalD === ks.dMax ? 'bg-amber-500/10' : ''}`}>
                        <td className="px-4 py-2">{d.i}</td>
                        <td className="px-4 py-2">{d.ri?.toFixed(4)}</td>
                        <td className="px-4 py-2">{d.fn?.toFixed(4)}</td>
                        <td className="px-4 py-2">{d.dp?.toFixed(4)}</td>
                        <td className="px-4 py-2">{d.dm?.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          />
        )}

        {/* Poker */}
        {poker && (
          <TestCard
            title="Prueba de Póker"
            info="¿Cómo aprueba? Al igual que en Chi-Cuadrado, se clasifican los números en 'juegos' de póker y se comparan con la probabilidad teórica. El χ² Calculado debe ser MENOR o igual al Crítico para demostrar independencia."
            passed={poker.passed}
            stats={[
              { label: 'χ² Calculado', value: poker.chiSquare?.toFixed(4) ?? 'N/A' },
              { label: 'χ² Crítico', value: poker.criticalValue?.toFixed(4) ?? 'N/A' },
              { label: 'Grados Libertad', value: poker.df ?? 'N/A' }
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
                  {poker.observations?.map((obs, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-2 font-medium">{obs.category}</td>
                      <td className="px-4 py-2">{obs.observed}</td>
                      <td className="px-4 py-2">{obs.expected?.toFixed(2)}</td>
                      <td className="px-4 py-2 text-indigo-300">{obs.value?.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          />
        )}
      </div>
    </div>
  );
}