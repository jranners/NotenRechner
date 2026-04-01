import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './StoreContext';
import { useAppConfig } from './contexts/AppConfigContext';
import { MODULE_DATABASE } from './data';
import Dashboard from './components/Dashboard';
import Simulator from './components/Simulator';
import Backup from './components/Backup';
import Onboarding from './components/Onboarding';
import SettingsModal from './components/SettingsModal';

const AREA_TABS = [
  { id: 'basis', labelKey: 'nav.basis', icon: 'school' },
  { id: 'schwerpunkt', labelKey: 'nav.schwerpunkt', icon: 'biotech' },
  { id: 'ergaenzung_econ', labelKey: 'nav.ergaenzung_econ', icon: 'analytics' },
  { id: 'ergaenzung_mss', labelKey: 'nav.ergaenzung_mss', icon: 'functions' },
  { id: 'thesis', labelKey: 'nav.thesis', icon: 'history_edu' },
];

const UTIL_TABS = [
  { id: 'simulator', labelKey: 'nav.simulator', icon: 'insights' },
  { id: 'backup', labelKey: 'nav.backup', icon: 'cloud_sync' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('basis');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { specialization, setSpecialization, selectedModules, hasOnboarded } = useStore();
  const { t } = useAppConfig();

  if (!hasOnboarded) {
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
    const threshold = 80;
    if (info.offset.x < -threshold && activeIndex < AREA_TABS.length - 1) {
      setActiveTab(AREA_TABS[activeIndex + 1].id);
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveTab(AREA_TABS[activeIndex - 1].id);
    }
  };

  const renderContent = () => {
    if (activeTab === 'simulator') return <Simulator />;
    if (activeTab === 'backup') return <Backup />;
    
    if (activeTab === 'schwerpunkt' && (!specialization || specialization === 'skipped')) {
      return (
        <div className="p-5 md:p-8 flex flex-col items-center justify-center h-full min-h-[50vh] text-center w-full max-w-lg mx-auto transition-colors duration-200">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 tracking-tight">{t('dashboard.select_specialization_title')}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed max-w-sm">{t('dashboard.select_specialization_hint')}</p>
          <div className="w-full space-y-3 text-left">
            {[{ id: 'emda', labelKey: 'specs.emda' }, { id: 'mep', labelKey: 'specs.mep' }, { id: 'mdb', labelKey: 'specs.mdb' }, { id: 'ecc', labelKey: 'specs.ecc' }].map(opt => (
              <label key={opt.id} className="flex items-center p-4 rounded-2xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/[0.03] hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer transition-all">
                <input type="radio" checked={false} onChange={() => setSpecialization(opt.id)} className="sr-only" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200 block">{t(opt.labelKey)}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 block">{t('app.subtitle')}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      );
    }
    
    return <Dashboard area={activeTab} />;
  };

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      
      {/* Mobile Top Header containing Settings */}
      <header 
        className="md:hidden flex items-center justify-between px-safe pb-4 border-b border-zinc-200 dark:border-white/5 shrink-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <div>
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{t('app.title')}</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{t('app.subtitle')}</p>
        </div>
        <button onClick={() => setSettingsOpen(true)} className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </header>

      {/* Desktop Sidebar + Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5 shrink-0 relative transition-colors duration-200">
          <div className="p-5 pt-6">
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{t('app.title')}</h1>
            <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-widest">{t('app.subtitle')}</p>
            {globalGpa !== null && (
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="text-zinc-500">{t('app.global_gpa')}</span>
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold tabular-nums">{globalGpa.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest px-2 py-2">{t('nav.areas')}</p>
            {AREA_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-zinc-200/50 dark:bg-white/5 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.03]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {t(tab.labelKey)}
              </button>
            ))}
            <div className="h-px bg-zinc-200 dark:bg-white/5 my-3 transition-colors" />
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest px-2 py-2">{t('nav.tools')}</p>
            {UTIL_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-zinc-200/50 dark:bg-white/5 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.03]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {t(tab.labelKey)}
              </button>
            ))}
          </nav>
          
          <div className="p-4 mt-auto border-t border-zinc-200 dark:border-white/5">
            <button
                onClick={() => setSettingsOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.03] transition-colors"
              >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              {t('nav.settings')}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar md:pb-0">
          {isAreaView ? (
            <motion.div
              key={activeTab}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
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
      <nav 
        className="md:hidden flex items-center justify-around w-full z-40 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5 pt-1.5 px-safe-nav shrink-0"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))', minHeight: 'calc(3.5rem + env(safe-area-inset-bottom))' }}
      >
        {AREA_TABS.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.85 }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg min-w-0 transition-colors ${
              activeTab === tab.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'
            }`}
          >
            <span 
              className="material-symbols-outlined"
              style={{
                fontSize: '24px',
                fontVariationSettings: activeTab === tab.id
                  ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
                  : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
              }}
            >
              {tab.icon}
            </span>
            <span className="text-[9px] mt-0.5 truncate max-w-[3.5rem]">{t(tab.labelKey)}</span>
          </motion.button>
        ))}
        <div className="w-px h-6 bg-zinc-200 dark:bg-white/5 mx-1" />
        {UTIL_TABS.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileTap={{ scale: 0.85 }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg min-w-0 transition-colors ${
              activeTab === tab.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'
            }`}
          >
            <span 
              className="material-symbols-outlined"
              style={{
                fontSize: '24px',
                fontVariationSettings: activeTab === tab.id
                  ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
                  : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
              }}
            >
              {tab.icon}
            </span>
            <span className="text-[9px] mt-0.5 truncate max-w-[3.5rem]">{t(tab.labelKey)}</span>
          </motion.button>
        ))}
      </nav>

      <AnimatePresence>
        {settingsOpen && <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} setActiveTab={setActiveTab} />}
      </AnimatePresence>
    </div>
  );
}
