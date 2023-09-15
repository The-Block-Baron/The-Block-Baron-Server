import supertest from 'supertest';
import chai from 'chai';
import dotenv from 'dotenv'

import app from '../server.js';
import { getAdminToken, getPlayerToken } from './testUtils.mjs';
import Player from '../src/models/player.model.js';
import Admin from '../src/models/admin.model.js';
import State from '../src/models/state.model.js';

const { expect } = chai;

dotenv.config()

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


      describe('POST /players/:id/economicActivity/build', () => {

        let player;
        let anotherPlayer;
        let admin;
        let state;

        before(async () => {
            try {
              player = await Player.findOne({email: "dipri@email.com"});
              anotherPlayer = await Player.findOne({email: "psylow@email.com"});
              admin = await Admin.findOne({email: process.env.ADMIN1_EMAIL});
              state = await State.findById("65044b18b6c77c8a8fd806f0");

              console.log('Player:', player);
              console.log('Another player:', anotherPlayer);
              console.log('Admin:', admin);
              console.log('State:', state);

              if (!state) {
                throw new Error('State not found');
              }
          
              if(!player) {
                throw new Error('Player not found')
              }
              if(!anotherPlayer) {
                throw new Error('AnotherPlayer not found')
              }
              if(!admin) {
                throw new Error('Admin not found')
              }
            } catch (error) {
              console.error('Setup failed', error);
            }
          });
          
          it('should not allow a player to build a company for another player', (done) => {
            supertest(app)
              .post(`/api/v1/players/${anotherPlayer._id}/economicActivity/build`)
              .set('Authorization', `Bearer ${playerToken}`)
              .send({
                companyType: 'Travel', 
                fictionalName: 'Test Company',
                stateId: state._id,
              })
              .end((err, res) => {
                if (err) return done(err);
                expect(res.status).to.equal(403);
                expect(res.body.error).to.equal('Unauthorized to build a company for this player');
                done();
              });
          });
        
          it('should not allow a player to build a company with insufficient funds', (done) => {
            supertest(app)
              .post(`/api/v1/players/${player._id}/economicActivity/build`)
              .set('Authorization', `Bearer ${playerToken}`)
              .send({
                companyType: 'Adventure Park',  
                fictionalName: 'Test Company',
                stateId: state._id,
              })
              .end((err, res) => {
                if (err) return done(err);
                expect(res.status).to.equal(400);
                expect(res.body.error).to.equal('Tokens insuficientes para construir esta empresa');
                done();
              });
          });
        
          it('should not allow a player to build a non-registered company in a state', (done) => {
            supertest(app)
              .post(`/api/v1/players/${player._id}/economicActivity/build`)
              .set('Authorization', `Bearer ${playerToken}`)
              .send({
                companyType: 'Adventure Parke',  
                fictionalName: 'Test Company',
                stateId: state._id,
              })
              .end((err, res) => {
                if (err) return done(err);
                expect(res.status).to.equal(400);
                expect(res.body.error).to.equal('Tipo de empresa no válido');
                done();
              });
          });

          it('should allow a player to create a company with sufficient funds', (done) => {
            supertest(app)
                .post(`/api/v1/players/${player._id}/economicActivity/build`)
                .set('Authorization', `Bearer ${playerToken}`)
                .send({ companyType: 'Travel', fictionalName: 'Test Company', stateId: state._id })
                .end(async (err, res) => {
                    try {
                        console.log(res.body);
                        if (err) return done(err);        
                       
                        expect(res.status).to.equal(201);
    
                        const updatedPlayer = await Player.findById(player._id);
        
                        const companyDetails = state.availableCompanies.find(company => company.type === 'Travel');
                        expect(updatedPlayer.inGameTokens).to.equal(player.inGameTokens - companyDetails.buildCost);
                        expect(updatedPlayer.income).to.be.above(200);
                        
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });

        it('should allow an admin to create a company for a player without deducting player’s tokens, but update income', (done) => {
            supertest(app)
              .post(`/api/v1/players/${player._id}/economicActivity/build`)
              .set('Authorization', `Bearer ${adminToken}`) // using admin token here
              .send({ companyType: 'Travel', fictionalName: 'Test Company', stateId: state._id })
              .end(async (err, res) => {
                if (err) return done(err);
            
                const updatedPlayer = await Player.findById(player._id);
              
                expect(res.status).to.equal(201); 
                expect(updatedPlayer.inGameTokens).to.equal(150);
                expect(updatedPlayer.income).to.be.above(200);
                done();
              });
          });
        


          
          

      })
    
  });