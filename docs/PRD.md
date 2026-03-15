# PRD — Product Requirements Document
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
