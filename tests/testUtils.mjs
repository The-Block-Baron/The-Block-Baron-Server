import supertest from 'supertest';
import app from '../server.js';

import dotenv from 'dotenv'

dotenv.config()

export const getAdminToken = async () => {
  let adminToken;
  await supertest(app)
    .post('/auth/admin/login')
    .send({ email: process.env.ADMIN1_EMAIL, password: process.env.ADMIN1_PASSWORD })
    .then((res) => {
      adminToken = res.body.token;
    });
  return adminToken;
}

export const getPlayerToken = async () => {
  let playerToken;
  await supertest(app)
    .post('/auth/login')
    .send({ email: 'dipri@email.com', password: '123456' })
    .then((res) => {
      playerToken = res.body.token;
    });
  return playerToken;
}
