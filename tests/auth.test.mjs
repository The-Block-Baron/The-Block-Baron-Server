import supertest from 'supertest';
import chai from 'chai';
import app from '../server.js';

const { expect } = chai;

let adminToken;
let playerToken;



describe('Auth tests', () => {


  it('should login admin user', (done) => {
    supertest(app)
      .post('/auth/admin/login') 
      .send({
        email: 'the_block_baron1@proton.me',
        password: 'syxiPCgN7M2JgvQXZeNsFtp7F96E',
      })
      .end((err, res) => {
        if (err) {
          console.error(err);
          return done(err);
        }
        expect(res.status).to.equal(200);
        adminToken = res.body.token; 
        done();
      })
    })


  it('should login player user', (done) => {
    supertest(app)
      .post('/auth/login') // Adjusted to the correct route
      .send({
        email: 'dipri@email.com',
        password: '123456',
      })
      .end((err, res) => {
        if (err) return done(err);

        expect(res.status).to.equal(200);
        playerToken = res.body.token; // adjust to match the property where your token is sent
        done();
      });
  });

  // Additional tests for middleware functionality
  describe('Middleware tests', () => {
    it('should validate admin token', (done) => {
      supertest(app)
        .put('/api/v1//players/toggleAll') // replace with an actual admin route
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should validate player token', (done) => {
      supertest(app)
        .get('/api/v1/economicActivities') // replace with an actual player route
        .set('Authorization', `Bearer ${playerToken}`)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});

