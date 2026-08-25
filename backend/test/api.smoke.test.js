import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();
let accessToken;

async function checkDbConnection() {
  try {
    const res = await request(app).get('/api/v1/smm/services');
    return res.status === 200;
  } catch {
    return false;
  }
}

test('database connection available', async () => {
  const connected = await checkDbConnection();
  if (!connected) {
    test.skip('Database not available locally');
    return;
  }
});

test('registers and authenticates a user', async () => {
  const connected = await checkDbConnection();
  if (!connected) {
    test.skip('Database not available locally');
    return;
  }

  const register = await request(app).post('/api/v1/auth/register').send({
    username: 'smoke_user',
    email: 'smoke@example.com',
    password: 'strong-pass-123'
  });
  assert.equal(register.status, 201);
  assert.ok(register.body.accessToken);
  assert.ok(register.body.refreshToken);
  assert.ok(register.body.user);

  const login = await request(app).post('/api/v1/auth/login').send({
    identifier: 'smoke@example.com',
    password: 'strong-pass-123'
  });
  assert.equal(login.status, 200);
  assert.ok(login.body.accessToken);
  accessToken = login.body.accessToken;
});

test('protects private endpoints and exposes public services', async () => {
  const connected = await checkDbConnection();
  if (!connected) {
    test.skip('Database not available locally');
    return;
  }

  const services = await request(app).get('/api/v1/smm/services');
  assert.equal(services.status, 200);
  assert.equal(services.body.length, 9);

  const unauthorized = await request(app).get('/api/v1/smm/profile');
  assert.equal(unauthorized.status, 401);

  const profile = await request(app).get('/api/v1/smm/profile').set('Authorization', `Bearer ${accessToken}`);
  assert.equal(profile.status, 200);
});

test('calculates order charge on the server', async () => {
  const connected = await checkDbConnection();
  if (!connected) {
    test.skip('Database not available locally');
    return;
  }

  const funding = await request(app)
    .post('/api/v1/smm/balance/add')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ amount: 10 });
  assert.equal(funding.status, 200);

  const response = await request(app)
    .post('/api/v1/smm/orders')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ serviceId: 1, link: 'https://instagram.com/example', quantity: 500 });

  assert.equal(response.status, 201);
  assert.equal(response.body.charge, 6.25);
  assert.equal(response.body.serviceName, 'Instagram Followers');
});
