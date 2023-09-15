import supertest from 'supertest';
import chai from 'chai';

import app from '../server.js';
import { getAdminToken, getPlayerToken } from './testUtils.mjs';

const { expect } = chai;

let adminToken;
let playerToken;


describe('Economic tests', () => {
    before(async () => {
        adminToken = await getAdminToken();
        playerToken = await getPlayerToken();
        console.log("Admin Token:", adminToken);
        console.log("Player Token:", playerToken);
      });
      

    describe('GET /economicActivities', () => {
        it('should get economic activities types as admin', (done) => {
          supertest(app)
            .get('/api/v1/economicActivities')
            .set('Authorization', `Bearer ${adminToken}`)
            .end((err, res) => {
              if (err) return done(err);
    
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('activityTypes');
              expect(res.body.activityTypes).to.be.an('array');
              done();
            });
        });
    
        it('should get economic activities types as player', (done) => {
          supertest(app)
            .get('/api/v1/economicActivities')
            .set('Authorization', `Bearer ${playerToken}`)
            .end((err, res) => {
              if (err) return done(err);
    
              expect(res.status).to.equal(200);
              expect(res.body).to.have.property('activityTypes');
              expect(res.body.activityTypes).to.be.an('array');
              done();
            });
        });
      });
    
  });