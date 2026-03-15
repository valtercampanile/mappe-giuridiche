import type { Entity } from '../../../types/entity.types';

interface Manifestazione {
  contesto: string;
  lezione?: string;
  istituti?: string[];
  giurisprudenza?: string[];
  esito?: string;
}

interface Props {
  entity: Entity;
}

export function TabManifestazioni({ entity }: Props) {
  const manifestazioni = entity.data.manifestazioni as Manifestazione[] | undefined;

  if (!manifestazioni || manifestazioni.length === 0) {
    return (
      <p className="px-6 py-4 text-sm text-text-secondary">Nessuna manifestazione disponibile</p>
    );
  }

  return (
    <div className="px-6 py-4 max-w-3xl space-y-3">
      {manifestazioni.map((m, i) => (
        <div key={i} className="border border-border rounded p-3">
          <p className="text-sm font-semibold text-text-primary mb-1">{m.contesto}</p>
          {m.esito && <p className="text-sm text-text-secondary leading-relaxed">{m.esito}</p>}
          {m.lezione && (
            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-primary/5 text-primary">
              {m.lezione}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
