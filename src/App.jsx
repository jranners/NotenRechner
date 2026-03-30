import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './StoreContext';
import { MODULE_DATABASE } from './data';
import Dashboard from './components/Dashboard';
import Simulator from './components/Simulator';
import Backup from './components/Backup';
import Onboarding from './components/Onboarding';

const AREA_TABS = [
  { id: 'basis', label: 'Basis', icon: 'school' },
  { id: 'schwerpunkt', label: 'Schwerpunkt', icon: 'biotech' },
  { id: 'ergaenzung_econ', label: 'Erg. Econ', icon: 'analytics' },
  { id: 'ergaenzung_mss', label: 'Erg. MSS', icon: 'functions' },
  { id: 'thesis', label: 'Thesis', icon: 'history_edu' },
];

const UTIL_TABS = [
  { id: 'simulator', label: 'Simulator', icon: 'insights' },
  { id: 'backup', label: 'Backup', icon: 'cloud_sync' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('basis');
  const { specialization, selectedModules } = useStore();

  if (specialization === null) {
    return <Onboarding />;
  }

  // Global GPA
  const gradedModules = selectedModules.filter(m => m.grade !== 'Bestanden (Unbenotet)');
  const { ws, tl } = gradedModules.reduce((a, m) => {
    const db = MODULE_DATABASE.find(d => d.id === m.id);
    const lp = db ? db.lp : 0;
    return { ws: a.ws + parseFloat(m.grade) * lp, tl: a.tl + lp };
  }, { ws: 0, tl: 0 });
  const globalGpa = tl > 0 ? (ws / tl) : null;

  const activeIndex = AREA_TABS.findIndex(t => t.id === activeTab);
  const isAreaView = activeIndex !== -1;

  const handleSwipe = (_, info) => {
    if (!isAreaView) return;
    const threshold = 50;
    if (info.offset.x < -threshold && activeIndex < AREA_TABS.length - 1) {
      setActiveTab(AREA_TABS[activeIndex + 1].id);
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveTab(AREA_TABS[activeIndex - 1].id);
    }
  };

  const renderContent = () => {
    if (activeTab === 'simulator') return <Simulator />;
    if (activeTab === 'backup') return <Backup />;
    return <Dashboard area={activeTab} />;
  };

  return (
    <div className="h-dvh w-screen overflow-hidden flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      
      {/* Desktop Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 bg-zinc-950 border-r border-white/5 shrink-0">
          <div className="p-5 pt-6">
            <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">Grade Tracker</h1>
            <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest">M.Sc. Economics</p>
            {globalGpa !== null && (
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="text-zinc-500">Gesamtschnitt</span>
                <span className="text-zinc-100 font-semibold tabular-nums">{globalGpa.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <nav className="flex-1 px-3 py-2 space-y-0.5">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest px-2 py-2">Bereiche</p>
            {AREA_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/5 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <div className="h-px bg-white/5 my-3" />
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest px-2 py-2">Tools</p>
            {UTIL_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/5 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {isAreaView ? (
            <motion.div
              key={activeTab}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleSwipe}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="min-h-full"
            >
              {renderContent()}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="min-h-full"
            >
              {renderContent()}
            </motion.div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden flex items-center justify-around bg-zinc-950/80 backdrop-blur-xl border-t border-white/5 pb-safe pt-1.5 px-1 shrink-0">
        {AREA_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg min-w-0 transition-colors ${
              activeTab === tab.id ? 'text-zinc-100' : 'text-zinc-500'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            <span className="text-[9px] mt-0.5 truncate max-w-[3.5rem]">{tab.label}</span>
          </button>
        ))}
        <div className="w-px h-6 bg-white/5" />
        {UTIL_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg min-w-0 transition-colors ${
              activeTab === tab.id ? 'text-zinc-100' : 'text-zinc-500'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            <span className="text-[9px] mt-0.5 truncate max-w-[3.5rem]">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
