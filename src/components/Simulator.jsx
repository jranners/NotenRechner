import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { MODULE_DATABASE } from '../data';

const DISCRETE_GRADES = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0];

export default function Simulator() {
  const { selectedModules } = useStore();
  const [targetGrade, setTargetGrade] = useState(1.5);

  let totalLpDone = 0, gradedLpDone = 0, gradedSum = 0;
  selectedModules.forEach(sm => {
    const db = MODULE_DATABASE.find(m => m.id === sm.id);
    if (db) {
      totalLpDone += db.lp;
      if (sm.grade !== "Bestanden (Unbenotet)") { gradedLpDone += db.lp; gradedSum += parseFloat(sm.grade) * db.lp; }
    }
  });

  const currentGpa = gradedLpDone > 0 ? (gradedSum / gradedLpDone) : NaN;
  const remainingLp = 120 - totalLpDone;
  const gReq = remainingLp > 0 ? ((120 * targetGrade - (isNaN(currentGpa) ? 0 : currentGpa) * totalLpDone) / remainingLp) : 0;

  let resultMsg = '', resultType = '', pathItems = null;
  if (remainingLp <= 0) { resultMsg = 'Alle 120 ECTS absolviert.'; resultType = 'done'; }
  else if (gReq < 1.0) { resultMsg = 'Zielnote mathematisch nicht erreichbar.'; resultType = 'error'; }
  else if (gReq > 4.0) { resultMsg = 'Zielnote wird durch reines Bestehen (4.0) erreicht.'; resultType = 'success'; }
  else {
    resultType = 'path';
    resultMsg = `Durchschnitt von ${gReq.toFixed(2)} in den verbleibenden ${remainingLp} ECTS nötig.`;
    const hasThesis = selectedModules.some(m => m.id === 'thesis' || m.id === 'ma_thesis');
    let data = [];
    if (hasThesis) {
      const n = Math.ceil(remainingLp / 6);
      let ci = 0;
      while (ci < DISCRETE_GRADES.length && DISCRETE_GRADES[ci] <= gReq) ci++;
      let da = DISCRETE_GRADES[Math.max(0, ci - 1)], db = DISCRETE_GRADES[Math.min(DISCRETE_GRADES.length - 1, ci)];
      let cA = 0, cB = n, best = 999;
      for (let a = 0; a <= n; a++) { const b = n - a; const d = Math.abs(((a*da+b*db)/n) - gReq); if (d < best) { best=d; cA=a; cB=b; } }
      if (cA > 0) data.push({ title: 'Module (6 ECTS)', count: cA, grade: da });
      if (cB > 0 && db !== da) data.push({ title: 'Module (6 ECTS)', count: cB, grade: db });
    } else {
      const lpR = remainingLp - 30;
      let cd = 999, tg = 4.0;
      for (const g of DISCRETE_GRADES) { const d = Math.abs(g - gReq); if (d < cd) { cd = d; tg = g; } }
      data.push({ title: 'Masterarbeit (30 ECTS)', count: 1, grade: tg });
      if (lpR > 0) {
        const gR = Math.max(1.0, Math.min(4.0, (gReq * remainingLp - tg * 30) / lpR));
        const n = Math.ceil(lpR / 6);
        let ci = 0;
        while (ci < DISCRETE_GRADES.length && DISCRETE_GRADES[ci] <= gR) ci++;
        let da = DISCRETE_GRADES[Math.max(0, ci-1)], db = DISCRETE_GRADES[Math.min(DISCRETE_GRADES.length-1, ci)];
        let cA = 0, cB = n, best = 999;
        for (let a = 0; a <= n; a++) { const b = n-a; const d = Math.abs(((a*da+b*db)/n) - gR); if (d < best) { best=d; cA=a; cB=b; } }
        if (cA > 0) data.push({ title: 'Module (6 ECTS)', count: cA, grade: da });
        if (cB > 0 && db !== da) data.push({ title: 'Module (6 ECTS)', count: cB, grade: db });
      }
    }
    pathItems = data;
  }

  return (
    <div className="p-5 md:p-8 lg:p-12 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-8">Simulator</h1>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-zinc-900 rounded-2xl p-4 border border-white/[0.03] text-center">
          <span className="text-2xl font-semibold text-zinc-100 tabular-nums">{isNaN(currentGpa) ? '–' : currentGpa.toFixed(2)}</span>
          <span className="block text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Aktuell</span>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 border border-white/[0.03] text-center">
          <span className="text-2xl font-semibold text-zinc-100 tabular-nums">{totalLpDone}</span>
          <span className="block text-[10px] text-zinc-500 uppercase tracking-wider mt-1">ECTS</span>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 border border-white/[0.03] text-center">
          <span className="text-2xl font-semibold text-zinc-100 tabular-nums">{remainingLp}</span>
          <span className="block text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Offen</span>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-5 border border-white/[0.03] mb-6">
        <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">Zielnote</label>
        <input className="bg-transparent w-full text-3xl font-semibold text-zinc-100 outline-none tabular-nums border-b border-zinc-800 pb-2 focus:border-zinc-600 transition-colors"
          type="number" min="1.00" max="4.00" step="0.01" value={targetGrade} onChange={e => setTargetGrade(parseFloat(e.target.value) || 1.0)}
        />
      </div>

      <div className={`rounded-2xl p-5 border ${
        resultType === 'error' ? 'bg-red-500/5 border-red-500/10' :
        resultType === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' :
        'bg-zinc-900 border-white/[0.03]'
      }`}>
        <p className={`text-sm leading-relaxed ${resultType === 'error' ? 'text-red-400' : resultType === 'success' ? 'text-emerald-400' : 'text-zinc-300'}`}>
          {resultMsg}
        </p>

        {resultType === 'path' && pathItems && (
          <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Optimaler Pfad</p>
            {pathItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-zinc-800/30 rounded-xl border border-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-zinc-400 tabular-nums bg-white/5 px-2 py-1 rounded">{item.count}×</span>
                  <span className="text-sm text-zinc-300">{item.title}</span>
                </div>
                <span className="text-sm font-semibold text-zinc-200 tabular-nums">{item.grade.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
