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

### Debito tecnico aperto
- [ ] Rimuovere vecchio Sidebar.tsx (non più importato)
- [ ] Migrare EntityCardHeader, TabConnessioni, UploadReview,
      EntityPreview da ENTITY_COLORS alle CSS custom properties
- [ ] Rivalutare limite Zod max(100) quando entità totali > 500

---

## BLOCCO A — UI/UX

### A1 — Connessioni inline + finestra mobile [IN CORSO]
Connessioni visibili nella tab Inquadramento come card accordion
in testa alla scheda (due colonne IN/OUT, responsive).
Finestra mobile al hover su item connessione: preview con
testo inquadramento, pin per persistenza globale (Zustand),
drag & drop, "Vai all'entità".
Finestre pinnate sopravvivono alla navigazione.
Pannello "Aperte" nell'header se finestre pinnate attive.
Prompt scritto e lanciato — in attesa di risultato.

### A2 — Grafo: nodi parlanti + interazioni [IN CORSO]
Nodi Cytoscape con label visibile (tipo + label troncata).
Archi colorati per tipo di relazione con legenda.
Tooltip al hover su nodo (label completa).
Prompt scritto e lanciato insieme ad A1.

### A3 — Responsive mobile
Bottom navigation bar (Studio/Ripasso/Esercitazione/Questioni).
Header mobile semplificato: burger + "MAPPE GIURIDICHE" +
chip materia attiva (tap → modal selezione materia).
Drawer come bottom sheet (75vh, swipe down chiude, backdrop).
Grafo come overlay full-screen via FAB (Lucide Network).
Prompt scritto — da lanciare dopo A1+A2.

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

### B1 — Popolazione L2–L5 nel database
Script seed per inserire le entità estratte dalle schede
L02–L05. Prerequisito per C1 (relazioni trasversali).
Stima: da 142 entità attuali a ~420 totali.
Attenzione: dopo B1 getAllEntities gestirà 5+ pagine —
verificare performance e rivalutare limite Zod.
Assegnare le entità ai capitoli corretti durante il seed.

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

### C1 — Relazioni trasversali L1–L5
Collegamento entità tra lezioni diverse nel database.
Le 22 tensioni sono già in database_L1_con_tensioni.json
per L1 — estendere a tutte le lezioni dopo B1.
Prerequisito: B1 (popolazione L2–L5).
Questo è il cuore del prodotto: senza queste relazioni
le mappe non mostrano la loro potenza didattica.

### C2 — Visualizzazione tensioni nel grafo
Tensioni come archi visibili e distinti in Cytoscape.
Stile arco diverso per tipo di relazione (già parzialmente
implementato in A2 — qui si completa per le tensioni).
Indicatore zona grigia su nodi e archi patologici.
Le 8 tensioni con zona_grigia: true (T04, T05, T07, T13,
T15, T18, T20, T21) devono essere visivamente distinte.

### C3 — Pagina Questioni
Repertorio completo entità Q con tesi a confronto.
Filtri: materia, capitolo, stato questione, zona critica.
Posizione del docente evidenziata (badge "docente").
Collegamento diretto alle entità correlate (navigabile).
Indicatore visivo per questioni in zona critica.

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

---

## STORICO BUG RISOLTI

| Data | Bug | Causa | Fix |
|------|-----|-------|-----|
| mar 2026 | Filtro tipo VALORE non funzionava | Mismatch sigla→enum | Corretta mappatura in theme.ts |
| mar 2026 | Lista entità sempre vuota | limit:500 violava Zod max(100) | getAllEntities() con paginazione automatica |
