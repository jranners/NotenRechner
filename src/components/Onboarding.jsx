import React, { useState } from 'react';
import { useStore } from '../StoreContext';

const OPTIONS = [
  { id: 'emda', label: 'Empirical Methods and Data Analysis' },
  { id: 'mep', label: 'Markets and Economic Policy' },
  { id: 'mdb', label: 'Market Design and Behavior' },
  { id: 'ecc', label: 'Energy and Climate Change' }
];

export default function Onboarding() {
  const { setSpecialization } = useStore();
  const [selected, setSelected] = useState('emda');

  return (
    <div className="h-dvh w-screen bg-zinc-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Willkommen</h1>
          <p className="text-sm text-zinc-500 mt-2 leading-relaxed">Wähle deinen Schwerpunkt für das M.Sc. Economics Programm.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setSpecialization(selected); }} className="space-y-3">
          {OPTIONS.map(opt => (
            <label key={opt.id}
              className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${
                selected === opt.id ? 'bg-white/5 border-zinc-600' : 'bg-zinc-900 border-white/[0.03] hover:border-zinc-700'
              }`}
            >
              <input type="radio" name="spec" value={opt.id} checked={selected === opt.id} onChange={() => setSelected(opt.id)} className="sr-only" />
              <div className="flex-1">
                <span className="text-sm font-medium text-zinc-200 block">{opt.label}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 block">Schwerpunkt</span>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                selected === opt.id ? 'border-zinc-400' : 'border-zinc-700'
              }`}>
                {selected === opt.id && <div className="w-2 h-2 rounded-full bg-zinc-300" />}
              </div>
            </label>
          ))}

          <div className="flex gap-3 pt-6">
            <button type="button" onClick={() => setSpecialization('skipped')}
              className="flex-1 py-3 rounded-xl border border-white/5 text-zinc-500 text-sm font-medium hover:bg-white/[0.03] transition-colors">
              Überspringen
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all">
              Weiter
            </button>
          </div>
        </form>

        <div className="mt-10 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}
