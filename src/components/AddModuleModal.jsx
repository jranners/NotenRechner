import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../StoreContext';
import { useAppConfig } from '../contexts/AppConfigContext';
import SearchableSelect from './SearchableSelect';

const GRADES = ["1.0", "1.3", "1.7", "2.0", "2.3", "2.7", "3.0", "3.3", "3.7", "4.0", "Bestanden (Unbenotet)"];

export default function AddModuleModal({ currentArea, isOpen, onClose, editData }) {
  const { addModule, editModule, getAvailableModulesForArea } = useStore();
  const { t } = useAppConfig();
  const [selectedId, setSelectedId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (editData) { setSelectedId(editData.id); setSelectedGrade(editData.grade); setSelectedDate(editData.date); }
      else { setSelectedId(''); setSelectedGrade(''); setSelectedDate(''); }
      setError('');
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const availableModules = getAvailableModulesForArea(currentArea, editData ? editData.id : null);
  const selectedModuleObj = availableModules.find(m => m.id === selectedId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedId || !selectedGrade || !selectedDate) { setError(t('modals.fill_all')); return; }
    try {
      const ok = editData ? editModule(editData.id, currentArea, selectedGrade, selectedDate) : addModule(selectedId, currentArea, selectedGrade, selectedDate);
      if (ok !== false) onClose(); else setError(t('modals.fail'));
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-end md:justify-center font-sans">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-2xl md:rounded-2xl border border-zinc-200 dark:border-white/5 p-6 pb-8 z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{editData ? t('modals.edit_title') : t('modals.add_title')}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">{t('modals.module')}</label>
            <SearchableSelect options={availableModules} value={selectedId} onChange={setSelectedId} placeholder={t('modals.search')} disabled={!!editData} />
          </div>

          <div>
            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">{t('modals.grade')}</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {GRADES.map(g => {
                const active = selectedGrade === g;
                const unb = g === 'Bestanden (Unbenotet)';
                return (
                  <button key={g} type="button" onClick={() => setSelectedGrade(g)}
                    className={`py-2 px-1 rounded-lg text-sm border transition-all ${unb ? 'col-span-2 text-[10px] uppercase tracking-wider' : ''} ${
                      active ? 'bg-zinc-200 dark:bg-white/10 border-zinc-400 dark:border-zinc-500 text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >{unb ? t('dashboard.passed') : g}</button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">{t('modals.date')}</label>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-white/5 rounded-lg text-zinc-900 dark:text-zinc-200 py-2.5 px-3 text-sm outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>
            {selectedModuleObj && (
              <div className="flex-1 flex items-end">
                <div className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg border border-zinc-200 dark:border-white/5 text-center shadow-sm dark:shadow-none">
                  <span className="text-xs text-zinc-500 block">ECTS</span>
                  <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-200">{selectedModuleObj.lp}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-white/[0.03] transition-colors">{t('modals.cancel')}</button>
            <button type="submit" className="flex-1 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-[0.98] transition-all">{t('modals.save')}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
