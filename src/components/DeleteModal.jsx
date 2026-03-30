import React from 'react';
import { motion } from 'framer-motion';
import { MODULE_DATABASE } from '../data';
import { useAppConfig } from '../contexts/AppConfigContext';

export default function DeleteModal({ moduleToDelete, onConfirm, onCancel }) {
  const { t } = useAppConfig();
  if (!moduleToDelete) return null;
  const db = MODULE_DATABASE.find(m => m.id === moduleToDelete.id);

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4 font-sans">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/5 overflow-hidden z-10"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">delete</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{t('modals.delete_title')}</h3>
              <p className="text-sm text-zinc-500 mt-0.5">{t('modals.delete_sub')}</p>
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 flex items-center gap-3 border border-zinc-200 dark:border-white/[0.03]">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-800 dark:text-zinc-200 truncate font-medium">{db?.name || moduleToDelete.id}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{db?.lp} ECTS · {moduleToDelete.grade === 'Bestanden (Unbenotet)' ? t('dashboard.passed') : `${t('modals.grade')} ${moduleToDelete.grade}`}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-white/[0.03] transition-colors">{t('modals.cancel')}</button>
            <button onClick={() => onConfirm(moduleToDelete.id)} className="flex-1 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-sm font-semibold border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/25 active:scale-[0.98] transition-all">{t('modals.delete')}</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
