# BACKLOG — Mappe Giuridiche
## Roadmap e priorità di sviluppo
### Ultimo aggiornamento: marzo 2026

---

## STATO ATTUALE

### Completato
- [x] Sidebar desktop: Rail + Drawer con filtro entità
- [x] Header: "MAPPE GIURIDICHE" + tab navigazione
      (Studio/Ripasso/Esercitazione/Questioni) con icone Lucide
- [x] Sistema colori entità (CSS custom properties :root)
- [x] Colori nodi grafo allineati alla palette entità
- [x] Fix paginazione entità (getAllEntities con pagine parallele)
- [x] Fix filtro tipo VALORE
- [x] Rail: lettere P/C/A al posto di icone + etichette
- [x] Drawer: materie senza icone, testo maiuscolo, ordine fisso
      (DIRITTO PENALE · DIRITTO CIVILE · DIRITTO AMMINISTRATIVO)
- [x] Documentazione: SESSION.md + BACKLOG.md + ANALISI_FUNZIONALE.md
      aggiornati allo stato reale
- [x] A1: Connessioni inline + finestra mobile pinnabile
      (accordion in Inquadramento, hover preview, pin, drag,
      collisione cascade, dropdown "Aperte" nell'header)
- [x] A2: Grafo nodi parlanti + archi colorati + legenda
- [x] B1: Seed EntityLezione L2-L5 + chapter tags ISTITUTO
- [x] C1: Relazioni trasversali L1-L5 (28 nuove, 74 totali)
- [x] C2: Visualizzazione tensioni nel grafo (pannello dettaglio,
      archi tratteggiati rossi, nodi polo, legenda aggiornata)
- [x] C0: Seed questioni complete (25 Q, 127 relazioni Q-grafo)
- [x] C1: Relazioni trasversali L1-L5 (catena V→P cross-lezione,
      P L1 che governano istituti L2-L5, 28 relazioni)
- [x] C2: Visualizzazione tensioni nel grafo (archi tratteggiati,
      TensionePanel, nodi polo, legenda aggiornata)
- [x] C3: Pagina Questioni (struttura base: lista + filtri +
      scheda dettaglio + tesi + posizione docente)
- [x] Fix I14, I20, I69 (istituti L1/L5 mancanti)
- [x] Filtro capitoli nel drawer (endpoint + DrawerCapitoli)

### Debito tecnico aperto
- [ ] Rimuovere vecchio Sidebar.tsx (non più importato)
- [ ] Migrare EntityCardHeader, TabConnessioni, UploadReview,
      EntityPreview da ENTITY_COLORS alle CSS custom properties
- [ ] Rivalutare limite Zod max(100) quando entità totali > 500

---

## BLOCCO A — UI/UX

### A1 — Connessioni inline + finestra mobile [COMPLETATO]
Connessioni visibili nella tab Inquadramento come card accordion
in testa alla scheda (due colonne IN/OUT). Tab Connessioni rimosso.
Finestra mobile al hover su item connessione: title bar unica
con accordion integrato, pin per persistenza globale (Zustand),
drag & drop, collisione cascade, hover robusto con close delay.
Dropdown "Aperte" interattivo nell'header (lista + chiudi tutte).

### A2 — Grafo: nodi parlanti + interazioni [COMPLETATO]
Nodi Cytoscape roundrectangle con sigla tipo + label troncata.
Archi colorati per tipo di relazione con legenda compatta.
Tooltip al hover su nodo (label completa).

### A3 — Responsive mobile [PROSSIMO — prompt già scritto]
Bottom navigation bar (Studio/Ripasso/Esercitazione/Questioni).
Header mobile semplificato: burger + "MAPPE GIURIDICHE" +
chip materia attiva (tap → modal selezione materia).
Drawer come bottom sheet (75vh, swipe down chiude, backdrop).
Grafo come overlay full-screen via FAB (Lucide Network).

### A4 — Capitoli
Nuova tabella Capitolo + join EntityCapitolo (solo ISTITUTO).
Capitoli iniziali del Penale:
  - I principi (L1 + L2)
  - Antigiuridicità (L3)
  - Elemento materiale del reato (L4)
  - Colpevolezza (L5)
Ogni materia ha i propri capitoli.
Assegnazione automatica all'upload (admin sceglie capitolo).
Seed delle assegnazioni per le 5 lezioni già caricate.
Filtro capitolo nel drawer (visibile solo con chip I attivo).
Admin UI: CRUD capitoli + assegnazione entità.

### A5 — Dossier
Contenitore di lavoro personale dello studente.
Tab interni: Item salvati · Note · Temi · Caricati.
Modal "Salva nel dossier" da qualsiasi scheda entità
(cerca dossier esistente o crea nuovo inline).
Editor rich text per Temi: TipTap, foglio bianco
o modello personale salvato dall'utente.
Nessun template predefinito di sistema.
Nuovo tab "Dossier" nell'header principale.
I segnalibri (UserBookmark nel DB) confluiscono
nel sistema Dossier — non funzionalità separata.

---

## BLOCCO B — Contenuti e integrazione

### B1 — Popolazione L2–L5 nel database [COMPLETATO]
Le 142 entità erano già nel DB da L1 + admin uploads.
Seed completato: 164 EntityLezione mappings creati
(L1:88, L2:23, L3:21, L4:17, L5:15).
54 ISTITUTO taggati con capitolo (cap_principi,
cap_antigiuridicita, cap_elemento_materiale, cap_colpevolezza).
Script: data/seed/seed-L2-L5.ts (idempotente).

### B2 — Workflow upload AI migliorato
Integrazione armonica di nuovo materiale senza conflitti
con entità esistenti.
Deep merge intelligente: proposta AI → revisione admin
campo per campo → commit selettivo.
Indicatore fonte (docente/AI) per ogni campo dell'entità.
Gestione duplicati: rilevamento automatico di entità simili
già presenti, proposta di merge invece di creazione.
Logica: il nuovo materiale arricchisce, non sovrascrive.

### B3 — Allineamento palette colori (debito tecnico)
Migrare EntityCardHeader, TabConnessioni, UploadReview,
EntityPreview da ENTITY_COLORS alle CSS custom properties.
Garantisce consistenza visiva in tutta l'app.

---

## BLOCCO C — Fase 2: relazioni trasversali

### C1 — Relazioni trasversali L1–L5 [COMPLETATO]
28 relazioni cross-lezione inserite (da 42 a 70 totali).
25 relazioni semplici (FONDA, COROLLARIO, STRUTTURALE,
DI_PRINCIPIO, LIMITE_ECCEZIONE) + 3 nuove tensioni
(V01-V06, P25-V03, P27-P09) + 2 tensioni aggiornate
con nuove manifestazioni (P05-V03, P02-P06).
Script: data/seed/relazioni_trasversali.ts (idempotente).
TODO risolti: I69 creata, P26->I69 inserita, tensione P11/V07 creata,
tensione P01/V04 creata con SS.UU. 384.

### C2 — Visualizzazione tensioni nel grafo [COMPLETATO]
Archi TENSIONE tratteggiati rossi (2.5px) nel grafo Cytoscape.
Nodi polo delle tensioni: bordo tratteggiato rosso.
Click su arco TENSIONE apre TensionePanel sovrapposto:
poli cliccabili, tecnica di risoluzione, criteri, zona critica
banner, manifestazioni accordion con istituti navigabili.
Legenda aggiornata con SVG tratteggiato + zona critica.
Hover su arco mostra label tensione come tooltip.
Escape chiude il pannello.
14 tensioni nel DB (9 originali + 5 nuove cross-lezione).

### C3 — Pagina Questioni [STRUTTURA BASE COMPLETATA]
Struttura base funzionante: lista + filtri (stato, zona critica,
search) + scheda dettaglio con tesi e posizione docente.
Dati pronti: 25 Q (13 L1 + 12 L2-L5), tutte collegate
al grafo con 127 relazioni (45 Q→P, 41 Q→I, 41 I→Q).
Interventi pianificati:
  1. Integrazione sidebar Rail+Drawer (fix layout)
  2. Grafo contestuale centrato sulla Q selezionata
     (principi in gioco + istituti + tensione sottostante)
  3. Filtro capitolo (chip row, stesso stile drawer)

---

## BLOCCO D — Funzionalità future

### D1 — Pagina Ripasso
Percorsi tematici preconfigurati (es. "La catena della
legalità", "Il protocollo dell'interprete").
Flash card: titolo entità → rivela definizione sintetica.
Marcatura avanzamento: da rivedere / studiata / padroneggiata.
Filtro "mostra solo da rivedere".

### D2 — Pagina Esercitazione
Domande di collegamento: "Quale valore fonda P04?",
"Quali istituti sono governati da P02?".
Mini-casi: scenario + domanda, risposta tra le tesi Q.
Feedback con spiegazione e riferimento all'entità origine.
Adattamento: entità con errori vengono ripresentate.

### D3 — Tracce e aggiornamenti periodici
Lo studente riceve tracce di temi da svolgere nel Dossier.
Aggiornamento periodico degli item e delle materie.
Potenziale evoluzione: piattaforma completa per la
preparazione al concorso in magistratura.

### D4 — Materie civile e amministrativo
Estensione del corpus a diritto civile e amministrativo.
I placeholder sono già presenti nel DB.
Richiede nuovo ciclo di estrazione lezioni (come Fase 1
del penale) e popolazione del DB.

### D5 — Gestione utenti e abbonamenti
Piani Base/Avanzato/Completo.
Integrazione Stripe (pagamenti).
Profilo utente: preferenze tema, dimensione testo.
Gestione manuale abbonamenti dall'admin (già nella v1.0).

---

## NOTE ARCHITETTURALI PERMANENTI

- **Limite Zod**: entity.schema.ts ha max(100) per il
  parametro limit. Usare sempre getAllEntities() lato
  frontend. Rivalutare soglia quando entità > 500.
- **Editor rich text**: TipTap (stessa scelta di Kairos).
- **Finestra mobile**: vive in Zustand, persiste globalmente,
  sopravvive alla navigazione. React Portal su document.body.
- **Dossier vs Note**: Note = appunti dello studente sull'entità.
  Dossier = contenitore di lavoro tematico. Sono strumenti
  distinti e complementari, non alternativi.
- **Capitoli**: solo per ISTITUTO, ogni materia ha i suoi.
  Sono raggruppamenti tematici flessibili (molti-a-molti),
  non gerarchia rigida.
- **Zona grigia**: 8 tensioni patologiche documentate
  (T04, T05, T07, T13, T15, T18, T20, T21). Indicatore
  visivo rosso su nodi, archi e schede coinvolte.
- **Integrazione armonica**: il nuovo materiale caricato
  arricchisce le entità esistenti, non le sovrascrive.
  Deep merge sempre, mai sostituzione.
- **Questioni nel grafo**: le Q sono nodi del grafo a pieno
  titolo: relazioni DI_PRINCIPIO→P, STRUTTURALE→I/N/G,
  STRUTTURALE→T. Non creare Q senza le relative relazioni.
- **Grafo Questioni**: centrato sulla Q (non sull'entità
  generica) — stessa libreria Cytoscape ma layout e focus
  diversi da Studio.
- **Storico fix entità**: I14, I20 mancanti dal seed L1;
  I69 mancante dal seed L5 (recuperati con fix dedicati).

---

## STORICO BUG RISOLTI

| Data | Bug | Causa | Fix |
|------|-----|-------|-----|
| mar 2026 | Filtro tipo VALORE non funzionava | Mismatch sigla→enum | Corretta mappatura in theme.ts |
| mar 2026 | Lista entità sempre vuota | limit:500 violava Zod max(100) | getAllEntities() con paginazione automatica |
| mar 2026 | I14, I20 mancanti da seed L1 | Entità non inserite nel seed iniziale | fix_I14_I20.ts |
| mar 2026 | I69 mancante da seed L5 | Entità non inserita in B1 | relazioni_trasversali_fix.ts |
| mar 2026 | Q01-Q13 isolate nel grafo | Seed B1 non inseriva relazioni Q-I/P | seed_questioni.ts |
