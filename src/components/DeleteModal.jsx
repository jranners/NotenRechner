import React from 'react';
import { motion } from 'framer-motion';
import { MODULE_DATABASE } from '../data';

export default function DeleteModal({ moduleToDelete, onConfirm, onCancel }) {
  if (!moduleToDelete) return null;
  const db = MODULE_DATABASE.find(m => m.id === moduleToDelete.id);

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4 font-sans">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="relative w-full max-w-sm bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden z-10"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-red-400 text-xl">delete</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Modul löschen?</h3>
              <p className="text-sm text-zinc-500 mt-0.5">Diese Aktion kann nicht rückgängig gemacht werden.</p>
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-3 flex items-center gap-3 border border-white/[0.03]">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-200 truncate font-medium">{db?.name || moduleToDelete.id}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{db?.lp} ECTS · {moduleToDelete.grade === 'Bestanden (Unbenotet)' ? 'Bestanden' : `Note ${moduleToDelete.grade}`}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/5 text-zinc-400 text-sm font-medium hover:bg-white/[0.03] transition-colors">Abbrechen</button>
            <button onClick={() => onConfirm(moduleToDelete.id)} className="flex-1 py-2.5 rounded-xl bg-red-500/15 text-red-400 text-sm font-semibold border border-red-500/20 hover:bg-red-500/25 active:scale-[0.98] transition-all">Löschen</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
