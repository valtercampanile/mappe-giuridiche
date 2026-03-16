# SESSION.md — Memoria operativa del progetto
## Da leggere integralmente all'inizio di ogni sessione di sviluppo

---

## 1. IDENTITÀ DEL PROGETTO

**Nome:** Mappe Giuridiche
**Scopo:** Applicazione web SaaS multiutente per aspiranti magistrati e giuristi. Sviluppa la "sensibilità giuridica" mostrando le relazioni strutturali tra istituti, principi, valori e questioni del diritto penale (con estensione futura a civile e amministrativo).
**Committente:** Giurista e formatore, sviluppa il progetto per uso commerciale ad abbonamento.
**Stack:** Node.js 18 + Express + TypeScript (backend) · React 18 + TypeScript + Vite (frontend) · PostgreSQL + Prisma ORM.
**Ambiente di sviluppo:** Linux Mint (macchina locale), accesso via NoMachine da Mac.
**Repository:** GitHub (monorepo con cartelle `backend/` e `frontend/`).

---

## 2. ARCHITETTURA CONCETTUALE DEL DOMINIO

### La catena fondamentale
```
VALORE → PRINCIPIO → NORMA → ISTITUTO
```
La navigazione è bidirezionale: dall'istituto si risale al valore; dal valore si scende agli istituti che ne discendono.

### Le 8 categorie di entità

| Sigla | Tipo | Descrizione |
|-------|------|-------------|
| V | Valore | Bene fondamentale dell'ordinamento (libertà, dignità, vita...). Ha *rationes fondative* come attributo. |
| P | Principio | Regola auto-applicativa — il giudice verifica direttamente nel caso concreto. Test: auto-applicatività. |
| N | Norma | Disposizione normativa positiva. Attributi: fonte formale, rango. |
| I | Istituto | Struttura operativa che attua le norme. Ha gerarchia padre/figlio. |
| Q | Questione | Punto aperto con tesi a confronto e posizione del docente. |
| F | Funzione | Attributo trasversale di norme/istituti (garanzia, incriminatrice, scriminante...). |
| LI | Logica interpretativa | Strumento ermeneutico: sostanziale (come estrarre significato) o procedurale (protocollo obbligato). |
| G | Giurisprudenza | Pronuncia chiave. Attributo `zona_grigia` per sentenze patologiche. |

### Distinzione critica: Principio vs. Ratio fondativa
- **Principio**: auto-applicativo — il giudice lo verifica direttamente (es. irretroattività sfavorevole).
- **Ratio fondativa**: orienta ma richiede intermediazione legislativa (es. frammentarietà, inesigibilità).

### Relazioni tra entità (5 tipi)
1. **Strutturale** — un'entità è elemento di un'altra
2. **Di principio** — un principio governa più istituti
3. **Di limite/eccezione** — un'entità delimita o deroga un'altra
4. **Funzionale trasversale** — stessa logica in ambiti diversi
5. **Di tensione** — conflitto tra valori/principi, con: poli, tecnica di risoluzione, criteri di orientamento, manifestazioni, `zona_grigia`

### Le 22 tensioni trasversali
Completamente mappate nel file `data/database_L1_con_tensioni.json`. Le tensioni con `zona_grigia: true` (T04, T05, T07, T13, T15, T18, T20, T21) segnalano casi in cui il giudice fa scelte con effetti di politica criminale.

### Patologie del sistema (zona grigia)
Tre casi paradigmatici documentati dal docente:
- **SS.UU. Mariotti** (2018): riduzione teleologica in malam partem sulla colpa medica
- **SS.UU. art. 384 c.p.** (2021): lacuna politica trattata come lacuna giuridica
- **Tesi unicità art. 584 c.p.**: culpa in re ipsa = responsabilità oggettiva occulta

---

## 3. STATO DEL DATABASE

**Fase 1 completata** — estrazione di 5 lezioni di diritto penale parte generale:
- L1: Principio di legalità e fonti del diritto penale
- L2: Corollari della legalità (tassatività, analogia, successione di leggi)
- L3: Cause di giustificazione (scriminanti)
- L4: Materialità e fatto tipico (condotta, causalità, reato omissivo)
- L5: Colpevolezza (preterintenzione, dolo, dolo eventuale, colpa medica)

**Conteggio entità**: ~8V · ~27P · ~77I · ~32LI · ~46Q · ~15F · ~94G · ~108N · 22 tensioni

**File dati**: `data/database_L1_con_tensioni.json` (schema + popolazione L1 + tutte le 22 tensioni)
**Schema JSON**: `data/schema_mappe_giuridiche.json`

**Admin Upload JSON**: implementato. Flusso: JSON da Claude.ai → upload → revisione → approvazione → upsert nel DB.

**Da fare**:
- Fase 2: Popolazione L2–L5 nel database
- Fase 3: Sviluppo app (in corso)
- Fase 4: Integrazione nuove lezioni (arriveranno altre 3 + possibili capitoli di manuale)

---

## 4. DECISIONI DI UX/UI CONSOLIDATE

