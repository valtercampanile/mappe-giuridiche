import type { Entity } from '../../../types/entity.types';

interface Tesi {
  label: string;
  contenuto: string;
  autori?: string[];
  giurisprudenza?: string[];
  logiche_usate?: string[];
}

interface Props {
  entity: Entity;
}

export function TabTesi({ entity }: Props) {
  const tesi = entity.data.tesi as Tesi[] | undefined;
  const posizione = entity.data.posizione_docente as string | undefined;
  const formulazione = entity.data.formulazione as string | undefined;

  if (!tesi || tesi.length === 0) {
    return <p className="px-6 py-4 text-sm text-text-secondary">Nessuna tesi disponibile</p>;
  }

  return (
    <div className="px-6 py-4 max-w-3xl">
      {formulazione && (
        <p className="font-serif text-base text-text-primary mb-4 italic">{formulazione}</p>
      )}

      <div className="space-y-3">
        {tesi.map((t, i) => (
          <div key={i} className="border border-border rounded p-3">
            <p className="text-sm font-semibold text-text-primary mb-1">{t.label}</p>
            <p className="text-sm text-text-secondary leading-relaxed">{t.contenuto}</p>
            {t.autori && t.autori.length > 0 && (
              <p className="text-xs text-text-secondary mt-1">Autori: {t.autori.join(', ')}</p>
            )}
          </div>
        ))}
      </div>

      {posizione && (
        <div className="mt-4 p-3 rounded bg-success/5 border border-success/20">
          <p className="text-xs font-semibold text-success uppercase mb-1">Posizione del docente</p>
          <p className="text-sm text-text-primary">{posizione}</p>
        </div>
      )}
    </div>
  );
}
