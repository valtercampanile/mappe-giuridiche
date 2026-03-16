# BACKLOG — Lavori in corso e da fare
## Mappe Giuridiche
### Aggiornato: 2026-03-16

---

## IN CORSO — Sessione corrente

### Refactoring sidebar (Rail + Drawer)
- [x] Architettura Rail (56px) + Drawer (resizable 200-400px)
- [x] Rail: lettere materia (P, C, A), header 44px con burger
- [x] Drawer: header con nome materia, DrawerMaterie, DrawerSearch, DrawerFilterChips, DrawerEntityList
- [x] SidebarLayout con resize handle e context
- [x] Filtro chip per tipo entità con "Seleziona/Deseleziona tutto"
- [x] Fix lista vuota: paginazione automatica con `getAllEntities()`
- [ ] Commit e test end-to-end completo

### Ristrutturazione header
- [x] AppHeader con sfondo #0066CC, posizionato a destra della sidebar
- [x] Tab navigazione con icone Lucide + label
- [x] Dropdown Admin invariato
- [ ] Commit e test end-to-end completo

---

## DA FARE — v1.0 (bloccante per il lancio)

### Dati
- [ ] Popolazione L2-L5 nel database (attualmente solo L1, 142 entita)
- [ ] Completare inquadramento per le 4 entita mancanti (4/85 senza testo)

### Funzionalita
- [ ] Note personali: endpoint backend da completare (UI gia presente)
- [ ] Gerarchia istituti nella sidebar (padre/figlio) — attualmente lista piatta
- [ ] Admin CRUD entita (attualmente placeholder)

### Bug noti
- [ ] Backend `limit` max 100: il frontend pagina, ma la sidebar carica tutto in memoria. Valutare paginazione virtuale o aumento del limite backend quando il corpus cresce oltre 500 entita

---

## DA FARE — v1.1

- [ ] Pagina Ripasso (percorsi tematici + flash card)
- [ ] Pagina Esercitazione (domande di collegamento + mini-casi)
- [ ] Tracking progressione utente (NEW/STUDIED/MASTERED/TO_REVIEW)
- [ ] Segnalibri
- [ ] Upload e analisi documenti con API Anthropic
- [ ] Gestione tesi opposte (aggiunta tesi, aggiornamento stato questione)

---

## DA FARE — v1.2+

- [ ] Materia: Diritto civile (corpus iniziale)
- [ ] Pagina "Chiedi all'Assistente" (chat AI con base dati come contesto)
- [ ] Integrazione pagamenti Stripe
- [ ] Piani di abbonamento automatizzati
- [ ] Dark mode
- [ ] Export scheda in PDF

---

## DECISIONI ARCHITETTURALI APERTE

| Tema | Opzioni | Note |
|------|---------|------|
| Paginazione sidebar con corpus > 500 | Paginazione virtuale (react-window) vs aumento limit backend vs scroll infinito | Attualmente carica tutto in memoria; funziona fino a ~500 entita |
| Persistenza stato sidebar | Zustand (attuale, in-memory) vs localStorage vs URL params | Il drawer si resetta a ogni refresh |
| Ricerca entita | Client-side (attuale) vs backend full-text search (pg_trgm) | Client-side funziona fino a ~500 entita |

---

## STORICO BUG RISOLTI

| Data | Bug | Causa | Fix |
|------|-----|-------|-----|
| 2026-03-16 | Lista entita sempre vuota | Frontend inviava `limit=500`, backend Zod `max(100)` → HTTP 400 silenzioso | `getAllEntities()` con paginazione automatica |
| 2026-03-16 | Upsert JSONB sovrascriveva dati | `data` JSONB sostituito integralmente | Deep merge `{ ...existing.data, ...newData }` |
