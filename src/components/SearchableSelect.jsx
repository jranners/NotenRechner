import React, { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ options, value, onChange, placeholder, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selected = options.find(o => o.id === value);
  const filtered = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const close = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) { setIsOpen(false); setSearch(''); } };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => { if (isOpen && inputRef.current) inputRef.current.focus(); }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => { if (!disabled) setIsOpen(!isOpen); }} disabled={disabled}
        className={`w-full bg-zinc-800/40 border rounded-lg text-left py-3 px-3 text-sm flex items-center justify-between transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed border-white/5' : 'cursor-pointer border-white/5 hover:border-zinc-600'
        } ${isOpen ? 'border-zinc-600' : ''}`}
      >
        <span className={selected ? 'text-zinc-200' : 'text-zinc-500'}>{selected ? `${selected.name} (${selected.lp} ECTS)` : placeholder}</span>
        <span className={`material-symbols-outlined text-zinc-500 text-[18px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-[110] mt-1 bg-zinc-900 border border-white/5 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2.5 border-b border-white/5">
            <input ref={inputRef} type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Suchen..."
              className="w-full bg-zinc-800/60 text-zinc-200 text-sm py-2 px-3 rounded-lg border border-white/5 outline-none focus:border-zinc-600 placeholder:text-zinc-600 transition-colors"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-zinc-600 text-sm">Keine Ergebnisse</div>
            ) : filtered.map(opt => (
              <button key={opt.id} type="button" onClick={() => { onChange(opt.id); setIsOpen(false); setSearch(''); }}
                className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${value === opt.id ? 'bg-white/5 text-zinc-100' : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'}`}
              >
                <span className="block truncate">{opt.name}</span>
                <span className="text-[10px] text-zinc-600">{opt.lp} ECTS</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
