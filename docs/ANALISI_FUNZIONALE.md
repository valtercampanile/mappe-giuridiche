# ANALISI FUNZIONALE
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
