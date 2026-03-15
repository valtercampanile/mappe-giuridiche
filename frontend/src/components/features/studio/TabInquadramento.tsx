import { useState } from 'react';
import type { Entity } from '../../../types/entity.types';

interface Props {
  entity: Entity;
}

export function TabInquadramento({ entity }: Props) {
  const d = entity.data;
  const definizione = (d.definizione ?? d.def ?? '') as string;
  const fondamento = d.fondamento_normativo as string[] | undefined;
  const autoApplicativo = d.auto_applicativo as boolean | undefined;
  const testGiudice = d.test_giudice as string | undefined;
  const rationes = d.rationes_fondative as
    | Array<{ label: string; descrizione: string }>
    | undefined;
  const carattere = d.carattere as string | undefined;
  const noteCritiche = d.note_critiche as string | undefined;
  const testo = d.testo as string | undefined;
  const massima = d.massima as string | undefined;

  return (
    <div className="px-6 py-4 max-w-3xl">
      {definizione && (
        <p className="font-serif text-base leading-[1.8] text-text-primary mb-4">{definizione}</p>
      )}
      {testo && (
        <blockquote className="font-serif text-sm leading-[1.8] text-text-secondary border-l-2 border-primary pl-4 mb-4 italic">
          {testo}
        </blockquote>
      )}
      {massima && (
        <blockquote className="font-serif text-sm leading-[1.8] text-text-primary border-l-2 border-error pl-4 mb-4">
          {massima}
        </blockquote>
      )}
      {fondamento && fondamento.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
            Fondamento normativo
          </p>
          <div className="flex flex-wrap gap-1">
            {fondamento.map((f) => (
              <span
                key={f}
                className="text-xs px-2 py-0.5 rounded bg-primary/5 text-primary border border-primary/20"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
      {autoApplicativo !== undefined && (
        <Collapsible title="Auto-applicativo / Test del giudice">
          <p className="text-sm text-text-primary mb-1">
            Auto-applicativo: <strong>{autoApplicativo ? 'Sì' : 'No'}</strong>
          </p>
          {testGiudice && <p className="text-sm text-text-secondary">{testGiudice}</p>}
        </Collapsible>
      )}
      {rationes && rationes.length > 0 && (
        <Collapsible title="Rationes fondative">
          {rationes.map((r, i) => (
            <div key={i} className="mb-2">
              <p className="text-sm font-semibold text-text-primary">{r.label}</p>
              <p className="text-sm text-text-secondary">{r.descrizione}</p>
            </div>
          ))}
        </Collapsible>
      )}
      {carattere && (
        <Collapsible title="Carattere">
          <p className="text-sm text-text-secondary">{carattere}</p>
        </Collapsible>
      )}
      {noteCritiche && (
        <Collapsible title="Note critiche">
          <p className="text-sm text-text-secondary">{noteCritiche}</p>
        </Collapsible>
      )}
      {entity.short && (
        <div className="mt-4 p-3 bg-surface rounded border border-border">
          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
            Sintesi (ripasso)
          </p>
          <p className="text-sm text-text-primary">{entity.short}</p>
        </div>
      )}
    </div>
  );
}

function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-2 border border-border rounded">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-surface"
      >
        {title}
        <span>{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}
