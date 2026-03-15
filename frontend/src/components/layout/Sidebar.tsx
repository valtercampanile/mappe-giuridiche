import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUiStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { getEntities } from '../../services/entities.api';
import { ENTITY_BADGE, ENTITY_COLORS } from '../../constants/theme';
import type { Entity, EntityType } from '../../types/entity.types';

const ALL_TYPES: EntityType[] = [
  'VALORE',
  'PRINCIPIO',
  'NORMA',
  'ISTITUTO',
  'QUESTIONE',
  'FUNZIONE',
  'LOGICA_INTERPRETATIVA',
  'GIURISPRUDENZA',
];

interface SidebarProps {
  onSelectEntity: (id: string) => void;
  selectedId?: string;
}

export function Sidebar({ onSelectEntity, selectedId }: SidebarProps) {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const { user, logout } = useAuth();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<EntityType | null>(null);

  const { data } = useQuery({
    queryKey: [
      'entities',
      { materiaId: 'penale', type: typeFilter, q: search || undefined, limit: 100 },
    ],
    queryFn: () =>
      getEntities({
        materiaId: 'penale',
        type: typeFilter ?? undefined,
        q: search || undefined,
        limit: 100,
      }),
  });

  const entities = data?.data ?? [];

  if (!sidebarOpen) {
    return <CompactSidebar onToggle={toggleSidebar} onSelectEntity={onSelectEntity} />;
  }

  return (
    <aside className="w-[230px] min-w-[230px] bg-sidebar-bg text-white flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/10">
        <span className="text-sm font-semibold text-white">Mappe Giuridiche</span>
        <button
          onClick={toggleSidebar}
          className="text-white/60 hover:text-white text-xs px-1"
          aria-label="Comprimi sidebar"
        >
          ‹
        </button>
      </div>

      <div className="px-3 py-2">
        <div className="flex gap-1 mb-2">
          <MateriaBtn label="Penale" active />
          <MateriaBtn label="Civile" disabled />
          <MateriaBtn label="Amm." disabled />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca entità..."
          className="w-full px-2 py-1 text-xs bg-white/10 rounded border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-sidebar-accent"
          aria-label="Cerca entità"
        />
      </div>

      <div className="px-3 py-1 flex flex-wrap gap-1">
        {ALL_TYPES.map((t) => (
          <TypeBadge
            key={t}
            type={t}
            active={typeFilter === t}
            onClick={() => setTypeFilter(typeFilter === t ? null : t)}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-1 py-1">
        {entities.map((e) => (
          <EntityRow
            key={e.id}
            entity={e}
            selected={e.id === selectedId}
            onClick={() => onSelectEntity(e.id)}
          />
        ))}
        {entities.length === 0 && (
          <p className="text-xs text-white/40 px-2 py-4 text-center">Nessuna entità trovata</p>
        )}
      </div>

      <div className="border-t border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-sidebar-accent/20 text-sidebar-accent flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">{user?.name}</p>
          </div>
          <button
            onClick={() => void logout()}
            className="text-xs text-white/40 hover:text-white"
            aria-label="Esci"
          >
            Esci
          </button>
        </div>
      </div>
    </aside>
  );
}

function CompactSidebar({
  onToggle,
  onSelectEntity: _onSelectEntity,
}: {
  onToggle: () => void;
  onSelectEntity: (id: string) => void;
}) {
  return (
    <aside className="w-[52px] min-w-[52px] bg-sidebar-bg text-white flex flex-col h-full items-center py-3 gap-3">
      <button
        onClick={onToggle}
        className="text-white/60 hover:text-white text-sm"
        aria-label="Espandi sidebar"
        title="Espandi sidebar"
      >
        ›
      </button>
      {ALL_TYPES.map((t) => (
        <span
          key={t}
          className="text-[10px] font-mono w-6 h-6 flex items-center justify-center rounded"
          style={{ color: ENTITY_COLORS[t].color, backgroundColor: ENTITY_COLORS[t].bg }}
          title={t}
        >
          {ENTITY_BADGE[t]}
        </span>
      ))}
    </aside>
  );
}

function MateriaBtn({
  label,
  active,
  disabled,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={`text-[10px] px-2 py-0.5 rounded ${
        active
          ? 'bg-sidebar-accent text-white'
          : disabled
            ? 'bg-white/5 text-white/30 cursor-not-allowed'
            : 'bg-white/10 text-white/60 hover:bg-white/20'
      }`}
      title={disabled ? 'In arrivo' : undefined}
    >
      {label}
    </button>
  );
}

function TypeBadge({
  type,
  active,
  onClick,
}: {
  type: EntityType;
  active: boolean;
  onClick: () => void;
}) {
  const colors = ENTITY_COLORS[type];
  return (
    <button
      onClick={onClick}
      className="text-[10px] font-mono px-1.5 py-0.5 rounded transition-all"
      style={{
        color: active ? '#fff' : colors.color,
        backgroundColor: active ? colors.color : colors.bg + '33',
        border: `1px solid ${active ? colors.color : 'transparent'}`,
      }}
    >
      {ENTITY_BADGE[type]}
    </button>
  );
}

function EntityRow({
  entity,
  selected,
  onClick,
}: {
  entity: Entity;
  selected: boolean;
  onClick: () => void;
}) {
  const colors = ENTITY_COLORS[entity.type];
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition-colors ${
        selected
          ? 'bg-sidebar-accent/20 text-white'
          : 'text-white/70 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span
        className="font-mono text-[10px] w-5 h-5 flex items-center justify-center rounded shrink-0"
        style={{ color: colors.color, backgroundColor: colors.bg }}
      >
        {ENTITY_BADGE[entity.type]}
      </span>
      <span className="truncate">{entity.label}</span>
      {entity.zonaGrigia && (
        <span className="text-[8px] text-error shrink-0" title="Zona critica">
          !
        </span>
      )}
    </button>
  );
}
