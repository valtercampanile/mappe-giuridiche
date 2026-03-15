import { useState } from 'react';

interface Props {
  entityId: string;
}

export function TabNota({ entityId: _entityId }: Props) {
  const [nota, setNota] = useState('');
  // TODO: collegare a PUT /api/v1/user/notes/:entityId quando l'endpoint sarà implementato

  return (
    <div className="px-6 py-4 max-w-3xl">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
        Note personali
      </p>
      <textarea
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        placeholder="Scrivi le tue note su questa entità..."
        className="w-full h-48 px-3 py-2 text-sm border border-border rounded resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        aria-label="Note personali"
      />
      <p className="text-xs text-text-secondary mt-1">
        Le note saranno salvate automaticamente (funzionalità in arrivo)
      </p>
    </div>
  );
}
