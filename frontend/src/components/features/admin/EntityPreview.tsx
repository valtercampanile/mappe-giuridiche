import { useState } from 'react';
import type { JsonEntity } from '../../../services/admin.api';
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

function field(entity: JsonEntity, ...names: string[]): unknown {
  const nested =
    typeof entity.data === 'object' && entity.data !== null && !Array.isArray(entity.data)
      ? (entity.data as Record<string, unknown>)
      : null;
  for (const name of names) {
    const val = entity[name] ?? nested?.[name];
    if (val !== undefined && val !== null) return val;
  }
  return undefined;
}

interface Props {
  entity: JsonEntity;
  onUpdateEntity: (updated: JsonEntity) => void;
}

export function EntityPreview({ entity, onUpdateEntity }: Props) {
  const mappedType = (TYPE_MAP[entity.type.toLowerCase()] ??
    entity.type.toUpperCase()) as EntityType;
  const colors = ENTITY_COLORS[mappedType] ?? ENTITY_COLORS.ISTITUTO;
  const badge = ENTITY_BADGE[mappedType] ?? '?';
  const mainText = (field(
    entity,
    'definizione',
    'descrizione',
    'formulazione',
    'testo_breve',
    'principio_affermato',
    'def',
  ) ??
    field(entity, 'short') ??
    '') as string;
  const fonte = ((field(entity, 'fonte') as string) ?? 'docente').toLowerCase();
  const fondamento = field(entity, 'fondamento_normativo') as string[] | undefined;
  const tags = entity.tags ?? (field(entity, 'tags') as string[] | undefined) ?? [];

  const [editingLabel, setEditingLabel] = useState(false);
  const [editingDef, setEditingDef] = useState(false);
  const [draftLabel, setDraftLabel] = useState(entity.label);
  const [draftDef, setDraftDef] = useState(mainText);

  const saveLabel = () => {
    onUpdateEntity({ ...entity, label: draftLabel });
    setEditingLabel(false);
  };

  const saveDef = () => {
    const nested =
      typeof entity.data === 'object' && entity.data !== null && !Array.isArray(entity.data)
        ? (entity.data as Record<string, unknown>)
        : null;
    if (nested && 'definizione' in nested) {
      onUpdateEntity({ ...entity, data: { ...nested, definizione: draftDef } });
    } else if ('definizione' in entity) {
      onUpdateEntity({ ...entity, definizione: draftDef });
    } else if (nested) {
      onUpdateEntity({ ...entity, data: { ...nested, definizione: draftDef } });
    } else {
      onUpdateEntity({ ...entity, definizione: draftDef });
    }
    setEditingDef(false);
  };

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

      {/* Label — editable */}
      <div className="mb-3">
        {editingLabel ? (
          <div className="flex gap-2 items-center">
            <input
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              className="flex-1 text-sm font-semibold px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button onClick={saveLabel} className="text-[10px] text-primary font-semibold">
              Salva
            </button>
            <button
              onClick={() => {
                setDraftLabel(entity.label);
                setEditingLabel(false);
              }}
              className="text-[10px] text-text-secondary"
            >
              Annulla
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-primary">{entity.label}</p>
            <button
              onClick={() => setEditingLabel(true)}
              className="text-[10px] text-primary hover:underline"
            >
              Modifica
            </button>
          </div>
        )}
      </div>

      {/* Definizione — editable */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[10px] text-text-secondary uppercase">Definizione / Testo</p>
          {!editingDef && mainText && (
            <button
              onClick={() => {
                setDraftDef(mainText);
                setEditingDef(true);
              }}
              className="text-[10px] text-primary hover:underline"
            >
              Modifica
            </button>
          )}
        </div>
        {editingDef ? (
          <div>
            <textarea
              value={draftDef}
              onChange={(e) => setDraftDef(e.target.value)}
              rows={6}
              className="w-full text-sm font-serif leading-[1.7] px-3 py-2 border border-border rounded resize-y focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2 mt-1">
              <button onClick={saveDef} className="text-[10px] text-primary font-semibold">
                Salva
              </button>
              <button
                onClick={() => {
                  setDraftDef(mainText);
                  setEditingDef(false);
                }}
                className="text-[10px] text-text-secondary"
              >
                Annulla
              </button>
            </div>
          </div>
        ) : mainText ? (
          <p className="font-serif text-sm text-text-primary leading-[1.7]">{mainText}</p>
        ) : (
          <p className="text-xs text-text-secondary italic">Nessun testo disponibile</p>
        )}
      </div>

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

      {tags.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-text-secondary uppercase mb-1">Tags</p>
          <div className="flex flex-wrap gap-1">
            {tags.map((t) => (
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
