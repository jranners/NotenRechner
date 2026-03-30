import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { AREA_LIMITS, MODULE_DATABASE } from '../data';
import AddModuleModal from './AddModuleModal';
import DeleteModal from './DeleteModal';

export default function Dashboard({ area }) {
  const { selectedModules, isAreaLocked, removeModule } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  const areaModules = selectedModules.filter(m => m.area === area);
  const currentLp = areaModules.reduce((sum, m) => {
    const db = MODULE_DATABASE.find(d => d.id === m.id);
    return sum + (db ? db.lp : 0);
  }, 0);

  const maxLp = AREA_LIMITS[area];
  const progress = Math.min((currentLp / maxLp) * 100, 100);
  const locked = isAreaLocked(area);

  // Area GPA
  const graded = areaModules.filter(m => m.grade !== 'Bestanden (Unbenotet)');
  const { ws, tl } = graded.reduce((a, m) => {
    const db = MODULE_DATABASE.find(d => d.id === m.id);
    const lp = db ? db.lp : 0;
    return { ws: a.ws + parseFloat(m.grade) * lp, tl: a.tl + lp };
  }, { ws: 0, tl: 0 });
  const areaGpa = tl > 0 ? (ws / tl) : null;

  const labels = {
    basis: 'Basisbereich', schwerpunkt: 'Schwerpunkt',
    ergaenzung_econ: 'Ergänzung Econ', ergaenzung_mss: 'Ergänzung MSS', thesis: 'Masterarbeit'
  };

  return (
    <div className="p-5 md:p-8 lg:p-12 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">{labels[area]}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="text-zinc-400 tabular-nums">{currentLp}/{maxLp} ECTS</span>
          {areaGpa !== null && (
            <span className="text-zinc-400">· Schnitt <span className="text-zinc-200 font-medium tabular-nums">{areaGpa.toFixed(2)}</span></span>
          )}
          {locked && <span className="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded">Abgeschlossen</span>}
        </div>
        {/* Progress */}
        <div className="mt-4 h-1 w-full bg-zinc-800/60 rounded-full overflow-hidden">
          <div className="h-full bg-zinc-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-2">
        {areaModules.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            <span className="material-symbols-outlined text-3xl block mb-2 opacity-40">inbox</span>
            Keine Module in diesem Bereich.
          </div>
        ) : (
          areaModules.map(mod => {
            const db = MODULE_DATABASE.find(d => d.id === mod.id);
            return (
              <div key={mod.id} className="bg-zinc-900 rounded-2xl p-4 flex items-center gap-4 group hover:bg-zinc-900/80 transition-colors border border-white/[0.03]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{db?.name}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                    <span>{db?.lp} ECTS</span>
                    <span>·</span>
                    <span>{mod.date}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-semibold text-zinc-200 tabular-nums">
                    {mod.grade === 'Bestanden (Unbenotet)' ? 'B' : mod.grade}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditData(mod); setIsModalOpen(true); }}
                    className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setModuleToDelete(mod); }}
                    className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Button */}
      {!locked && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 w-full py-3 rounded-2xl border border-dashed border-zinc-700 text-zinc-500 text-sm hover:border-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Modul hinzufügen
        </button>
      )}

      <AddModuleModal currentArea={area} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditData(null); }} editData={editData} />
      <DeleteModal moduleToDelete={moduleToDelete} onConfirm={(id) => { removeModule(id); setModuleToDelete(null); }} onCancel={() => setModuleToDelete(null)} />
    </div>
  );
}
