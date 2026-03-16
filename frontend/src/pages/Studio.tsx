import { useCallback } from 'react';
import { useUiStore } from '../stores/uiStore';
import { useNavHistory } from '../hooks/useNavHistory';
import { AppHeader } from '../components/layout/AppHeader';
import { Sidebar } from '../components/layout/Sidebar';
import { EntityCard } from '../components/features/studio/EntityCard';
import { GraphPanel } from '../components/features/studio/GraphPanel';

export default function Studio() {
  const graphOpen = useUiStore((s) => s.graphOpen);
  const { currentId, navigate, goBack, goForward, canGoBack, canGoForward } = useNavHistory('P01');

  const handleSelectEntity = useCallback(
    (id: string) => {
      navigate(id);
    },
    [navigate],
  );

  return (
    <div className="h-screen flex flex-col">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectEntity={handleSelectEntity} selectedId={currentId} />

        <EntityCard
          entityId={currentId}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onGoBack={goBack}
          onGoForward={goForward}
          onNavigate={handleSelectEntity}
        />

        {graphOpen && (
          <div className="w-[350px] min-w-[280px]">
            <GraphPanel entityId={currentId} onNavigate={handleSelectEntity} />
          </div>
        )}
      </div>
    </div>
  );
}
