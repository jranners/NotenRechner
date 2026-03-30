import React, { useState, useRef } from 'react';
import { useStore } from '../StoreContext';

export default function Backup() {
  const { specialization, setSpecialization, selectedModules, setSelectedModules } = useStore();
  const [msg, setMsg] = useState(null);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    try {
      const blob = new Blob([JSON.stringify({ specialization, selectedModules }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'notenrechner_backup.json';
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      localStorage.setItem('nr_last_export', new Date().toLocaleDateString('de-DE'));
      setMsg({ type: 'ok', text: 'Backup wurde heruntergeladen.' });
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
          setMsg({ type: 'ok', text: 'Import erfolgreich.' });
        } else { setMsg({ type: 'err', text: 'Ungültiges Format.' }); }
      } catch (err) { setMsg({ type: 'err', text: err.message }); }
      e.target.value = null;
    };
    reader.readAsText(file);
  };

  const kbSize = new Blob([JSON.stringify({ specialization, selectedModules })]).size / 1024;
  const lastExport = localStorage.getItem('nr_last_export') || 'Noch nie';

  return (
    <div className="p-5 md:p-8 lg:p-12 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-2">Daten & Backup</h1>
      <p className="text-sm text-zinc-500 mb-8 max-w-lg">Alle Daten liegen lokal im Browser. Erstelle regelmäßig Backups.</p>

      {msg && (
        <div className={`mb-6 p-3 rounded-xl text-sm border ${msg.type === 'err' ? 'bg-red-500/5 border-red-500/10 text-red-400' : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'}`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button onClick={handleExport}
          className="bg-zinc-900 rounded-2xl p-5 border border-white/[0.03] text-left hover:bg-zinc-900/80 transition-colors group">
          <span className="material-symbols-outlined text-zinc-400 text-2xl mb-3 block group-hover:text-zinc-200 transition-colors">download</span>
          <span className="text-sm font-medium text-zinc-200 block">Exportieren</span>
          <span className="text-xs text-zinc-500 mt-1 block">Als .json herunterladen</span>
        </button>

        <button onClick={() => fileInputRef.current?.click()}
          className="bg-zinc-900 rounded-2xl p-5 border border-white/[0.03] text-left hover:bg-zinc-900/80 transition-colors group">
          <span className="material-symbols-outlined text-zinc-400 text-2xl mb-3 block group-hover:text-zinc-200 transition-colors">upload</span>
          <span className="text-sm font-medium text-zinc-200 block">Importieren</span>
          <span className="text-xs text-zinc-500 mt-1 block">Backup wiederherstellen</span>
        </button>
        <input type="file" accept=".json" ref={fileInputRef} onChange={handleFile} className="hidden" />
      </div>

      <div className="bg-zinc-900 rounded-2xl p-5 border border-white/[0.03] space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-500">Letzter Export</span>
          <span className="text-zinc-300 font-medium">{lastExport}</span>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-500">Speicher</span>
            <span className="text-zinc-400 tabular-nums text-xs">{kbSize.toFixed(1)} KB</span>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-600 rounded-full transition-all" style={{ width: `${Math.max(1, (kbSize / 5120) * 100)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
