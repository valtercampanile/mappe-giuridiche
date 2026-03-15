import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/database';
import bcrypt from 'bcrypt';
import { signAccessToken } from '../../../src/utils/jwt';

let adminToken: string;
let userToken: string;

beforeAll(async () => {
  // Ensure seed data exists
  const entityCount = await prisma.entity.count();
  if (entityCount === 0) {
    throw new Error('Run seed before tests: npx tsx prisma/seed/seed.ts');
  }

  // Create admin user
  const adminHash = await bcrypt.hash('adminpass123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin-test@example.com' },
    update: {},
    create: { email: 'admin-test@example.com', passwordHash: adminHash, name: 'Admin', role: 'ADMIN' },
  });
  adminToken = signAccessToken({ userId: admin.id, role: 'ADMIN', subscriptionTier: 'COMPLETE' });

  // Create regular user
  const userHash = await bcrypt.hash('userpass123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user-test@example.com' },
    update: {},
    create: { email: 'user-test@example.com', passwordHash: userHash, name: 'User', role: 'USER' },
  });
  userToken = signAccessToken({ userId: user.id, role: 'USER', subscriptionTier: 'BASE' });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: ['admin-test@example.com', 'user-test@example.com'] } } });
  await prisma.$disconnect();
});

describe('GET /api/v1/entities', () => {
  it('restituisce la lista delle entità senza filtri', async () => {
    const res = await request(app).get('/api/v1/entities');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.page).toBe(1);
  });

  it('filtra per type=PRINCIPIO', async () => {
    const res = await request(app).get('/api/v1/entities?type=PRINCIPIO');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    for (const entity of res.body.data) {
      expect(entity.type).toBe('PRINCIPIO');
    }
  });

  it('filtra per ricerca testuale (q)', async () => {
    const res = await request(app).get('/api/v1/entities?q=legalità');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    for (const entity of res.body.data) {
      expect(entity.label.toLowerCase()).toContain('legalità');
    }
  });
});

describe('GET /api/v1/entities/:id', () => {
  it('restituisce un\'entità esistente', async () => {
    const res = await request(app).get('/api/v1/entities/P01');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('P01');
    expect(res.body.data.type).toBe('PRINCIPIO');
    expect(res.body.data.label).toBeDefined();
  });

  it('restituisce 404 per entità non trovata', async () => {
    const res = await request(app).get('/api/v1/entities/NONEXISTENT');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('ENTITY_NOT_FOUND');
  });
});

describe('GET /api/v1/entities/:id/graph', () => {
  it('restituisce il sottografo di un\'entità', async () => {
    const res = await request(app).get('/api/v1/entities/P01/graph');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nodes.length).toBeGreaterThan(0);
    expect(res.body.data.edges.length).toBeGreaterThan(0);

    const nodeIds = res.body.data.nodes.map((n: { id: string }) => n.id);
    expect(nodeIds).toContain('P01');
  });
});

describe('GET /api/v1/relations/tensioni', () => {
  it('restituisce le tensioni', async () => {
    const res = await request(app).get('/api/v1/relations/tensioni');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    for (const rel of res.body.data) {
      expect(rel.type).toBe('TENSIONE');
    }
  });
});

describe('POST /api/v1/entities', () => {
  const testEntityId = 'TEST_E01';

  afterEach(async () => {
    await prisma.entity.deleteMany({ where: { id: testEntityId } });
  });

  it('crea un\'entità con ruolo admin', async () => {
    const res = await request(app)
      .post('/api/v1/entities')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id: testEntityId,
        type: 'ISTITUTO',
        label: 'Istituto test',
        materiaId: 'penale',
        data: { definizione: 'Test' },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(testEntityId);
  });

  it('rifiuta creazione senza ruolo admin', async () => {
    const res = await request(app)
      .post('/api/v1/entities')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        id: testEntityId,
        type: 'ISTITUTO',
        label: 'Istituto test',
        materiaId: 'penale',
        data: { definizione: 'Test' },
      });

    expect(res.status).toBe(403);
    expect(res.body.code).toBe('FORBIDDEN');
  });
});