### Layout pagina Studio
```
┌──────────────────────────────────────────────────────────────┐
│ Mappe Giuridiche    Studio  Ripasso  Esercitazione  Questioni │  header 44px
├──────────┬───────────────────────────────────────┬───────────┤
│          │  ← →  [I01] Istituto · Riserva legge  │           │
│ SIDEBAR  │ ─────────────────────────────────────  │  GRAFO   │
│ compatta │ Inquadramento  Connessioni  Tesi  Nota │ (toggle) │
│ Materia  │                                        │           │
│ + entità │   testo della scheda (stile manuale)   │           │
│          │                                        │           │
│ [toggle] │                                        │           │
└──────────┴───────────────────────────────────────┴───────────┘
```

### Regole di navigazione
- Frecce ← → nell'intestazione della colonna centrale (history locale, come browser)
- Click su nodo del grafo → aggiorna colonna centrale (navigazione nel grafo)
- Sidebar togglabile: espansa (230px, icona+testo) / compatta (52px, solo icone + tooltip hover)
- Grafo togglabile: pulsante nella colonna centrale apre/chiude il pannello

### Palette AgID
```
Primario:     #0066CC  (blu AgID)
Scuro:        #004B8C
Chiaro:       #EBF3FB
Testo1:       #17324D
Testo2:       #5C6F82
Bordo:        #D9E4ED
Superficie:   #F5F9FC
Sidebar bg:   #0D1B2A
Sidebar acc:  #4DA3FF
Errore:       #8B1A1A
Warning:      #7A5800
Successo:     #006D3D
```

### Convenzioni UI
- Badge tipo: lettera monospace (V, P, N, I, Q, LI, G, T) — niente emoji
- Font: Titillium Web (AgID standard) con fallback Arial
- Tab "Inquadramento": testo stile capitolo di manuale, font serif, paragrafi ampi
- Indicatore fonte: pillola discreta "docente" (verde) o "AI" (blu) su ogni scheda
- Zona grigia: indicatore visivo "zona critica" (rosso) su entità e relazioni patologiche
- Note personali: tab dedicato su ogni entità, persistito per utente

### Pagine dell'app
| Pagina | Funzione |
|--------|----------|
| Studio | Navigazione esplorativa: sidebar + scheda entità + grafo contestuale |
| Ripasso | Percorsi tematici + schede sintetiche (`short` field) |
| Esercitazione | Domande di collegamento + mini-casi con tesi a confronto |
| Questioni | Repertorio Q entities con tesi e posizione del docente |
| Admin > Entità | CRUD entità (solo ruolo admin) |
| Admin > Upload | Analisi documento → proposta nuove entità → revisione umana → commit |

---

## 5. REGOLE OPERATIVE PER CC

1. **Leggi sempre questo file per intero** prima di scrivere codice.
2. **Non modificare mai** `data/schema_mappe_giuridiche.json` e `data/database_L1_con_tensioni.json` senza istruzione esplicita.
3. **Ogni file di codice**: max 300 righe. Se supera, splitta per responsabilità.
4. **Nessun `any`** in TypeScript. Se necessario, commenta il perché.
5. **Nessun `console.log`** in produzione — usa il logger Winston configurato in `backend/src/utils/logger.ts`.
6. **Nessun valore hardcoded** — tutto in `.env` o `config/`.
7. **Conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
8. **Dopo ogni feature**: aggiorna `SESSION.md` nella sezione "Stato del database" o "Decisioni consolidate" se qualcosa è cambiato.
9. **Quando hai dubbi su una decisione di design**: non inventare — segnala con un commento `// TODO: chiedere al committente`.
10. **Pattern obbligatori**: Repository per il DB, Service per la logica, Controller per HTTP. Mai logica nel controller, mai Prisma nel controller.

---

## 6. VARIABILI D'AMBIENTE RICHIESTE

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/mappe_giuridiche
JWT_SECRET=<stringa casuale lunga almeno 64 caratteri>
JWT_REFRESH_SECRET=<stringa casuale diversa>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PORT=3911
NODE_ENV=development
FRONTEND_URL=http://localhost:3910
ANTHROPIC_API_KEY=<chiave per funzione upload/analisi — fase futura>

# Frontend
VITE_API_URL=http://localhost:3911/api/v1
```

---

## 7. COMANDI UTILI

```bash
# Backend
cd backend && npm run dev          # avvia in development
cd backend && npm run build        # compila TypeScript
cd backend && npm test             # esegui test
cd backend && npx prisma studio    # GUI database
cd backend && npx prisma migrate dev --name <nome>  # nuova migration

# Frontend
cd frontend && npm run dev         # avvia Vite dev server
cd frontend && npm run build       # build produzione
cd frontend && npm run lint        # ESLint

# Entrambi
docker-compose up                  # avvia tutto in locale con Docker
```

---

## 8. CHECKLIST DI CHIUSURA SESSIONE

Eseguire nell'ordine prima di ogni commit finale:

1. cd backend && npm run verify
2. cd frontend && npm run lint
3. Nessun file sorgente supera 300 righe:
   find backend/src frontend/src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20
4. Nessun console.log nel codice:
   grep -r "console.log" backend/src frontend/src
5. Nessun valore hardcoded (URL, porte, credenziali):
   grep -rn "localhost\|3910\|3911\|5432\|password\|secret" backend/src frontend/src --include="*.ts"
6. TypeScript compila senza errori:
   cd backend && npm run build
7. git status — revisiona i file prima del commit
8. Conventional commit con descrizione chiara
