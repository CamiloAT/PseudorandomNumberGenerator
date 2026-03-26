import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Play, Hash, Info, HelpCircle } from 'lucide-react';
import { Joyride, STATUS, EVENTS } from 'react-joyride';
import DataTable from './components/DataTable';
import StatsDisplay from './components/StatsDisplay';
import ChartDisplay from './components/ChartDisplay';
import TestResults from './components/TestResults';
import WelcomeScreen from './components/WelcomeScreen';
import TransitionScreen from './components/TransitionScreen';
import InfoModal from './components/InfoModal';
import { generateLinearCongruential, generateMultiplicativeCongruential, generateMiddleSquare, calculateStats } from './utils/generators';
import { chiSquareTest, kolmogorovSmirnovTest, pokerTest } from './utils/tests';

function App() {
  const [appState, setAppState] = useState('welcome'); // welcome, transition, generator
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [runTour, setRunTour] = useState(false);

  const tourSteps = [
    {
      target: '.tour-config',
      content: 'Aquí puedes configurar el generador. Selecciona el método que deseas utilizar.',
      disableBeacon: true,
      placement: 'right',
    },
    {
      target: '.tour-params',
      content: 'Ingresa los parámetros necesarios. Estos cambiarán automáticamente según el método que selecciones (semilla, módulo, multiplicador, etc).',
      disableBeacon: true,
      placement: 'right',
    },
    {
      target: '.tour-generate',
      content: '¡Haz clic aquí para generar los números! La aplicación aplicará el método y realizará todas las pruebas estadísticas.',
      disableBeacon: true,
      placement: 'right',
    },
    {
      target: '.tour-results',
      content: 'Una vez generados, aquí aparecerán todos los resultados: medias, varianzas, gráficas de dispersión y las pruebas Chi-Cuadrado, K-S y Poker.',
      disableBeacon: true,
      placement: 'left',
    },
    {
      target: '.tour-info',
      content: 'Si quieres saber quiénes desarrollaron esta aplicación o quieres ver detalles de la materia, haz clic aquí en el botón de Acerca de.',
      disableBeacon: true,
      placement: 'bottom',
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status) || type === EVENTS.TOUR_END) {
      setRunTour(false);
    }
  };

  const CustomTooltip = ({ index, step, skipProps, primaryProps, backProps, tooltipProps, isLastStep }) => (
    <div {...tooltipProps} className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 p-5 max-w-sm mr-4 ml-4">
      <div className="text-slate-200 mb-5 text-sm leading-relaxed">
        {step.content}
      </div>
      <div className="flex items-center justify-between mt-4 border-t border-slate-700/50 pt-4">
        <div className="flex gap-2 items-center">
          {!isLastStep && (
            <button {...skipProps} className="text-xs font-semibold px-2 py-1.5 text-slate-500 hover:text-slate-300 transition-colors">
              Saltar tour
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {index > 0 && (
            <button {...backProps} className="text-sm font-medium px-4 py-2 text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              Atrás
            </button>
          )}
          <button {...primaryProps} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-indigo-500/25 active:scale-95">
            {isLastStep ? 'Terminar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );

  const [method, setMethod] = useState('LCG');
  const [params, setParams] = useState({ x0: 554, a: 5, c: 7, m: 16, d: 4, n: 100 });
  const [results, setResults] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleInputChange = (e) => setParams({ ...params, [e.target.name]: Number(e.target.value) });

  const startApp = () => {
    setAppState('transition');
    setTimeout(() => {
      setAppState('generator');
    }, 1800); // Wait for transition animation
  };

  const generate = () => {
    setIsGenerating(true);
    setResults(null);

    // Simulamos un tiempo de carga para el efecto visual llamativo
    setTimeout(() => {
      let genData = {};
      if (method === 'LCG') genData = generateLinearCongruential(params.x0, params.a, params.c, params.m, params.n);
      else if (method === 'MCG') genData = generateMultiplicativeCongruential(params.x0, params.a, params.m, params.n);
      else if (method === 'MS') genData = generateMiddleSquare(params.x0, params.d, params.n);
      
      const riArray = genData.data.map(d => d.ri);
      const xiArray = genData.data.map(d => d.xi);
      
      const statsRi = calculateStats(riArray);
      const statsXi = calculateStats(xiArray);
      
      const tests = { chiSquare: chiSquareTest(riArray), ks: kolmogorovSmirnovTest(riArray), poker: pokerTest(riArray) };
      
      setResults({ ...genData, statsRi, statsXi, tests, method });
      setIsGenerating(false);
    }, 1200);
  };

  if (appState === 'welcome') return <WelcomeScreen onStart={startApp} />;
  if (appState === 'transition') return <TransitionScreen />;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {runTour && (
        <Joyride
          steps={tourSteps}
          run={true}
          continuous={true}
          showSkipButton={true}
          callback={handleJoyrideCallback}
          tooltipComponent={CustomTooltip}
          disableOverlayClose={true}
          floaterProps={{
            disableAnimation: true
          }}
          styles={{
            options: {
              overlayColor: 'rgba(15, 23, 42, 0.85)',
              zIndex: 1000,
            }
          }}
        />
      )}

      <header className="bg-slate-800/50 border-b border-slate-700 p-6 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Hash className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Generador Pseudoaleatorio
              </h1>
              <p className="text-sm text-slate-400">Simulación y Modelos - Modos Múltiples</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!results && !isGenerating && (
              <button
                onClick={() => setRunTour(true)}
                className="tour-help p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500 rounded-xl transition-all text-indigo-400 flex items-center justify-center gap-2 font-medium shadow-lg"
                title="Iniciar Tour Guiado"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => setShowInfoModal(true)}
              className="tour-info p-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500 rounded-xl transition-all text-slate-300 hover:text-indigo-400 flex items-center gap-2 font-medium shadow-lg"
            >
              <Info className="w-5 h-5" />
              <span className="hidden md:inline">Acerca de</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-8 mt-6 relative">
        <div className="tour-config xl:col-span-3 space-y-6">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-indigo-300">
              <Settings2 className="w-5 h-5" /> Configuración
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Método</label>
                <select 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={method} onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="LCG">Congruencial Lineal</option>
                  <option value="MCG">Congruencial Multiplicativo</option>
                  <option value="MS">Cuadrados Medios</option>
                </select>
              </div>

              <div className="tour-params grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">X₀ (Semilla)</label>
                  <input type="number" name="x0" value={params.x0} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Cantidad (N)</label>
                  <input type="number" name="n" value={params.n} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"/>
                </div>
                
                {(method === 'LCG' || method === 'MCG') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">a (Multiplic.)</label>
                      <input type="number" name="a" value={params.a} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">m (Módulo)</label>
                      <input type="number" name="m" value={params.m} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                  </>
                )}
                
                {method === 'LCG' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">c (Incremento)</label>
                    <input type="number" name="c" value={params.c} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"/>
                  </div>
                )}

                {method === 'MS' && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">D (Dígitos)</label>
                    <input type="number" name="d" value={params.d} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"/>
                  </div>
                )}
              </div>

              <button 
                onClick={generate}
                disabled={isGenerating}
                className="tour-generate w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/25"
              >
                {isGenerating ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Hash className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
                {isGenerating ? 'Generando...' : 'Generar'}
              </button>
            </div>
          </div>
        </div>

        <div className="tour-results xl:col-span-9 space-y-6">
          {isGenerating ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-indigo-400 border-2 border-slate-800 border-dashed rounded-2xl relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-indigo-500/10"
                initial={{ scaleY: 0, transformOrigin: 'bottom' }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="z-10">
                <Hash className="w-20 h-20 mb-6 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              </motion.div>
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-2xl font-bold tracking-widest z-10 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]"
              >
                GENERANDO NÚMEROS...
              </motion.p>
            </div>
          ) : !results ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-500 border-2 border-slate-800 border-dashed rounded-2xl">
              <Hash className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-xl font-medium">Configura los parámetros y presiona Generar</p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <StatsDisplay statsRi={results.statsRi} statsXi={results.statsXi} period={results.period} n={params.n} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataTable data={results.data} method={results.method} />
                <ChartDisplay data={results.data} />
              </div>

              <TestResults tests={results.tests} />
            </motion.div>
          )}
        </div>
      </main>

      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
}

export default App;
