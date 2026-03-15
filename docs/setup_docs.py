#!/usr/bin/env python3
"""Setup documentazione — Mappe Giuridiche"""
import os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))

files = {}

files['docs/SESSION.md'] = '''# SESSION.md — Memoria operativa del progetto
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
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ANTHROPIC_API_KEY=<chiave per funzione upload/analisi — fase futura>

# Frontend
VITE_API_URL=http://localhost:3001/api/v1
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
'''

files['docs/ANALISI_FUNZIONALE.md'] = '''# ANALISI FUNZIONALE
## Mappe Giuridiche — Sistema di studio e formazione giuridica
### Versione 1.0 — Marzo 2026

---

## 1. DESCRIZIONE GENERALE DEL SISTEMA

### 1.1 Scopo
Mappe Giuridiche è un'applicazione web SaaS multiutente destinata alla formazione giuridica avanzata, con focus iniziale sul diritto penale parte generale. Il sistema traduce un corpus di lezioni universitarie in una base di conoscenza strutturata navigabile, con l'obiettivo di sviluppare la "sensibilità giuridica" degli utenti: la capacità di vedere le relazioni tra istituti, principi, valori e questioni aperte del diritto, al di là della memorizzazione nozionistica.

### 1.2 Contesto
Il progetto nasce dall'esigenza di un giurista e formatore di rendere disponibile a un pubblico di aspiranti magistrati e professionisti del diritto un sistema di studio che mostri esplicitamente la trasversalità del diritto — come gli stessi principi e valori operino in modo coerente attraverso istituti apparentemente distanti.

L'architettura concettuale è generica e applicabile a qualsiasi ramo del diritto. La prima implementazione copre il diritto penale parte generale; le successive estensioni riguarderanno il diritto civile e amministrativo.

### 1.3 Obiettivi del sistema
1. Offrire uno strumento di studio strutturato che colleghi ogni istituto al suo fondamento valoriale.
2. Evidenziare le relazioni di tensione tra principi e valori, con le tecniche di risoluzione utilizzate nella prassi.
3. Segnalare le "zone critiche" del sistema — i casi in cui la giurisprudenza compie scelte con effetti di politica criminale.
4. Consentire l'aggiornamento continuo della base di conoscenza attraverso il caricamento di nuovi materiali (lezioni, articoli di dottrina, sentenze).
5. Supportare diverse modalità di apprendimento: studio narrativo, esercitazione attiva, ripasso sintetico, analisi delle questioni aperte.

---

## 2. ATTORI DEL SISTEMA

### 2.1 Utente non autenticato
Accede esclusivamente alla pagina di presentazione e registrazione. Non può accedere ai contenuti.

### 2.2 Utente registrato (ruolo: `user`)
- Accede a tutte le funzionalità di studio, ripasso, esercitazione e questioni.
- Può aggiungere note personali a ogni entità del database.
- Può salvare segnalibri e monitorare il proprio progresso.
- Non può modificare i contenuti del database.
- Il piano di abbonamento determina il livello di accesso ai contenuti (base / avanzato / completo).

### 2.3 Amministratore (ruolo: `admin`)
- Ha tutte le funzionalità dell'utente registrato.
- Può creare, modificare e archiviare entità nel database.
- Può caricare nuovi materiali (lezioni, sentenze, articoli) per l'analisi automatica e l'arricchimento del database.
- Può revisionare e approvare le proposte di aggiornamento generate dall'analisi AI.
- Può gestire gli utenti e i piani di abbonamento.
- Può inserire il testo completo delle norme nelle schede.
- Può modificare la posizione del docente su questioni giuridiche.

---

## 3. MATERIE E CONTENUTI

### 3.1 Struttura per materia
Il sistema è organizzato per materie giuridiche. Ogni materia ha un proprio corpus di entità indipendente, anche se alcuni valori e principi sono trasversali a tutte le materie.

| Materia | Stato |
|---------|-------|
| Diritto penale — parte generale | Attivo (5 lezioni estratte) |
| Diritto civile | Placeholder (da sviluppare) |
| Diritto amministrativo | Placeholder (da sviluppare) |

### 3.2 Struttura del contenuto
Il database è composto da **8 categorie di entità** collegate da **5 tipi di relazione**.

**Entità:**
- **Valore (V)**: bene fondamentale dell'ordinamento. Ogni valore ha *rationes fondative* — criteri orientativi non auto-applicativi che spiegano come il valore si proietta nel sistema.
- **Principio (P)**: regola auto-applicabile — il giudice può verificare nel caso concreto se è rispettato. Include meta-principi (controlimiti, gerarchia delle fonti).
- **Norma (N)**: disposizione normativa positiva con fonte formale e rango gerarchico.
- **Istituto (I)**: struttura operativa che attua le norme. Gli istituti hanno gerarchia padre/figlio (es. Fatto tipico → Condotta → Suitas).
- **Questione giuridica (Q)**: punto aperto con tesi a confronto, stato della questione e posizione del docente.
- **Funzione (F)**: attributo trasversale di norme e istituti (garanzia, incriminatrice, scriminante...).
- **Logica interpretativa (LI)**: strumento ermeneutico, distinto in sostanziale (come estrarre significato) e procedurale (protocollo obbligato dell'interprete).
- **Orientamento giurisprudenziale (G)**: pronuncia chiave con indicazione se costituisce una "zona critica" del sistema.

**Relazioni:**
- Strutturale (elemento di), Di principio (governa), Di limite/eccezione (deroga), Funzionale trasversale, Di tensione (conflitto tra valori/principi).

### 3.3 Le tensioni
Le relazioni di tensione sono il nucleo didattico del sistema. Ogni tensione ha: poli del conflitto, tecnica di risoluzione (bilanciamento, proporzionalità, ragionevolezza, specialità, interpretazione conforme), criteri di orientamento (favor rei, favor vitae, precauzione), manifestazioni concrete nel sistema, indicatore di zona critica.

Sono state mappate 22 tensioni trasversali alle 5 lezioni del penale parte generale.

### 3.4 Fonte del contenuto
Ogni entità indica la fonte: **docente** (estratta dalle lezioni del formatore, da considerarsi autorevole) o **AI** (integrazione da fonti giuridiche esterne, indicata discretamente nell'interfaccia). La posizione del docente sulle questioni controverse è sempre registrata fedelmente e non neutralizzata.

---

## 4. FUNZIONALITÀ DEL SISTEMA

### 4.1 Pagina Studio
**Scopo**: navigazione esplorativa e studio approfondito delle entità.

**Flusso principale:**
1. L'utente seleziona una materia (Penale / Civile / Amministrativo).
2. Sfoglia o cerca un'entità nella sidebar (per tipo, per testo libero).
3. Seleziona l'entità: la scheda appare nella colonna centrale.
4. La scheda mostra: Inquadramento (testo di capitolo), Connessioni (entità collegate navigabili), Tesi a confronto (per questioni), Manifestazioni (per tensioni), Nota personale.
5. Il pannello grafo (togglabile) mostra il sottografo contestuale centrato sull'entità corrente.
6. Click su un nodo del grafo → aggiorna la scheda centrale.
7. Le frecce ← → consentono di navigare nella history della sessione.
8. La sidebar è togglabile tra espansa (icona+testo) e compatta (icona+tooltip).

**Regole di business:**
- La navigazione nel grafo e nella history è illimitata.
- Il pannello grafo e la sidebar sono indipendentemente togglabili.
- Le note personali sono private per utente e persistenti tra sessioni.

### 4.2 Pagina Ripasso
**Scopo**: revisione rapida tramite percorsi tematici e schede sintetiche.

**Funzionalità:**
- Percorsi tematici preconfigurati (es. "La catena della legalità", "Il protocollo dell'interprete").
- Ogni entità mostra la versione sintetica (`short`, max 200 caratteri).
- Modalità "flash card": l'utente vede il titolo dell'entità e può rivelare la definizione sintetica.
- L'utente può marcare ogni entità come: da rivedere / studiata / padroneggiata.
- Filtro per stato di avanzamento: mostra solo le entità "da rivedere".

### 4.3 Pagina Esercitazione
**Scopo**: verifica attiva della comprensione attraverso domande di collegamento e mini-casi.

**Funzionalità:**
- **Domande di collegamento**: "Quale valore fonda il principio P04?", "Quali istituti sono governati da P02?". Risposta a scelta multipla o testo libero.
- **Mini-casi**: scenario giuridico sintetico + domanda. L'utente seleziona la tesi corretta tra quelle estratte dalla questione corrispondente.
- **Feedback**: dopo la risposta, l'app mostra la spiegazione completa con riferimento all'entità di origine.
- Il sistema tiene traccia delle risposte per adattare le domande future (le entità dove l'utente ha risposto erroneamente vengono ripresentate più spesso).

### 4.4 Pagina Questioni
**Scopo**: repertorio delle questioni giuridiche aperte con le tesi a confronto.

**Funzionalità:**
- Lista di tutte le questioni Q filtrabili per: materia, lezione, stato (aperta / controversa / prevalente / risolta), zona critica.
- Scheda questione: formulazione precisa, istituti coinvolti, principi in gioco, tesi a confronto con autori e giurisprudenza di riferimento, posizione del docente.
- Indicatore visivo per le questioni in zona critica.
- Collegamento diretto alle entità correlate (navigabile).

### 4.5 Funzionalità amministrative (solo ruolo admin)

**Gestione entità:**
- CRUD completo su tutte le entità del database.
- Per le norme: campo dedicato per inserire il testo completo dell'articolo.
- Modifica della posizione del docente sulle questioni.
- Archiviazione di entità superate senza cancellazione (mantenimento della storia).

**Caricamento e analisi documenti:**
1. L'admin carica un file (PDF, Word, testo) — lezione, sentenza, articolo di dottrina.
2. Il sistema invia il documento all'API Anthropic con istruzioni di estrazione strutturata.
3. Viene generata una proposta di nuove entità e relazioni, nel formato del database.
4. L'admin rivede la proposta entità per entità: accetta, modifica o rifiuta ciascuna.
5. Le entità accettate vengono inserite nel database con fonte "AI" (se non estratte da lezione del docente) o "docente".
6. Le relazioni vengono aggiunte al grafo.

**Gestione delle tesi opposte:**
Il database è additivo e mai distruttivo. Quando una nuova sentenza o un nuovo articolo propone una soluzione diversa a una questione esistente:
- Si aggiunge una nuova tesi nell'array `tesi[]` della questione.
- Si aggiorna il campo `stato` della questione (es. da "prevalente" a "controversa").
- La tesi precedente rimane con l'etichetta "superata" e il riferimento temporale.
- La posizione del docente rimane invariata (è registrata al momento dell'estrazione della lezione).

### 4.6 Gestione utenti e abbonamenti
- Registrazione con email e password.
- Profilo utente: nome, piano di abbonamento, preferenze (tema, dimensione testo).
- Piani di abbonamento (configurabili dall'admin): Base (accesso a una materia), Avanzato (accesso a due materie), Completo (tutte le materie + funzionalità avanzate).
- Integrazione pagamenti (Stripe): da implementare in fase successiva. Nella versione 1.0, l'abbonamento è gestito manualmente dall'admin.

---

## 5. REQUISITI NON FUNZIONALI

### 5.1 Usabilità
- Interfaccia conforme alle linee guida AgID per i siti della pubblica amministrazione italiana (palette, tipografia Titillium Web, accessibilità WCAG 2.1 AA).
- Tempi di caricamento: scheda entità < 500ms; grafo contestuale < 1 secondo.
- Responsive: ottimizzato per desktop (min 1280px). Tablet in roadmap. Mobile non previsto nella versione 1.0.

### 5.2 Sicurezza
- Autenticazione JWT con refresh token.
- Password hashate con bcrypt (min 12 rounds).
- Rate limiting su tutti gli endpoint pubblici.
- Separazione completa tra dati di utenti diversi.
- Note personali degli utenti non visibili agli amministratori.

### 5.3 Scalabilità
- L'architettura è progettata per la migrazione su cloud (VPS, Railway, Render) senza modifiche al codice applicativo.
- Il database PostgreSQL supporta la crescita del corpus (stimato: fino a 2000 entità per materia nella versione matura).
- L'aggiunta di nuove materie non richiede modifiche strutturali al database.

### 5.4 Manutenibilità
- Documentazione tecnica completa (vedere `DISEGNO_TECNICO.md`).
- Codice sorgente su GitHub con history completa.
- Migration database versionate con Prisma.
- Seed files separati per dati iniziali e dati di test.
- Suite di test automatici per i componenti critici.

---

## 6. VINCOLI E DIPENDENZE

### 6.1 Dipendenze esterne
- **API Anthropic (Claude)**: necessaria per la funzionalità di analisi documenti. Richiede chiave API a pagamento. Disponibile solo per utenti admin. In assenza della chiave, le funzionalità di upload/analisi sono disabilitate ma il resto dell'applicativo funziona regolarmente.
- **PostgreSQL**: richiede versione 14 o superiore.
- **Node.js**: versione 18 LTS.

### 6.2 Vincoli normativi
- Trattamento dati personali conforme al GDPR. Le note personali degli utenti sono dati personali.
- I testi delle norme (articoli di legge) sono in pubblico dominio e possono essere riprodotti liberamente.
- I testi delle sentenze giurisprudenziali sono in pubblico dominio.
- I testi delle lezioni del docente sono coperti da copyright del docente committente.

---

## 7. GLOSSARIO

| Termine | Definizione |
|---------|-------------|
| Entità | Qualsiasi oggetto del database (valore, principio, norma, istituto, questione, funzione, logica interpretativa, orientamento giurisprudenziale) |
| Tensione | Relazione di conflitto tra due o più entità, con tecnica di risoluzione e manifestazioni concrete |
| Zona critica | Entità o relazione che rappresenta una "patologia" del sistema: un caso in cui il giudice compie scelte con effetti di politica criminale |
| Ratio fondativa | Criterio orientativo attributo di un valore. Non auto-applicabile dal giudice — richiede intermediazione legislativa |
| Auto-applicativo | Detto di un principio che il giudice può verificare direttamente nel caso concreto, senza mediazione normativa ulteriore |
| Inquadramento | Tab della scheda entità che contiene il testo narrativo di presentazione, scritto in stile capitolo di manuale |
| Fonte: docente | Contenuto estratto direttamente dalle lezioni del formatore committente — da considerarsi autorevole |
| Fonte: AI | Contenuto integrato da fonti giuridiche esterne tramite elaborazione AI — indicato discretamente nell'interfaccia |
| Percorso tematico | Sequenza preconfigurata di entità collegate per tema, usata nella pagina Ripasso |
'''

