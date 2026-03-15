import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUiStore } from '../stores/uiStore';
import { useNavHistory } from '../hooks/useNavHistory';
import { Sidebar } from '../components/layout/Sidebar';
import { EntityCard } from '../components/features/studio/EntityCard';
import { GraphPanel } from '../components/features/studio/GraphPanel';

const NAV_ITEMS = [
  { label: 'Studio', path: '/studio' },
  { label: 'Ripasso', path: '/ripasso' },
  { label: 'Esercitazione', path: '/esercitazione' },
  { label: 'Questioni', path: '/questioni' },
];

export default function Studio() {
  const graphOpen = useUiStore((s) => s.graphOpen);
  const location = useLocation();
  const { currentId, navigate, goBack, goForward, canGoBack, canGoForward } = useNavHistory('P01');

  const handleSelectEntity = useCallback(
    (id: string) => {
      navigate(id);
    },
    [navigate],
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="h-11 min-h-[44px] bg-white border-b border-border flex items-center px-4 gap-6">
        <span className="text-sm font-bold text-primary">Mappe Giuridiche</span>
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

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
