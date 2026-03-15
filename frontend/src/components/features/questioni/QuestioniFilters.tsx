import { useState, useEffect } from 'react';
import type { StatoQuestione } from '../../../types/entity.types';

const STATI: { value: StatoQuestione | null; label: string }[] = [
  { value: null, label: 'Tutte' },
  { value: 'aperta', label: 'Aperta' },
  { value: 'controversa', label: 'Controversa' },
  { value: 'prevalente', label: 'Prevalente' },
  { value: 'risolta', label: 'Risolta' },
];

interface Props {
  stato: StatoQuestione | null;
  onStatoChange: (s: StatoQuestione | null) => void;
  zonaGrigia: boolean;
  onZonaGrigiaChange: (v: boolean) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  count: number;
}

export function QuestioniFilterBar({
  stato,
  onStatoChange,
  zonaGrigia,
  onZonaGrigiaChange,
  searchQuery,
  onSearchChange,
  count,
}: Props) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => onSearchChange(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div className="px-4 py-3 border-b border-border bg-white">
      <div className="flex items-center gap-1 mb-2 flex-wrap">
        {STATI.map((s) => (
          <button
            key={s.value ?? 'all'}
            onClick={() => onStatoChange(s.value)}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              stato === s.value
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-primary/10'
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => onZonaGrigiaChange(!zonaGrigia)}
          className={`px-3 py-1 text-xs font-semibold rounded transition-colors ml-1 ${
            zonaGrigia
              ? 'bg-error/10 text-error border border-error/30'
              : 'bg-surface text-text-secondary hover:bg-error/5'
          }`}
        >
          Zona critica
        </button>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Cerca questioni..."
          className="flex-1 px-3 py-1.5 text-xs border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-label="Cerca questioni"
        />
        <span className="text-xs text-text-secondary shrink-0">{String(count)} questioni</span>
      </div>
    </div>
  );
}
