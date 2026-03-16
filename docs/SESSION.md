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

**Conteggio entità nel DB** (verificato 2026-03-16, materia penale, 142 totali):
8V · 27P · 10N · 54I · 13Q · 7F · 14LI · 9G

**File dati**: `data/database_L1_con_tensioni.json` (schema + popolazione L1 + tutte le 22 tensioni)
**Schema JSON**: `data/schema_mappe_giuridiche.json`

**Admin Upload JSON**: implementato e funzionante. Flusso: drag&drop JSON → parsing → revisione entità (con modifica inline di label e definizione) → approvazione → upsert deep merge nel DB.

**Testi Inquadramento**: 81 entità su 85 arricchite con testo stile capitolo di manuale. File sorgente in `data/inquadramento/` (5 batch: update_inquadramento.json — update_inquadramento_5.json).

**Bug risolti**:
- Upsert JSONB ora fa deep merge (`{ ...existing.data, ...newData }`) invece di sostituzione.
- Lista entità sidebar vuota: il frontend inviava `limit=500` ma il backend ha Zod `max(100)` → HTTP 400 silenzioso. Risolto con `getAllEntities()` che pagina automaticamente (page 1..N con limit=100).

**Da fare**:
- Fase 2: Popolazione L2–L5 nel database
- Fase 3: Sviluppo app (in corso)
- Fase 4: Integrazione nuove lezioni (arriveranno altre 3 + possibili capitoli di manuale)

---

## 4. DECISIONI DI UX/UI CONSOLIDATE

### Layout pagina Studio (aggiornato 2026-03-16)
```
┌────┬──────────┬──────────────────────────────────────┬───────────┐
│RAIL│ DRAWER   │  MAPPE GIURIDICHE   Studio Ripasso…  │           │
│44px│ 44px hdr │  ← → [I01] Istituto · Riserva legge │           │
│ ☰  │ DIR.PEN. │ ─────────────────────────────────── │  GRAFO    │
│────│──────────│ Inquadramento  Connessioni  Tesi Nota│ (toggle)  │
│ P  │ materie  │                                      │           │
│ C  │ [cerca]  │  testo della scheda (stile manuale)  │           │
│ A  │ [filtri] │                                      │           │
│    │ lista    │                                      │           │
└────┴──────────┴──────────────────────────────────────┴───────────┘
 56px  260px                  flex-1                      350px
```

### Architettura sidebar (Rail + Drawer)
- **Rail** (56px, sempre visibile, sfondo #0066CC):
  - Header 44px: icona burger `Menu` (Lucide, 24px, #FFFFFF)
  - 3 item materia: lettera maiuscola (P, C, A) — Titillium Web 20px bold #FFFFFF, altezza 48px
  - Indicatore attivo: sfondo rgba(255,255,255,0.20) + bordo sinistro 3px #FFFFFF
- **Drawer** (260px default, resizable 200–400px, togglabile con burger):
  - Header 44px: nome materia attiva in maiuscolo (es. "DIRITTO PENALE"), sfondo #0066CC
  - DrawerMaterie: lista materie con testo maiuscolo, senza icone
  - DrawerSearch: campo ricerca con icona `Search`
  - DrawerFilterChips: griglia 3x3 di chip tipo (V, P, N, I, Q, F, LI, G) + toggle "Seleziona/Deseleziona tutto"
  - DrawerEntityList: lista entità con badge tipo, label, indicatore zona grigia
- **Resize handle**: drag verticale tra drawer e colonna centrale
- **Escape**: chiude il drawer
- **Componenti**: `SidebarLayout.tsx` (orchestratore) → `Rail.tsx` + `Drawer.tsx` → `DrawerMaterie.tsx` + `DrawerSearch.tsx` + `DrawerFilterChips.tsx` + `DrawerEntityList.tsx`
- **Context**: `useSidebarContext.ts` (drawerOpen, drawerWidth, totalWidth)

### Regole di navigazione
- Frecce ← → nell'intestazione della colonna centrale (history locale, come browser)
- Click su nodo del grafo → aggiorna colonna centrale (navigazione nel grafo)
- Grafo togglabile: pulsante nella colonna centrale apre/chiude il pannello

### Header app (aggiornato 2026-03-16)
- Sfondo #0066CC, altezza 44px, posizionato a destra della sidebar (nella colonna principale)
- Sinistra: "MAPPE GIURIDICHE" (Titillium Web 16px bold #FFFFFF uppercase, letter-spacing 0.05em)
- Centro: 4 tab navigazione con icone Lucide (BookOpen, RotateCcw, PenLine, HelpCircle) + label testo affiancati, 13px Titillium Web. Tab attivo: #FFFFFF + bordo inferiore 2px. Inattivo: rgba(255,255,255,0.65), hover .85
- Destra: Dropdown "Admin" (solo ruolo ADMIN) → Upload Contenuti, Gestione Entità

### Palette AgID
```
Primario:     #0066CC  (blu AgID)
Scuro:        #004B8C
Chiaro:       #EBF3FB
Testo1:       #17324D
Testo2:       #5C6F82
Bordo:        #D9E4ED
Superficie:   #F5F9FC
Errore:       #8B1A1A
Warning:      #7A5800
Successo:     #006D3D
```

### Palette colori entità
```
VALORE:                #9333EA (viola)
PRINCIPIO:             #2563EB (blu)
NORMA:                 #0891B2 (ciano)
ISTITUTO:              #16A34A (verde)
QUESTIONE:             #EA580C (arancione)
FUNZIONE:              #4F46E5 (indaco)
LOGICA_INTERPRETATIVA: #0D9488 (teal)
GIURISPRUDENZA:        #DC2626 (rosso)
TENSIONE:              #DC2626 (rosso)
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
| Studio | Navigazione esplorativa: sidebar (rail+drawer) + scheda entità + grafo contestuale |
| Ripasso | Percorsi tematici + schede sintetiche (`short` field) |
| Esercitazione | Domande di collegamento + mini-casi con tesi a confronto |
| Questioni | Repertorio Q entities con tesi e posizione del docente |
| Admin > Entità | CRUD entità (solo ruolo admin) — placeholder |
| Admin > Upload | Analisi documento → proposta nuove entità → revisione umana → commit |

### Admin Upload
- Modifica inline di label e definizione prima dell'approvazione (stato locale, non API)
- Storico upload cliccabile con riapertura review
- Soft delete (status=DELETED) con pulsante ✕
- Filtro stato: Tutti / In revisione / Approvati / Eliminati

### Vincolo backend: paginazione
Il backend ha validazione Zod `limit: z.number().max(100)`. Il frontend usa `getAllEntities()` in `entities.api.ts` per paginare automaticamente oltre le 100 entità per materia.

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
11. **Upsert JSONB deep merge**: L'upsert del campo `data` JSONB deve sempre fare deep merge: `{ ...existing.data, ...newData }`. Mai sostituire l'intero campo data.
12. **Launcher desktop**: Il launcher è in `~/mappe-giuridiche-launcher/` (pywebview + HTML/CSS/JS). Non modificarlo senza istruzione esplicita — è un tool separato dal codice dell'app.

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
