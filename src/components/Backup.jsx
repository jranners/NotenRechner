import React, { useState, useRef } from 'react';
import { useStore } from '../StoreContext';
import { useAppConfig } from '../contexts/AppConfigContext';

export default function Backup() {
  const { specialization, setSpecialization, selectedModules, setSelectedModules } = useStore();
  const { t } = useAppConfig();
  const [msg, setMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify({ specialization, selectedModules }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'notenrechner_backup.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      localStorage.setItem('nr_last_export', new Date().toLocaleDateString());
      setMsg({ type: 'ok', text: t('backup.ok_export') });
    } catch (e) { setMsg({ type: 'err', text: e.message }); }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const r = JSON.parse(ev.target.result);
        if (r && Array.isArray(r.selectedModules)) {
          setSelectedModules(r.selectedModules); setSpecialization(r.specialization || null);
          setMsg({ type: 'ok', text: t('backup.ok_import') });
        } else { setMsg({ type: 'err', text: t('backup.err_format') }); }
      } catch (err) { setMsg({ type: 'err', text: err.message }); }
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  const kbSize = new Blob([JSON.stringify({ specialization, selectedModules })]).size / 1024;
  const lastExport = localStorage.getItem('nr_last_export') || t('backup.never');

  return (
    <div className="p-5 md:p-8 lg:p-12 max-w-2xl mx-auto w-full transition-colors duration-200">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">{t('backup.title')}</h1>
      <p className="text-sm text-zinc-500 mb-8 max-w-lg">{t('backup.description')}</p>

      {msg && (
        <div className={`mb-6 p-3 rounded-xl text-sm border ${msg.type === 'err' ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/10 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/10 text-emerald-700 dark:text-emerald-400'}`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button onClick={handleExport}
          className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.03] text-left hover:bg-zinc-100 dark:hover:bg-zinc-900/80 shadow-sm dark:shadow-none transition-colors group">
          <span className="material-symbols-outlined text-zinc-400 text-2xl mb-3 block group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">download</span>
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 block">{t('backup.export')}</span>
          <span className="text-xs text-zinc-500 mt-1 block">{t('backup.export_sub')}</span>
        </button>

        <button onClick={() => fileInputRef.current?.click()}
          className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.03] text-left hover:bg-zinc-100 dark:hover:bg-zinc-900/80 shadow-sm dark:shadow-none transition-colors group">
          <span className="material-symbols-outlined text-zinc-400 text-2xl mb-3 block group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">upload</span>
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 block">{t('backup.import')}</span>
          <span className="text-xs text-zinc-500 mt-1 block">{t('backup.import_sub')}</span>
        </button>
        <input type="file" accept=".json" ref={fileInputRef} onChange={handleFile} className="hidden" />
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.03] shadow-sm dark:shadow-none space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-500">{t('backup.last_export')}</span>
          <span className="text-zinc-800 dark:text-zinc-300 font-medium">{lastExport}</span>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-500">{t('backup.storage')}</span>
            <span className="text-zinc-500 dark:text-zinc-400 tabular-nums text-xs">{kbSize.toFixed(1)} KB</span>
          </div>
          <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-500 dark:bg-zinc-600 rounded-full transition-all" style={{ width: `${Math.max(1, (kbSize / 5120) * 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
