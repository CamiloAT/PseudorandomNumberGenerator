import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import {
  ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Cell, ZAxis, 
  ScatterChart, Scatter,
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area
} from 'recharts';

export default function ChartDisplay({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const charts = useMemo(() => {
    // 1. Scatter: Dispersión
    const scatterData = data.map((d) => ({ x: d.i, y: d.ri }));

    // 2. Trend: Línea
    const lineData = data.map((d) => ({ i: d.i, ri: d.ri }));

    // 3. Histogram: Frecuencias
    const bins = Array(10).fill(0).map((_, i) => ({ 
      name: `${(i*0.1).toFixed(1)}-${((i+1)*0.1).toFixed(1)}`, 
      count: 0 
    }));
    data.forEach(d => {
      const idx = Math.min(Math.floor(d.ri * 10), 9);
      bins[idx].count += 1;
    });

    // 4. Lag Plot: Retardo Ri vs Ri+1
    const lagData = [];
    for (let i = 0; i < data.length - 1; i++) {
      lagData.push({ x: data[i].ri, y: data[i+1].ri });
    }

    // 5. Cumulative Mean: Convergencia
    let sum = 0;
    const areaData = data.map((d) => {
      sum += d.ri;
      return { i: d.i, mean: sum / d.i };
    });

    return [
      {
        title: "Dispersión (Uniformidad)",
        desc: "Muestra la distribución de los números a lo largo de la secuencia (Ri vs i). Sirve para detectar patrones visuales o huecos en el espectro 0 a 1.",
        component: (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" dataKey="x" name="Índice (i)" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <YAxis type="number" dataKey="y" name="Valor (Ri)" domain={[0, 1]} stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <ZAxis type="number" range={[50, 50]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }} />
            <Scatter name="Ri" data={scatterData} fill="#8b5cf6">
              {scatterData.map((entry, index) => <Cell key={`cell-${index}`} fill="#8b5cf6" />)}
            </Scatter>
          </ScatterChart>
        )
      },
      {
        title: "Retardo (Independencia)",
        desc: "Gráfica de Ri vs R(i+1). Si los puntos forman patrones reconocibles, significa que el generador tiene baja independencia y los números son predecibles.",
        component: (
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" dataKey="x" name="Ri" domain={[0, 1]} stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <YAxis type="number" dataKey="y" name="R(i+1)" domain={[0, 1]} stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <ZAxis type="number" range={[40, 40]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }} />
            <Scatter name="Pares" data={lagData} fill="#10b981">
              {lagData.map((entry, index) => <Cell key={`cell-${index}`} fill="#10b981" />)}
            </Scatter>
          </ScatterChart>
        )
      },
      {
        title: "Histograma (Equidad)",
        desc: "Divide el rango [0, 1) en 10 intervalos y cuenta cuantos números caen en cada uno. Una buena distribución arrojará barras de tamaños aproximadamente similares.",
        component: (
          <BarChart data={bins} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 10, fill: '#94a3b8'}} />
            <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }} />
            <Bar dataKey="count" name="Frecuencia" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        )
      },
      {
        title: "Línea de Secuencia (Tendencia)",
        desc: "Conecta cada número generado consecutivamente. Permite observar cómo salta el valor de una iteración a la siguiente para identificar repeticiones cíclicas obvias.",
        component: (
          <LineChart data={lineData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="i" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <YAxis domain={[0, 1]} stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="ri" name="Ri" stroke="#f43f5e" strokeWidth={2} dot={{ r: 2, fill: '#f43f5e' }} activeDot={{ r: 6 }} />
          </LineChart>
        )
      },
      {
        title: "Media Acumulada (Convergencia)",
        desc: "Traza el promedio histórico de todos los números generados a medida que avanza. Idealmente debería converger y estabilizarse cerca de 0.5 (Valor esperado μ).",
        component: (
          <AreaChart data={areaData} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="i" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <YAxis domain={[0, 1]} stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="mean" name="Media Acum." stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
          </AreaChart>
        )
      }
    ];
  }, [data]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? charts.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === charts.length - 1 ? 0 : prev + 1));
  };

  const currentChart = charts[currentIndex];

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl h-[450px] flex flex-col relative overflow-hidden"> 
      <div className="flex justify-between items-center mb-4">
        
        {/* Title and Info Tooltip */}
        <div className="flex items-center gap-2 relative group cursor-help w-max">
          <h3 className="text-lg font-semibold text-slate-200">{currentChart.title}</h3>
          <Info className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          
          {/* Info Tooltip */}
          <div className="absolute top-full left-0 mt-2 hidden group-hover:block w-72 bg-slate-900 text-xs text-indigo-50 p-4 rounded-lg shadow-2xl shadow-black/50 border border-indigo-500/30 z-[100] font-normal leading-relaxed pointer-events-none">
            {currentChart.desc}
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="flex/items-center gap-2 bg-slate-900/50 p-1.5 rounded-lg border border-slate-700">
          <button 
            onClick={handlePrev} 
            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1.5 px-2">
            {charts.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-indigo-500 w-4' : 'bg-slate-600 w-1.5'}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext} 
            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex-1 w-full min-h-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ResponsiveContainer width="100%" height="100%">
              {currentChart.component}
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
