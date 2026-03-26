import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ZAxis } from 'recharts';

export default function ChartDisplay({ data }) {
  // Format for Recharts Scatter
  const scatterData = data.map((d) => ({
    x: d.i,
    y: d.ri,
  }));

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl h-[450px] flex flex-col">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Dispersión de Números (Uniformidad)</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Índice (i)" 
              stroke="#94a3b8"
              tick={{fill: '#94a3b8'}}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Valor (Ri)" 
              domain={[0, 1]} 
              stroke="#94a3b8"
              tick={{fill: '#94a3b8'}}
            />
            <ZAxis type="number" range={[50, 50]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
            />
            <Scatter name="Ri" data={scatterData} fill="#6366f1">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#8b5cf6" />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}