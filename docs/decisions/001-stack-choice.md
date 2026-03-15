# ADR 001 — Scelta dello stack tecnologico
**Data**: Marzo 2026
**Stato**: Accettato

## Contesto
Il progetto richiede un'applicazione web SaaS con backend REST, database relazionale, frontend SPA, grafo interattivo. L'ambiente di sviluppo è Linux Mint (Node 18 già installato). Il committente non è un tecnico — la manutenibilità e la documentabilità sono priorità.

## Decisione

**Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL

Motivazione: Node 18 già installato sull'ambiente di sviluppo. Prisma genera tipi TypeScript dal schema DB, azzerando la disconnessione tra DB e codice applicativo. PostgreSQL con JSONB gestisce i campi flessibili delle entità senza migration ad ogni estensione dello schema.

**Frontend**: React 18 + Vite + TypeScript + Tailwind + Zustand + React Query + Cytoscape.js

Motivazione: Vite è significativamente più veloce di CRA per lo sviluppo. Zustand è più semplice di Redux per lo stato globale limitato di questa app. React Query elimina il boilerplate dei fetch con useEffect. Cytoscape.js è l'unica libreria grafo matura con layout gerarchico built-in adatta a 300+ nodi senza configurazione custom.

**Tailwind CSS** invece di CSS Modules o styled-components: obbliga la coerenza visiva (palette AgID centralizzata in `tailwind.config.ts`), elimina i file CSS separati, e ha una curva di apprendimento bassa per chi verrà a manutenere il progetto.

## Alternative considerate

- **Django/Python**: scartato per incompatibilità con l'ambiente Node già configurato.
- **NestJS**: scartato per over-engineering rispetto alla complessità dell'app.
- **D3.js** per il grafo: scartato per l'elevata complessità di configurazione del layout gerarchico.
- **Redux Toolkit**: scartato perché lo stato globale dell'app è limitato (utente + UI state) — Zustand è sufficiente.

## Conseguenze
- La struttura monorepo richiede due `package.json` separati ma semplifica il deployment con Docker.
- Prisma richiede che ogni modifica al DB passi per un file di migration — questo è un vincolo, ma garantisce la tracciabilità.
