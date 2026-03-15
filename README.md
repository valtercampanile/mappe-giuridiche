# Mappe Giuridiche

Applicazione web SaaS per la formazione giuridica avanzata. Sviluppa la "sensibilità giuridica" mostrando le relazioni strutturali tra istituti, principi, valori e questioni del diritto.

## Documentazione

| Documento | Contenuto |
|-----------|-----------|
| [`docs/ANALISI_FUNZIONALE.md`](docs/ANALISI_FUNZIONALE.md) | Attori, funzionalità, regole di business |
| [`docs/DISEGNO_TECNICO.md`](docs/DISEGNO_TECNICO.md) | Stack, architettura, schema DB, API |
| [`docs/PRD.md`](docs/PRD.md) | Roadmap e priorità |
| [`docs/SESSION.md`](docs/SESSION.md) | Memoria operativa per Claude Code |

## Stack

- **Backend**: Node.js 18 + Express + TypeScript + Prisma + PostgreSQL
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Infrastruttura**: Docker + Nginx

## Avvio rapido (sviluppo locale)

```bash
# Prerequisiti: Node 18, Docker

# 1. Clona il repository
git clone https://github.com/[org]/mappe-giuridiche.git
cd mappe-giuridiche

# 2. Configura le variabili d'ambiente
cp backend/.env.example backend/.env
# Modifica backend/.env con le tue credenziali

# 3. Avvia con Docker
docker-compose up

# 4. Importa i dati iniziali (prima esecuzione)
cd backend && npx ts-node prisma/seed/seed.ts
```

L'app sarà disponibile su `http://localhost:3910`.

## Struttura del repository

```
mappe-giuridiche/
├── docs/           # Documentazione
├── data/           # Dati JSON (schema + database L1)
├── backend/        # API Node.js + Express
├── frontend/       # React SPA
├── docker/         # Dockerfile e configurazione Nginx
└── docker-compose.yml
```

## Contribuire

Leggere [`docs/DISEGNO_TECNICO.md`](docs/DISEGNO_TECNICO.md) sezione 8 per gli standard di codice.
Conventional commits obbligatori: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