files['docs/DISEGNO_TECNICO.md'] = '''# DISEGNO TECNICO
## Mappe Giuridiche — Specifiche di architettura e implementazione
### Versione 1.0 — Marzo 2026

---

## 1. STACK TECNOLOGICO

### 1.1 Backend
| Componente | Tecnologia | Versione | Motivazione |
|-----------|-----------|---------|-------------|
| Runtime | Node.js | 18 LTS | LTS stabile, compatibile con Prisma e TypeScript |
| Framework HTTP | Express | 4.x | Consolidato, minimale, ampia ecosystem |
| Linguaggio | TypeScript | 5.x | Tipizzazione completa, integrazione nativa con Prisma |
| ORM | Prisma | 5.x | Schema-first, migration versionate, tipi generati automaticamente |
| Database | PostgreSQL | 16 | JSONB per campi flessibili, robusto, self-hostable |
| Autenticazione | JWT (jsonwebtoken) | — | Access token (15m) + Refresh token (7d) |
| Validazione input | Zod | 3.x | Integrazione TypeScript, schema riutilizzabili |
| Password hashing | bcrypt | — | 12 rounds |
| Logger | Winston | — | Log strutturati JSON in produzione |
| Test | Jest + Supertest | — | Unit test services + integration test API |

### 1.2 Frontend
| Componente | Tecnologia | Versione | Motivazione |
|-----------|-----------|---------|-------------|
| Framework | React | 18 | Ecosystem maturo, hooks, concurrent features |
| Build tool | Vite | 5.x | Velocità di sviluppo, HMR istantaneo |
| Linguaggio | TypeScript | 5.x | Parità di tipi con il backend |
| Styling | Tailwind CSS | 3.x | Utility-first, AgID-compatibile, niente CSS custom |
| State globale | Zustand | 4.x | Minimale, no boilerplate, DevTools |
| Data fetching | React Query (TanStack) | 5.x | Cache, refetch, loading states automatici |
| Routing | React Router | 6 | Standard di fatto, lazy loading |
| Grafo | Cytoscape.js | 3.x | Layout gerarchico, performance su 300+ nodi, API semplice |

### 1.3 Infrastruttura e DevOps
| Componente | Tecnologia | Note |
|-----------|-----------|------|
| Containerizzazione | Docker + Docker Compose | Sviluppo locale e produzione |
| Reverse proxy | Nginx | Serve il frontend + proxya le API |
| Repository | GitHub | Monorepo con `backend/` e `frontend/` |
| CI/CD | GitHub Actions | Test automatici su PR, deploy su push a `main` (futuro) |

---

## 2. ARCHITETTURA APPLICATIVA

### 2.1 Architettura generale
```
┌─────────────────┐     HTTPS      ┌─────────────────┐
│   Browser       │ ◄────────────► │   Nginx         │
│   React SPA     │                │   Reverse Proxy │
└─────────────────┘                └────────┬────────┘
                                            │
                              ┌─────────────┴──────────────┐
                              │                            │
                    ┌─────────▼────────┐       ┌──────────▼────────┐
                    │   Static Files   │       │   Express API     │
                    │   (React build)  │       │   /api/v1/...     │
                    └──────────────────┘       └──────────┬────────┘
                                                          │
                                               ┌──────────▼────────┐
                                               │   PostgreSQL      │
                                               │   Database        │
                                               └───────────────────┘
```

### 2.2 Pattern architetturale backend (MVC + Repository)
```
Request → Route → Middleware → Controller → Service → Repository → Prisma → DB
                                    ↓
                               Response ← Controller ← Service ← Repository
```

- **Route**: solo routing, nessuna logica
- **Middleware**: autenticazione JWT, validazione Zod, rate limiting, error handler
- **Controller**: parsing request/response HTTP, chiama i Service, gestisce gli errori HTTP
- **Service**: logica di business pura, non conosce HTTP né il DB direttamente
- **Repository**: unico punto di accesso a Prisma, astratto su interfaccia TypeScript
- **Model**: interfacce TypeScript + schemi Zod condivisi

### 2.3 Pattern architetturale frontend (Container/Presenter + Hooks)
```
Page (route) → Container (logica, React Query) → Presenter (rendering puro)
                    ↓
               Custom Hooks (stato locale, effetti)
                    ↓
               Zustand Store (stato globale: utente, navigazione)
```

---

## 3. SCHEMA DATABASE

### 3.1 Strategia schema
Approccio ibrido: tabelle strutturate per i campi comuni e i campi usati in query/filtri, colonna `data JSONB` per i campi specifici per tipo (flessibili, non indicizzati). Questo consente di estendere le entità senza migration ogni volta.

### 3.2 Tabelle

```prisma
// Utenti e autenticazione
model User {
  id               String    @id @default(cuid())
  email            String    @unique
  passwordHash     String
  name             String
  role             Role      @default(USER)
  subscriptionTier SubTier   @default(BASE)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  progress         UserProgress[]
  bookmarks        UserBookmark[]
  notes            UserNote[]
  refreshTokens    RefreshToken[]
}

enum Role { USER ADMIN }
enum SubTier { BASE ADVANCED COMPLETE }

// Token di refresh
model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
}

// Materie
model Materia {
  id       String @id  // "penale", "civile", "amm"
  label    String
  active   Boolean @default(false)
  entities Entity[]
}

// Lezioni/Capitoli
model Lezione {
  id       String @id  // "L1", "L2", ...
  titolo   String
  materia  String
  ordine   Int
  entities Entity[]
}

// Entità (tutte le 8 categorie in una tabella)
model Entity {
  id         String   @id  // "V01", "P01", "I01", ecc.
  type       EntityType
  label      String
  short      String?  // max 200 chars, per il Ripasso
  fonte      FonteType @default(DOCENTE)
  zonaGrigia Boolean  @default(false)
  archived   Boolean  @default(false)
  tags       String[] // array di stringhe
  materiaId  String
  materia    Materia  @relation(fields: [materiaId], references: [id])
  data       Json     // campi specifici per tipo (definizione, tesi, rationes, ecc.)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  lezioni    EntityLezione[]
  fromRels   Relation[] @relation("FromEntity")
  toRels     Relation[] @relation("ToEntity")
  progress   UserProgress[]
  bookmarks  UserBookmark[]
  notes      UserNote[]

  @@index([type])
  @@index([materiaId])
  @@index([zonaGrigia])
  @@index([archived])
}

enum EntityType {
  VALORE PRINCIPIO NORMA ISTITUTO QUESTIONE
  FUNZIONE LOGICA_INTERPRETATIVA GIURISPRUDENZA TENSIONE
}

enum FonteType { DOCENTE AI }

// Tabella di join Entity <-> Lezione
model EntityLezione {
  entityId  String
  lezioneId String
  entity    Entity  @relation(fields: [entityId], references: [id])
  lezione   Lezione @relation(fields: [lezioneId], references: [id])
  @@id([entityId, lezioneId])
}

// Relazioni tra entità
model Relation {
  id         String       @id @default(cuid())
  type       RelationType
  fromId     String
  toId       String
  label      String
  from       Entity       @relation("FromEntity", fields: [fromId], references: [id])
  to         Entity       @relation("ToEntity", fields: [toId], references: [id])
  data       Json?        // per le tensioni: poli, tecnica, manifestazioni, ecc.
  createdAt  DateTime     @default(now())

  @@index([fromId])
  @@index([toId])
  @@index([type])
}

enum RelationType {
  CATENA COROLLARIO STRUTTURALE DI_PRINCIPIO
  LIMITE_ECCEZIONE FUNZIONALE_TRASVERSALE
  POSITIVIZZA ATTUA FONDA TENSIONE
}

// Progressione utente
model UserProgress {
  userId    String
  entityId  String
  status    ProgressStatus @default(NEW)
  updatedAt DateTime @updatedAt
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  entity    Entity @relation(fields: [entityId], references: [id], onDelete: Cascade)
  @@id([userId, entityId])
}

enum ProgressStatus { NEW STUDIED MASTERED TO_REVIEW }

// Segnalibri
model UserBookmark {
  userId    String
  entityId  String
  createdAt DateTime @default(now())
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  entity    Entity @relation(fields: [entityId], references: [id], onDelete: Cascade)
  @@id([userId, entityId])
}

// Note personali
model UserNote {
  id        String   @id @default(cuid())
  userId    String
  entityId  String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  entity    Entity @relation(fields: [entityId], references: [id], onDelete: Cascade)
  @@unique([userId, entityId])
}

// Log upload/analisi documenti
model DocumentUpload {
  id          String   @id @default(cuid())
  uploadedBy  String
  filename    String
  status      UploadStatus @default(PENDING)
  proposedEntities Json?  // proposta generata da AI
  approvedAt  DateTime?
  createdAt   DateTime @default(now())
}

enum UploadStatus { PENDING ANALYZING REVIEW APPROVED REJECTED }
```

### 3.3 Struttura JSONB per tipo entità

Il campo `data` di `Entity` contiene oggetti diversi per tipo:

**Valore:**
```json
{
  "fondamento_normativo": ["Art. 13 Cost.", "Art. 5 CEDU"],
  "rationes_fondative": [
    {"label": "favor libertatis", "descrizione": "...", "tipo": "bussola"}
  ],
  "declinazioni": [{"lezione": "L1", "genera": ["P01", "P02"]}]
}
```

**Principio:**
```json
{
  "definizione": "...",
  "fondamento_normativo": ["Art. 25, co. 2, Cost."],
  "auto_applicativo": true,
  "test_giudice": "...",
  "valori_fondanti": ["V01", "V02"],
  "corollari": ["P02", "P04"],
  "carattere": "...",
  "note_critiche": "..."
}
```

**Questione:**
```json
{
  "formulazione": "...",
  "stato": "controversa",
  "tesi": [
    {"label": "...", "contenuto": "...", "autori": [], "giurisprudenza": [], "logiche_usate": []}
  ],
  "posizione_docente": "..."
}
```

**Tensione (Relation.data):**
```json
{
  "poli": ["P02", "P03"],
  "tecnica_risoluzione": ["bilanciamento", "proporzionalità"],
  "criteri_orientamento": ["favor_rei"],
  "manifestazioni": [
    {"contesto": "...", "lezione": "L1", "istituti": [], "giurisprudenza": [], "esito": "..."}
  ]
}
```

---

## 4. API ENDPOINTS

### 4.1 Autenticazione
```
POST   /api/v1/auth/register        Registrazione utente
POST   /api/v1/auth/login           Login, restituisce access + refresh token
POST   /api/v1/auth/refresh         Rinnova access token con refresh token
POST   /api/v1/auth/logout          Invalida refresh token
GET    /api/v1/auth/me              Profilo utente autenticato
```

### 4.2 Entità
```
GET    /api/v1/entities             Lista entità (filtri: type, materia, lezione, tag, zonaGrigia, q)
GET    /api/v1/entities/:id         Scheda completa di un'entità
GET    /api/v1/entities/:id/neighbors  Entità collegate (per il grafo), con profondità configurabile
GET    /api/v1/entities/:id/graph   Sottografo centrato sull'entità (nodes + edges)
POST   /api/v1/entities             Crea entità [ADMIN]
PUT    /api/v1/entities/:id         Aggiorna entità [ADMIN]
DELETE /api/v1/entities/:id         Archivia entità (soft delete) [ADMIN]
```

### 4.3 Relazioni
```
GET    /api/v1/relations/tensioni   Tutte le tensioni (filtro: materia, zonaGrigia)
GET    /api/v1/relations?from=&to=  Relazioni tra due entità
POST   /api/v1/relations            Crea relazione [ADMIN]
DELETE /api/v1/relations/:id        Elimina relazione [ADMIN]
```

### 4.4 Materie e Lezioni
```
GET    /api/v1/materie              Lista materie disponibili
GET    /api/v1/lezioni?materia=     Lista lezioni per materia
GET    /api/v1/percorsi?materia=    Percorsi tematici (per Ripasso)
```

### 4.5 Funzionalità utente
```
GET    /api/v1/user/progress        Progressione dell'utente autenticato
PUT    /api/v1/user/progress/:entityId  Aggiorna stato (NEW/STUDIED/MASTERED/TO_REVIEW)
GET    /api/v1/user/bookmarks       Segnalibri
POST   /api/v1/user/bookmarks/:entityId  Aggiunge segnalibro
DELETE /api/v1/user/bookmarks/:entityId  Rimuove segnalibro
GET    /api/v1/user/notes/:entityId Nota personale su entità
PUT    /api/v1/user/notes/:entityId Crea o aggiorna nota
DELETE /api/v1/user/notes/:entityId Elimina nota
```

### 4.6 Esercitazione
```
GET    /api/v1/esercitazione/domande?materia=&type=  Genera domande di collegamento
POST   /api/v1/esercitazione/risposte  Registra risposta e restituisce feedback
GET    /api/v1/esercitazione/stats  Statistiche personali dell'utente
```

### 4.7 Admin
```
GET    /api/v1/admin/users          Lista utenti [ADMIN]
PUT    /api/v1/admin/users/:id      Modifica ruolo/piano [ADMIN]
POST   /api/v1/admin/upload         Carica documento per analisi AI [ADMIN]
GET    /api/v1/admin/upload/:id     Stato e proposta di un upload [ADMIN]
POST   /api/v1/admin/upload/:id/approve  Approva proposta (inserisce entità) [ADMIN]
```

### 4.8 Convenzioni API
- Tutti i response body: `{ success: boolean, data: T, error?: string }`
- Errori: `{ success: false, error: string, code: string }`
- Paginazione: `?page=1&limit=20` con response `{ data: T[], total, page, limit }`
- Filtri multipli: query string, es. `?type=principio&type=valore`
- Header autenticazione: `Authorization: Bearer <access_token>`

---

## 5. STRUTTURA DEI FILE

```
mappe-giuridiche/
├── .github/
│   └── workflows/
│       ├── ci.yml              # test su ogni PR
│       └── deploy.yml          # deploy su push main (fase 2)
├── docs/
│   ├── SESSION.md              # memoria operativa per Claude Code
│   ├── ANALISI_FUNZIONALE.md   # questo documento (lato funzionale)
│   ├── DISEGNO_TECNICO.md      # questo documento (lato tecnico)
│   ├── PRD.md                  # roadmap e priorità
│   └── decisions/              # Architecture Decision Records
│       └── 001-stack-choice.md
├── data/
│   ├── schema_mappe_giuridiche.json   # schema JSON delle entità
│   ├── database_L1_con_tensioni.json  # dati L1 + 22 tensioni
│   └── import/
│       └── import-initial-data.ts     # script importazione dati iniziali
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts     # configurazione Prisma client
│   │   │   ├── auth.ts         # costanti JWT
│   │   │   └── cors.ts         # origini ammesse
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── entities.routes.ts
│   │   │   ├── relations.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── esercitazione.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── entities.controller.ts
│   │   │   ├── relations.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── esercitazione.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── entities.service.ts
│   │   │   ├── graph.service.ts        # logica del grafo e navigazione
│   │   │   ├── user.service.ts
│   │   │   ├── esercitazione.service.ts
│   │   │   └── upload.service.ts       # analisi AI documenti
│   │   ├── repositories/
│   │   │   ├── entity.repository.ts
│   │   │   ├── relation.repository.ts
│   │   │   ├── user.repository.ts
│   │   │   └── note.repository.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts      # verifica JWT
│   │   │   ├── admin.middleware.ts     # verifica ruolo ADMIN
│   │   │   ├── validate.middleware.ts  # validazione Zod
│   │   │   ├── rateLimit.middleware.ts
│   │   │   └── error.middleware.ts     # error handler centralizzato
│   │   ├── models/
│   │   │   ├── entity.model.ts         # interfacce TypeScript
│   │   │   ├── relation.model.ts
│   │   │   └── schemas/
│   │   │       ├── entity.schema.ts    # schemi Zod per validazione
│   │   │       └── auth.schema.ts
│   │   └── utils/
│   │       ├── logger.ts               # Winston
│   │       ├── jwt.ts                  # utility JWT
│   │       └── graph.utils.ts          # utility per il grafo
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed/
│   │       ├── seed.ts                 # dati iniziali da JSON
│   │       └── seed-test.ts            # dati per test
│   ├── tests/
│   │   ├── unit/
│   │   │   └── services/
│   │   └── integration/
│   │       └── api/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Button, Badge, Input, Pill, Divider
│   │   │   ├── layout/         # Sidebar, Header, PageLayout
│   │   │   └── features/
│   │   │       ├── entity/     # EntityCard, EntityBadge, EntityLink
│   │   │       ├── graph/      # GraphPanel, GraphNode
│   │   │       ├── studio/     # InquadramentoTab, ConnessioniTab, TesiTab
│   │   │       ├── ripasso/    # FlashCard, PercorsoList
│   │   │       ├── esercitazione/  # Domanda, Feedback
│   │   │       └── questioni/  # QuestioneCard, TesiList
│   │   ├── pages/
│   │   │   ├── Studio.tsx
│   │   │   ├── Ripasso.tsx
│   │   │   ├── Esercitazione.tsx
│   │   │   ├── Questioni.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── admin/
│   │   │       ├── AdminEntita.tsx
│   │   │       └── AdminUpload.tsx
│   │   ├── hooks/
│   │   │   ├── useEntity.ts        # fetch + cache entità
│   │   │   ├── useGraph.ts         # sottografo contestuale
│   │   │   ├── useNavHistory.ts    # ← → navigation
│   │   │   ├── useNotes.ts         # note personali
│   │   │   └── useProgress.ts      # progressione studio
│   │   ├── stores/
│   │   │   ├── authStore.ts        # utente autenticato
│   │   │   └── uiStore.ts          # sidebar open, grafo open, materia
│   │   ├── services/
│   │   │   ├── api.ts              # axios instance con interceptors
│   │   │   ├── entities.api.ts
│   │   │   ├── auth.api.ts
│   │   │   └── user.api.ts
│   │   ├── types/
│   │   │   ├── entity.types.ts     # interfacce TypeScript (specchio del backend)
│   │   │   └── api.types.ts        # tipi response API
│   │   ├── utils/
│   │   │   └── entity.utils.ts     # helper per badge, colori, icone
│   │   ├── constants/
│   │   │   └── theme.ts            # palette AgID, icone per tipo
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── docker-compose.yml          # sviluppo locale
├── docker-compose.prod.yml     # template produzione
└── README.md
```

---

## 6. SICUREZZA

### 6.1 Autenticazione
- Access token JWT: scadenza 15 minuti, payload `{ userId, role, subscriptionTier }`
- Refresh token: scadenza 7 giorni, memorizzato in DB (tabella `RefreshToken`), ruotato ad ogni uso
- Logout: elimina il refresh token dal DB
- Password: bcrypt con 12 rounds

### 6.2 Protezione endpoint
- Tutti gli endpoint `user.*` e `admin.*` richiedono access token valido
- Gli endpoint `admin.*` richiedono in aggiunta `role === ADMIN`
- Rate limiting: 100 req/15min per IP sugli endpoint pubblici, 500 req/15min per utenti autenticati
- CORS: solo l'origine `FRONTEND_URL` è autorizzata in produzione

### 6.3 Input validation
- Tutti gli input passano per schemi Zod prima di raggiungere il controller
- Le query SQL passano sempre tramite Prisma (parametri bindati — no SQL injection)
- Il contenuto del campo `data` JSONB è validato prima della scrittura

---

## 7. DEPLOYMENT

### 7.1 Sviluppo locale
```bash
docker-compose up
# Avvia: PostgreSQL (5432), backend (3001), frontend (5173)
```

### 7.2 Produzione (VPS / cloud)
Il `docker-compose.prod.yml` aggiunge:
- Nginx come reverse proxy (porta 80/443)
- Certificato SSL (Let's Encrypt o manuale)
- Variabili d'ambiente da file `.env.prod` (non versionato)
- Volume persistente per il database

### 7.3 Migration e seed
```bash
# Prima installazione
cd backend
npx prisma migrate deploy      # applica tutte le migration
npx prisma db seed             # inserisce i dati iniziali dal JSON

# Aggiornamenti
npx prisma migrate dev --name <nome>   # crea e applica nuova migration
```

### 7.4 Backup database
```bash
pg_dump -U postgres mappe_giuridiche > backup_$(date +%Y%m%d).sql
```

---

## 8. STANDARD DI QUALITÀ DEL CODICE

### 8.1 Regole obbligatorie
- Max 300 righe per file sorgente
- Zero `any` in TypeScript (eccezioni documentate con commento)
- Zero `console.log` in produzione (usa Winston logger)
- Zero valori hardcoded (tutto in `.env` o `config/`)
- Pattern MVC + Repository rigoroso (niente Prisma nei controller)
- DRY: nessuna logica duplicata
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

### 8.2 Configurazioni ESLint e Prettier
Vedi `backend/.eslintrc.json` e `frontend/.eslintrc.json` (generati durante il setup iniziale da Claude Code).

### 8.3 Test
- Coverage minima services backend: 60%
- Ogni endpoint API: almeno happy path + caso di errore
- Componenti React critici: smoke test con React Testing Library

### 8.4 Accessibilità
- WCAG 2.1 AA obbligatorio (requisito AgID)
- `aria-label` su tutti gli elementi interattivi senza testo visibile
- Navigazione da tastiera completa
- Contrasto minimo 4.5:1 per testo normale, 3:1 per testo grande
'''

