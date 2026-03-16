import { useState } from 'react';
import { Link } from 'react-router-dom';
import { approveUpload } from '../../../services/admin.api';
import type { JsonEntity, ApproveResult } from '../../../services/admin.api';
import { ENTITY_BADGE, ENTITY_COLORS, ENTITY_LABELS } from '../../../constants/theme';
import type { EntityType } from '../../../types/entity.types';

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

export function UploadReview({ uploadId, entities, relationsCount }: Props) {
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

  const handleApprove = async () => {
    setLoading(true);
    try {
      const approved = Array.from(selected);
      const rejected = entities.filter((e) => !selected.has(e.id)).map((e) => e.id);
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
            const mappedType = (TYPE_MAP[e.type.toLowerCase()] ??
              e.type.toUpperCase()) as EntityType;
            const colors = ENTITY_COLORS[mappedType] ?? ENTITY_COLORS.ISTITUTO;
            const badge = ENTITY_BADGE[mappedType] ?? '?';
            return (
              <div
                key={e.id}
                className={`flex items-center gap-2 px-3 py-2 border-b border-border cursor-pointer hover:bg-surface ${
                  previewId === e.id ? 'bg-primary/5' : ''
                }`}
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
                  style={{ color: colors.color, backgroundColor: colors.bg }}
                >
                  {badge}
                </span>
                <span className="text-[10px] text-text-secondary font-mono">{e.id}</span>
                <span className="text-xs text-text-primary truncate flex-1">{e.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {preview ? (
            <EntityPreview entity={preview} />
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

function EntityPreview({ entity }: { entity: JsonEntity }) {
  const mappedType = (TYPE_MAP[entity.type.toLowerCase()] ??
    entity.type.toUpperCase()) as EntityType;
  const colors = ENTITY_COLORS[mappedType] ?? ENTITY_COLORS.ISTITUTO;
  const badge = ENTITY_BADGE[mappedType] ?? '?';
  const rawDef = (entity.definizione ??
    entity.descrizione ??
    entity.formulazione ??
    entity.testo_breve ??
    entity.principio_affermato ??
    entity.def ??
    '') as string;
  const shortText = (entity.short ?? '') as string;
  const mainText = rawDef || shortText;
  const truncated = mainText.length > 400 ? mainText.slice(0, 400) + '...' : mainText;
  const fonte = ((entity.fonte as string) ?? 'docente').toLowerCase();
  const fondamento = entity.fondamento_normativo as string[] | undefined;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="font-mono text-xs px-2 py-0.5 rounded font-bold"
          style={{
            color: colors.color,
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
        >
          {badge}
        </span>
        <span className="text-xs font-mono text-text-secondary">[{entity.id}]</span>
        <span className="text-sm font-semibold text-text-primary">{entity.label}</span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            fonte === 'ai' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
          }`}
        >
          {fonte === 'ai' ? 'AI' : 'docente'}
        </span>
      </div>

      <p className="text-[10px] text-text-secondary uppercase tracking-wide mb-1">
        {ENTITY_LABELS[mappedType] ?? entity.type}
      </p>

      {truncated && (
        <p className="font-serif text-sm text-text-primary leading-[1.7] mb-3">{truncated}</p>
      )}

      {shortText && shortText !== mainText && (
        <div className="mb-3 p-2 bg-surface rounded border border-border">
          <p className="text-[10px] text-text-secondary uppercase mb-0.5">Sintesi</p>
          <p className="text-xs text-text-primary">{shortText}</p>
        </div>
      )}

      {fondamento && fondamento.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-text-secondary uppercase mb-1">Fondamento normativo</p>
          <div className="flex flex-wrap gap-1">
            {fondamento.map((f) => (
              <span
                key={f}
                className="text-[10px] px-2 py-0.5 rounded bg-primary/5 text-primary border border-primary/20"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {entity.tags && entity.tags.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-text-secondary uppercase mb-1">Tags</p>
          <div className="flex flex-wrap gap-1">
            {entity.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
