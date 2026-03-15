import type { Entity, StatoQuestione } from '../../../types/entity.types';

const STATO_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  aperta: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-l-gray-400' },
  controversa: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-l-warning' },
  prevalente: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-l-primary' },
  risolta: { bg: 'bg-success/10', text: 'text-success', border: 'border-l-success' },
};

interface Props {
  entity: Entity;
  selected: boolean;
  onClick: () => void;
}

export function QuestioneCard({ entity, selected, onClick }: Props) {
  const stato = (entity.data.stato as StatoQuestione) ?? 'aperta';
  const formulazione = (entity.data.formulazione as string) ?? '';
  const styles = STATO_STYLES[stato] ?? STATO_STYLES.aperta;
  const truncated = formulazione.length > 80 ? formulazione.slice(0, 80) + '...' : formulazione;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-3 border-l-3 transition-colors ${styles.border} ${
        selected ? 'bg-primary/5 border-l-primary' : 'bg-white hover:bg-surface'
      }`}
      style={{ borderLeftWidth: selected ? 4 : 3 }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-[10px] w-5 h-5 flex items-center justify-center rounded shrink-0 bg-[#F4ECF7] text-[#5B1A70] font-bold">
          Q
        </span>
        <span className="text-[10px] text-text-secondary font-mono">{entity.id}</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${styles.bg} ${styles.text}`}
        >
          {stato}
        </span>
        {entity.zonaGrigia && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-error/10 text-error font-semibold">
            zona critica
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-text-primary leading-snug">{entity.label}</p>
      {truncated && (
        <p className="text-[11px] text-text-secondary mt-1 leading-snug">{truncated}</p>
      )}
    </button>
  );
}
