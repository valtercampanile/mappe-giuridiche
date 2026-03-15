import type { Entity, Relation } from '../../../types/entity.types';
import { ENTITY_BADGE, ENTITY_COLORS } from '../../../constants/theme';

interface Props {
  entity: Entity;
  edges: Relation[];
  nodes: Entity[];
  onNavigate: (id: string) => void;
}

export function TabConnessioni({ entity, edges, nodes, onNavigate }: Props) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const outgoing = edges.filter((e) => e.fromId === entity.id);
  const incoming = edges.filter((e) => e.toId === entity.id);

  return (
    <div className="px-6 py-4">
      {outgoing.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Relazioni in uscita ({String(outgoing.length)})
          </p>
          {outgoing.map((r) => (
            <RelationRow
              key={r.id}
              relation={r}
              target={nodeMap.get(r.toId)}
              direction="to"
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
      {incoming.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Relazioni in entrata ({String(incoming.length)})
          </p>
          {incoming.map((r) => (
            <RelationRow
              key={r.id}
              relation={r}
              target={nodeMap.get(r.fromId)}
              direction="from"
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
      {outgoing.length === 0 && incoming.length === 0 && (
        <p className="text-sm text-text-secondary py-4">Nessuna connessione trovata</p>
      )}
    </div>
  );
}

function RelationRow({
  relation,
  target,
  direction,
  onNavigate,
}: {
  relation: Relation;
  target: Entity | undefined;
  direction: 'to' | 'from';
  onNavigate: (id: string) => void;
}) {
  if (!target) return null;
  const colors = ENTITY_COLORS[target.type];
  const isTensione = relation.type === 'TENSIONE';

  return (
    <button
      onClick={() => onNavigate(target.id)}
      className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-surface text-left transition-colors group"
    >
      <span className="text-xs text-text-secondary w-12 shrink-0">
        {direction === 'to' ? '→' : '←'} {relation.type.toLowerCase().replace('_', ' ')}
      </span>
      <span
        className="font-mono text-[10px] w-5 h-5 flex items-center justify-center rounded shrink-0"
        style={{ color: colors.color, backgroundColor: colors.bg }}
      >
        {ENTITY_BADGE[target.type]}
      </span>
      <span className="text-sm text-text-primary group-hover:text-primary truncate">
        {target.label}
      </span>
      {isTensione && <span className="text-[10px] text-error ml-auto shrink-0">tensione</span>}
    </button>
  );
}
