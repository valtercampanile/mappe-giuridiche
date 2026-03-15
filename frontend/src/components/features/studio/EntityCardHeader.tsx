import type { Entity } from '../../../types/entity.types';
import { ENTITY_BADGE, ENTITY_COLORS, ENTITY_LABELS } from '../../../constants/theme';

interface Props {
  entity: Entity;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
}

export function EntityCardHeader({
  entity,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
}: Props) {
  const colors = ENTITY_COLORS[entity.type];

  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={onGoBack}
          disabled={!canGoBack}
          className="text-text-secondary hover:text-primary disabled:opacity-30 text-lg leading-none"
          aria-label="Indietro"
        >
          ←
        </button>
        <button
          onClick={onGoForward}
          disabled={!canGoForward}
          className="text-text-secondary hover:text-primary disabled:opacity-30 text-lg leading-none"
          aria-label="Avanti"
        >
          →
        </button>
        <span
          className="font-mono text-xs px-2 py-0.5 rounded font-bold"
          style={{
            color: colors.color,
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
        >
          {ENTITY_BADGE[entity.type]}
        </span>
        <span className="text-xs text-text-secondary font-mono">[{entity.id}]</span>
        <span className="text-sm font-semibold text-text-primary">
          {ENTITY_LABELS[entity.type]}
        </span>
        <span className="text-text-secondary mx-1">·</span>
        <span className="text-sm text-text-primary font-semibold flex-1">{entity.label}</span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            entity.fonte === 'DOCENTE' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
          }`}
        >
          {entity.fonte === 'DOCENTE' ? 'docente' : 'AI'}
        </span>
        {entity.zonaGrigia && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-error/10 text-error font-semibold">
            zona critica
          </span>
        )}
      </div>
    </div>
  );
}
