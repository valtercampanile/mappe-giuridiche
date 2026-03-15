import { useState } from 'react';
import { useEntity, useEntityGraph } from '../../../hooks/useEntity';
import { useUiStore } from '../../../stores/uiStore';
import { EntityCardHeader } from './EntityCardHeader';
import { TabInquadramento } from './TabInquadramento';
import { TabConnessioni } from './TabConnessioni';
import { TabTesi } from './TabTesi';
import { TabManifestazioni } from './TabManifestazioni';
import { TabNota } from './TabNota';

type TabId = 'inquadramento' | 'connessioni' | 'tesi' | 'manifestazioni' | 'nota';

interface Props {
  entityId: string | undefined;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onNavigate: (id: string) => void;
}

export function EntityCard({
  entityId,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onNavigate,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('inquadramento');
  const { data: entity, isLoading } = useEntity(entityId);
  const graphOpen = useUiStore((s) => s.graphOpen);
  const toggleGraph = useUiStore((s) => s.toggleGraph);
  const { data: graph } = useEntityGraph(entityId);

  if (!entityId) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-secondary">
        <p>Seleziona un'entità dalla sidebar</p>
      </div>
    );
  }

  if (isLoading || !entity) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-secondary">
        <p>Caricamento...</p>
      </div>
    );
  }

  const showTesi = entity.type === 'QUESTIONE' || entity.type === 'TENSIONE';
  const showManifestazioni = entity.type === 'TENSIONE';

  const tabs: { id: TabId; label: string; show: boolean }[] = [
    { id: 'inquadramento', label: 'Inquadramento', show: true },
    { id: 'connessioni', label: 'Connessioni', show: true },
    { id: 'tesi', label: 'Tesi', show: showTesi },
    { id: 'manifestazioni', label: 'Manifestazioni', show: showManifestazioni },
    { id: 'nota', label: 'Nota', show: true },
  ];

  const visibleTabs = tabs.filter((t) => t.show);
  const safeTab = visibleTabs.some((t) => t.id === activeTab) ? activeTab : 'inquadramento';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      <EntityCardHeader
        entity={entity}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={onGoBack}
        onGoForward={onGoForward}
      />

      <div className="flex items-center border-b border-border px-4">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              safeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={toggleGraph}
            className="text-xs text-text-secondary hover:text-primary px-2 py-1"
            aria-label={graphOpen ? 'Nascondi grafo' : 'Mostra grafo'}
          >
            {graphOpen ? 'Nascondi grafo' : 'Mostra grafo'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {safeTab === 'inquadramento' && <TabInquadramento entity={entity} />}
        {safeTab === 'connessioni' && (
          <TabConnessioni
            entity={entity}
            edges={graph?.edges ?? []}
            nodes={graph?.nodes ?? []}
            onNavigate={onNavigate}
          />
        )}
        {safeTab === 'tesi' && <TabTesi entity={entity} />}
        {safeTab === 'manifestazioni' && <TabManifestazioni entity={entity} />}
        {safeTab === 'nota' && <TabNota entityId={entity.id} />}
      </div>
    </div>
  );
}
