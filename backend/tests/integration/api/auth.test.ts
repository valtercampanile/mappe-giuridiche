import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/config/database';

const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
};

beforeAll(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('POST /api/v1/auth/register', () => {
  afterEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  it('registra un nuovo utente e restituisce tokens', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(TEST_USER);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.email).toBe(TEST_USER.email);
    expect(res.body.data.user.name).toBe(TEST_USER.name);
    expect(res.body.data.user.role).toBe('USER');
    expect(res.body.data.user).not.toHaveProperty('passwordHash');
  });

  it('rifiuta email duplicata', async () => {
    await request(app).post('/api/v1/auth/register').send(TEST_USER);
    const res = await request(app).post('/api/v1/auth/register').send(TEST_USER);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('EMAIL_EXISTS');
  });

  it('rifiuta password troppo corta', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...TEST_USER, password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/v1/auth/login', () => {
  beforeAll(async () => {
    await request(app).post('/api/v1/auth/register').send(TEST_USER);
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  it('effettua login con credenziali corrette', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: TEST_USER.email, password: TEST_USER.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.email).toBe(TEST_USER.email);
  });

  it('rifiuta email non registrata', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nope@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('rifiuta password errata', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: TEST_USER.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });
});

describe('POST /api/v1/auth/refresh', () => {
  let validRefreshToken: string;

  beforeAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    const res = await request(app).post('/api/v1/auth/register').send(TEST_USER);
    validRefreshToken = res.body.data.refreshToken as string;
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  it('rinnova i token con refresh token valido', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: validRefreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.refreshToken).not.toBe(validRefreshToken);
  });

  it('rifiuta refresh token non valido', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'invalid.token.here' });

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_REFRESH_TOKEN');
  });
});

describe('GET /api/v1/auth/me', () => {
  let accessToken: string;

  beforeAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    const res = await request(app).post('/api/v1/auth/register').send(TEST_USER);
    accessToken = res.body.data.accessToken as string;
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  it('restituisce il profilo utente autenticato', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.userId).toBeDefined();
    expect(res.body.data.user.role).toBe('USER');
  });

  it('rifiuta richiesta senza token', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('MISSING_TOKEN');
  });

  it('rifiuta token non valido', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_TOKEN');
  });
});
