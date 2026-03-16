import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { approveUpload } from '../../../services/admin.api';
import type { JsonEntity, ApproveResult } from '../../../services/admin.api';
import { ENTITY_BADGE, ENTITY_COLORS } from '../../../constants/theme';
import type { EntityType } from '../../../types/entity.types';
import { EntityPreview } from './EntityPreview';

const TYPE_MAP: Record<string, string> = {
  valore: 'VALORE',
  principio: 'PRINCIPIO',
  norma: 'NORMA',
  istituto: 'ISTITUTO',
  questione: 'QUESTIONE',
  funzione: 'FUNZIONE',
  logica_interpretativa: 'LOGICA_INTERPRETATIVA',
  giurisprudenza: 'GIURISPRUDENZA',
  tensione: 'TENSIONE',
};

interface Props {
  uploadId: string;
  entities: JsonEntity[];
  relationsCount: number;
}

export function UploadReview({ uploadId, entities: initialEntities, relationsCount }: Props) {
  const [entities, setEntities] = useState<JsonEntity[]>(initialEntities);
  const [selected, setSelected] = useState<Set<string>>(new Set(entities.map((e) => e.id)));
  const [previewId, setPreviewId] = useState<string | null>(entities[0]?.id ?? null);
  const [result, setResult] = useState<ApproveResult | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleAll = (on: boolean) => {
    setSelected(on ? new Set(entities.map((e) => e.id)) : new Set());
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleUpdateEntity = useCallback((updated: JsonEntity) => {
    setEntities((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }, []);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const approved = Array.from(selected);
      const rejected = entities.filter((e) => !selected.has(e.id)).map((e) => e.id);
      // TODO: inviare le entità modificate al backend quando l'endpoint lo supporterà
      const res = await approveUpload(uploadId, approved, rejected);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const preview = entities.find((e) => e.id === previewId);

  if (result) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 p-4 rounded bg-success/5 border border-success/20 inline-block">
          <p className="text-lg font-semibold text-success mb-2">Importazione completata</p>
          <p className="text-sm text-text-primary">
            {String(result.inserted)} inserite, {String(result.updated)} aggiornate,{' '}
            {String(result.skipped)} saltate, {String(result.relInserted)} relazioni
          </p>
        </div>
        <div>
          <Link to="/studio" className="text-sm text-primary hover:underline font-semibold">
            Vai a Studio per verificare →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 py-3 border-b border-border bg-white flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {String(entities.length)} entità, {String(relationsCount)} relazioni
          </p>
          <p className="text-xs text-text-secondary">
            {String(selected.size)} selezionate per l'importazione
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => toggleAll(true)} className="text-xs text-primary hover:underline">
            Seleziona tutte
          </button>
          <button
            onClick={() => toggleAll(false)}
            className="text-xs text-text-secondary hover:underline"
          >
            Deseleziona
          </button>
        </div>
      </div>

      <div className="flex" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="w-[380px] border-r border-border overflow-y-auto">
          {entities.map((e) => {
            const mt = (TYPE_MAP[e.type.toLowerCase()] ?? e.type.toUpperCase()) as EntityType;
            const c = ENTITY_COLORS[mt] ?? ENTITY_COLORS.ISTITUTO;
            return (
              <div
                key={e.id}
                className={`flex items-center gap-2 px-3 py-2 border-b border-border cursor-pointer hover:bg-surface ${previewId === e.id ? 'bg-primary/5' : ''}`}
                onClick={() => setPreviewId(e.id)}
              >
                <input
                  type="checkbox"
                  checked={selected.has(e.id)}
                  onChange={() => toggle(e.id)}
                  onClick={(ev) => ev.stopPropagation()}
                  className="shrink-0"
                />
                <span
                  className="font-mono text-[10px] w-5 h-5 flex items-center justify-center rounded shrink-0 font-bold"
                  style={{ color: c.color, backgroundColor: c.bg }}
                >
                  {ENTITY_BADGE[mt] ?? '?'}
                </span>
                <span className="text-[10px] text-text-secondary font-mono">{e.id}</span>
                <span className="text-xs text-text-primary truncate flex-1">{e.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {preview ? (
            <EntityPreview entity={preview} onUpdateEntity={handleUpdateEntity} />
          ) : (
            <p className="text-text-secondary text-sm">Seleziona un'entità</p>
          )}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border bg-white">
        <button
          onClick={() => void handleApprove()}
          disabled={loading || selected.size === 0}
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary-dark disabled:opacity-50"
        >
          {loading ? 'Importazione...' : `Approva ${String(selected.size)} selezionate`}
        </button>
      </div>
    </div>
  );
}
