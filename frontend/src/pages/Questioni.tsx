import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQuestioni } from '../services/entities.api';
import { AppHeader } from '../components/layout/AppHeader';
import { QuestioniFilterBar } from '../components/features/questioni/QuestioniFilters';
import { QuestioneCard } from '../components/features/questioni/QuestioneCard';
import { QuestioneDetail } from '../components/features/questioni/QuestioneDetail';
import type { StatoQuestione } from '../types/entity.types';

export default function Questioni() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statoFilter, setStatoFilter] = useState<StatoQuestione | null>(null);
  const [zonaGrigia, setZonaGrigia] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data } = useQuery({
    queryKey: ['questioni', { zonaGrigia: zonaGrigia || undefined, q: searchQuery || undefined }],
    queryFn: () =>
      getQuestioni({
        zonaGrigia: zonaGrigia || undefined,
        q: searchQuery || undefined,
      }),
  });

  const allQuestioni = data?.data ?? [];

  const questioni = statoFilter
    ? allQuestioni.filter((e) => (e.data.stato as string) === statoFilter)
    : allQuestioni;

  useEffect(() => {
    if (questioni.length > 0 && !selectedId) {
      setSelectedId(questioni[0].id);
    }
  }, [questioni, selectedId]);

  const selectedEntity = questioni.find((e) => e.id === selectedId);

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    setSelectedId(null);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[380px] min-w-[380px] border-r border-border flex flex-col bg-white">
          <QuestioniFilterBar
            stato={statoFilter}
            onStatoChange={setStatoFilter}
            zonaGrigia={zonaGrigia}
            onZonaGrigiaChange={setZonaGrigia}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            count={questioni.length}
          />
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {questioni.map((q) => (
              <QuestioneCard
                key={q.id}
                entity={q}
                selected={q.id === selectedId}
                onClick={() => setSelectedId(q.id)}
              />
            ))}
            {questioni.length === 0 && (
              <p className="text-sm text-text-secondary p-6 text-center">
                Nessuna questione trovata
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white">
          {selectedEntity ? (
            <QuestioneDetail entity={selectedEntity} />
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary">
              <p>Seleziona una questione dalla lista</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
