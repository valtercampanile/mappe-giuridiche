import { Link } from 'react-router-dom';
import type { Entity, Tesi, StatoQuestione } from '../../../types/entity.types';

const STATO_COLORS: Record<string, string> = {
  aperta: 'bg-gray-100 text-gray-600',
  controversa: 'bg-warning/10 text-warning',
  prevalente: 'bg-primary/10 text-primary',
  risolta: 'bg-success/10 text-success',
};

const TESI_BORDER_COLORS = ['#0066CC', '#8B1A1A', '#006D3D', '#5B1A70', '#7A5800'];

interface Props {
  entity: Entity;
}

export function QuestioneDetail({ entity }: Props) {
  const d = entity.data;
  const stato = (d.stato as StatoQuestione) ?? 'aperta';
  const formulazione = (d.formulazione as string) ?? '';
  const tesi = (d.tesi as Tesi[]) ?? [];
  const posizione = (d.posizione_docente ?? d.docente ?? '') as string;
  const istituti = (d.istituti_coinvolti as string[]) ?? [];
  const principi = (d.principi_in_gioco as string[]) ?? [];
  const statoStyle = STATO_COLORS[stato] ?? STATO_COLORS.aperta;

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs px-2 py-0.5 rounded font-bold bg-[#F4ECF7] text-[#5B1A70] border border-[#5B1A70]/20">
            Q
          </span>
          <span className="text-xs text-text-secondary font-mono">[{entity.id}]</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statoStyle}`}>
            {stato}
          </span>
          {entity.zonaGrigia && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-error/10 text-error font-semibold">
              zona critica
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold text-text-primary leading-snug">{entity.label}</h2>
      </div>

      <div className="px-6 py-4 max-w-3xl">
        {/* Formulazione */}
        {formulazione && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
              Formulazione
            </p>
            <p className="font-serif text-base leading-[1.8] text-text-primary">{formulazione}</p>
          </div>
        )}

        {/* Contesto */}
        {(istituti.length > 0 || principi.length > 0) && (
          <div className="mb-5">
            {istituti.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-text-secondary mb-1">Istituti coinvolti</p>
                <div className="flex flex-wrap gap-1">
                  {istituti.map((id) => (
                    <EntityPill key={id} id={id} />
                  ))}
                </div>
              </div>
            )}
            {principi.length > 0 && (
              <div>
                <p className="text-xs text-text-secondary mb-1">Principi in gioco</p>
                <div className="flex flex-wrap gap-1">
                  {principi.map((id) => (
                    <EntityPill key={id} id={id} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tesi a confronto */}
        {tesi.length > 0 && (
          <div className="mb-5">
            <div className="border-t border-border pt-4 mb-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Tesi a confronto
              </p>
            </div>
            <div className="space-y-3">
              {tesi.map((t, i) => (
                <div
                  key={i}
                  className="pl-4 py-3 pr-3 rounded bg-surface"
                  style={{
                    borderLeft: `3px solid ${TESI_BORDER_COLORS[i % TESI_BORDER_COLORS.length]}`,
                  }}
                >
                  <p className="text-sm font-semibold text-text-primary mb-1">{t.label}</p>
                  <p className="text-[13px] leading-[1.7] text-text-primary">{t.contenuto}</p>
                  {t.autori && t.autori.length > 0 && (
                    <p className="text-[11px] text-text-secondary mt-2 italic">
                      {t.autori.join(', ')}
                    </p>
                  )}
                  {t.giurisprudenza && t.giurisprudenza.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {t.giurisprudenza.map((g) => (
                        <span
                          key={g}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-border text-text-secondary"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posizione docente */}
        {posizione && (
          <div className="mb-5">
            <div className="border-t border-border pt-4 mb-3">
              <p className="text-xs font-semibold text-success uppercase tracking-wide">
                Posizione del docente
              </p>
            </div>
            <div
              className="pl-4 py-3 pr-3 rounded"
              style={{ backgroundColor: '#E3F4EC', borderLeft: '3px solid #006D3D' }}
            >
              <p className="text-sm text-text-primary leading-relaxed">{posizione}</p>
            </div>
          </div>
        )}

        {/* Link a Studio */}
        <div className="border-t border-border pt-4">
          <Link
            to={`/studio?entity=${entity.id}`}
            className="text-xs text-primary hover:underline font-semibold"
          >
            Apri in Studio →
          </Link>
        </div>
      </div>
    </div>
  );
}

function EntityPill({ id }: { id: string }) {
  return (
    <Link
      to={`/studio?entity=${id}`}
      className="text-[11px] px-2 py-0.5 rounded bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
    >
      {id}
    </Link>
  );
}
