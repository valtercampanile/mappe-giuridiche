# DISEGNO TECNICO
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
