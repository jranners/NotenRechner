import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { useAppConfig } from '../contexts/AppConfigContext';
import { MODULE_DATABASE } from '../data';

const DISCRETE_GRADES = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0];

export default function Simulator() {
  const { selectedModules } = useStore();
  const { t } = useAppConfig();
  const [targetGrade, setTargetGrade] = useState(1.7);

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
  const ungradedLpDone = totalLpDone - gradedLpDone;
  
  const targetTotalGradedLp = 120 - ungradedLpDone; 
  const gReq = remainingLp > 0 ? ((targetGrade * targetTotalGradedLp - gradedSum) / remainingLp) : 0;

  let resultMsg = '', resultType = '', pathItems = null;
  if (remainingLp <= 0) { resultMsg = t('simulator.done'); resultType = 'done'; }
  else if (gReq < 1.0) { resultMsg = t('simulator.error'); resultType = 'error'; }
  else if (gReq > 4.0) { resultMsg = t('simulator.success'); resultType = 'success'; }
  else {
    resultType = 'path';
    resultMsg = t('simulator.path', { gReq: gReq.toFixed(2), rem: remainingLp });
    const hasThesis = selectedModules.some(m => m.id === 'thesis' || m.id === 'ma_thesis');
    let data = [];
    if (hasThesis) {
      const n = Math.ceil(remainingLp / 6);
      let ci = 0;
      while (ci < DISCRETE_GRADES.length && DISCRETE_GRADES[ci] <= gReq) ci++;
      let da = DISCRETE_GRADES[Math.max(0, ci - 1)], db = DISCRETE_GRADES[Math.min(DISCRETE_GRADES.length - 1, ci)];
      let cA = 0, cB = n, best = 999;
      for (let a = 0; a <= n; a++) { const b = n - a; const d = Math.abs(((a*da+b*db)/n) - gReq); if (d < best) { best=d; cA=a; cB=b; } }
      if (cA > 0) data.push({ title: t('simulator.module'), count: cA, grade: da });
      if (cB > 0 && db !== da) data.push({ title: t('simulator.module'), count: cB, grade: db });
    } else {
      const lpR = remainingLp - 30;
      let cd = 999, tg = 4.0;
      for (const g of DISCRETE_GRADES) { const d = Math.abs(g - gReq); if (d < cd) { cd = d; tg = g; } }
      data.push({ title: t('simulator.thesis'), count: 1, grade: tg });
      if (lpR > 0) {
        const gR = Math.max(1.0, Math.min(4.0, (gReq * remainingLp - tg * 30) / lpR));
        const n = Math.ceil(lpR / 6);
        let ci = 0;
        while (ci < DISCRETE_GRADES.length && DISCRETE_GRADES[ci] <= gR) ci++;
        let da = DISCRETE_GRADES[Math.max(0, ci-1)], db = DISCRETE_GRADES[Math.min(DISCRETE_GRADES.length-1, ci)];
        let cA = 0, cB = n, best = 999;
        for (let a = 0; a <= n; a++) { const b = n-a; const d = Math.abs(((a*da+b*db)/n) - gR); if (d < best) { best=d; cA=a; cB=b; } }
        if (cA > 0) data.push({ title: t('simulator.module'), count: cA, grade: da });
        if (cB > 0 && db !== da) data.push({ title: t('simulator.module'), count: cB, grade: db });
      }
    }
    pathItems = data;
  }

  const handleDecrement = () => {
    setTargetGrade(prev => {
      const idx = DISCRETE_GRADES.indexOf(prev);
      if (idx === -1) return DISCRETE_GRADES[0];
      return idx === DISCRETE_GRADES.length - 1
        ? DISCRETE_GRADES[DISCRETE_GRADES.length - 1]
        : DISCRETE_GRADES[idx + 1]; // numerically higher = worse grade
    });
  };

  const handleIncrement = () => {
    setTargetGrade(prev => {
      const idx = DISCRETE_GRADES.indexOf(prev);
      if (idx === -1) return DISCRETE_GRADES[0];
      return idx === 0
        ? DISCRETE_GRADES[0]
        : DISCRETE_GRADES[idx - 1]; // numerically lower = better grade
    });
  };

  return (
    <div className="p-5 md:p-8 lg:p-12 max-w-2xl mx-auto w-full transition-colors duration-200">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-8">{t('simulator.title')}</h1>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-white/[0.03] text-center shadow-sm dark:shadow-none">
          <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">{isNaN(currentGpa) ? '–' : currentGpa.toFixed(2)}</span>
          <span className="block text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{t('simulator.current')}</span>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-white/[0.03] text-center shadow-sm dark:shadow-none">
          <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">{totalLpDone}</span>
          <span className="block text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{t('simulator.ects')}</span>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-white/[0.03] text-center shadow-sm dark:shadow-none">
          <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">{remainingLp}</span>
          <span className="block text-[10px] text-zinc-500 uppercase tracking-wider mt-1">{t('simulator.open')}</span>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.03] mb-6 shadow-sm dark:shadow-none">
        <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">{t('simulator.target')}</label>
        <div className="flex flex-col items-start">
          <div className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums leading-none">
            {targetGrade.toFixed(2)}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={handleDecrement}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700
                         bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100 hover:bg-zinc-50
                         dark:hover:bg-zinc-800 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <button
              type="button"
              onClick={handleIncrement}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-700
                         bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-100 hover:bg-zinc-50
                         dark:hover:bg-zinc-800 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-5 border ${
        resultType === 'error' ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/10' :
        resultType === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/10' :
        'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/[0.03] shadow-sm dark:shadow-none'
      }`}>
        <p className={`text-sm leading-relaxed ${resultType === 'error' ? 'text-red-600 dark:text-red-400' : resultType === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
          {resultMsg}
        </p>

        {resultType === 'path' && pathItems && (
          <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-white/5 space-y-2">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">{t('simulator.optimal')}</p>
            {pathItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-white dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 tabular-nums bg-zinc-100 dark:bg-white/5 px-2 py-1 rounded">{item.count}×</span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{item.title}</span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 tabular-nums">{item.grade.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