files['docs/PRD.md'] = '''# PRD — Product Requirements Document
## Mappe Giuridiche — Roadmap e priorità
### Versione 1.0 — Marzo 2026

---

## 1. VISION

Diventare lo strumento di riferimento per la preparazione ai concorsi in magistratura e per la formazione giuridica avanzata in Italia, distinguendosi dai compendi tradizionali per la capacità di mostrare la struttura relazionale del diritto — non solo cosa dice la legge, ma perché e come si connette al sistema.

---

## 2. UTENTI TARGET

**Primario**: Aspiranti magistrati in preparazione al concorso in magistratura ordinaria.
**Secondario**: Avvocati e praticanti che vogliono approfondire la parte generale del diritto penale.
**Terziario**: Docenti universitari e formatori che vogliono condividere materiale strutturato con i propri allievi.

---

## 3. RELEASE PLAN

### Versione 1.0 — MVP (obiettivo: 3 mesi)
**Scope**: Diritto penale parte generale, 5 lezioni estratte.

**Must have:**
- [ ] Autenticazione (register, login, logout, refresh token)
- [ ] Pagina Studio: sidebar + scheda entità + grafo contestuale
- [ ] Navigazione ← → (history locale)
- [ ] Sidebar collassabile (espansa/compatta)
- [ ] Grafo togglabile
- [ ] Tutte le 8 categorie di entità visualizzabili
- [ ] Tab Inquadramento, Connessioni, Tesi (per Q), Manifestazioni (per T), Nota personale
- [ ] Indicatore fonte (docente/AI) e zona critica
- [ ] Gerarchia istituti nella sidebar (padre/figlio)
- [ ] Pagina Questioni: repertorio con filtri e tesi a confronto
- [ ] Note personali persistenti per utente
- [ ] Import dati iniziali da JSON (L1 + 22 tensioni)
- [ ] Admin: CRUD entità + inserimento testo norme

**Nice to have v1.0:**
- [ ] Pagina Ripasso (percorsi tematici + flash card)
- [ ] Segnalibri

### Versione 1.1 (obiettivo: 2 mesi dopo v1.0)
- [ ] Pagina Esercitazione (domande di collegamento + mini-casi)
- [ ] Tracking progressione utente (NEW/STUDIED/MASTERED/TO_REVIEW)
- [ ] Import dati L2–L5 nel database
- [ ] Admin: funzione upload e analisi documenti (integrazione API Anthropic)
- [ ] Gestione tesi opposte (aggiunta tesi, aggiornamento stato questione)

### Versione 1.2 (obiettivo: 3 mesi dopo v1.1)
- [ ] Materia: Diritto civile (corpus iniziale)
- [ ] Pagina "Chiedi all'Assistente" (chat AI con base dati come contesto primario)
- [ ] Integrazione pagamenti Stripe
- [ ] Piani di abbonamento automatizzati

### Versione 2.0 (roadmap)
- [ ] Materia: Diritto amministrativo
- [ ] App mobile (React Native o PWA)
- [ ] Collaborazione tra utenti (condivisione note, percorsi personalizzati)
- [ ] API pubblica per integrazioni esterne

---

## 4. PRIORITÀ FEATURE (MoSCoW per v1.0)

### Must (bloccante per il lancio)
- Visualizzazione completa delle entità con tutte le sezioni
- Navigazione funzionante (sidebar → scheda → grafo → scheda)
- Note personali
- Autenticazione base

### Should (importante ma non bloccante)
- Ripasso con percorsi tematici
- Segnalibri
- Filtri avanzati nella sidebar

### Could (se rimane tempo)
- Dark mode
- Export scheda in PDF

### Won't (escluso da v1.0)
- App mobile
- Pagamenti
- Funzione AI chat

---

## 5. METRICHE DI SUCCESSO (v1.0)

- Tempo medio per trovare e aprire un'entità dalla sidebar: < 10 secondi
- Latenza scheda entità: < 500ms
- Zero crash bloccanti nel percorso critico (sidebar → scheda → grafo)
- 100% delle entità L1 importate e navigabili
- Nota personale salvata e recuperata correttamente per 100% degli utenti test

---

## 6. RISCHI E MITIGAZIONI

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Performance grafo con molti nodi (300+) | Media | Alto | Cytoscape.js con layout virtualizzato; sottografi a profondità limitata |
| Complessità schema JSONB per query avanzate | Media | Medio | Indici GIN su campi JSONB usati in ricerca; fallback a query TypeScript |
| Dipendenza API Anthropic per upload | Bassa | Basso | Funzionalità disabilitabile; resto dell'app indipendente |
| Mancanza dati L2–L5 per lancio | Alta | Alto | v1.0 lancia con L1 (85 entità, 22 tensioni) — sufficiente per la demo |
'''

files['docs/decisions/001-stack-choice.md'] = '''# ADR 001 — Scelta dello stack tecnologico
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
'''

files['README.md'] = '''# Mappe Giuridiche

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

L'app sarà disponibile su `http://localhost:5173`.

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
'''

for relpath, content in files.items():
    fullpath = os.path.join(ROOT, relpath)
    os.makedirs(os.path.dirname(fullpath), exist_ok=True)
    with open(fullpath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'  creato: {relpath}')

print()
print('Documentazione pronta. Ora esegui:')
print('  git add .')
print('  git commit -m "docs: aggiungi documentazione iniziale del progetto"')
print('  git push -u origin main')