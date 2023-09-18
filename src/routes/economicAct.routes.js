import express from 'express';
import { getEconomicActivitiesTypes, buildCompany, improveCompany, closeCompany, buyCompany } from '../controllers/economicAct.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.get('/admin/economic-activities', adminAuthMiddleware, getEconomicActivitiesTypes);
router.post('/admin/players/:id/economic-activities/build', adminAuthMiddleware, buildCompany);
router.put('/admin/players/:id/economic-activities/improve/:companyId', adminAuthMiddleware, improveCompany);
router.delete('/admin/players/:id/economic-activities/delete/:companyId', adminAuthMiddleware, closeCompany);
router.post('/admin/players/:id/economic-activities/buy-company/:companyId', adminAuthMiddleware, buyCompany);

router.get('/economic-activities', authMiddleware, getEconomicActivitiesTypes);
router.post('/players/:id/economic-activities/build', authMiddleware, buildCompany);
router.put('/players/:id/economic-activities/improve/:companyId', authMiddleware, improveCompany);
router.delete('/players/:id/economic-activities/delete/:companyId', authMiddleware, closeCompany);
router.post('/players/:id/economic-activities/buy-company/:companyId', authMiddleware, buyCompany);





export default router;





// Ruta: GET /players/:id/economicActivity/companies
// Controlador: getAllCompanies
// Parámetros: playerId
// Ver Detalles de una Compañía Específica

// Ruta: GET /players/:id/economicActivity/companies/:companyId
// Controlador: getCompanyDetails
// Parámetros: playerId, companyId
// Realizar un Trato con una Compañía Propia (Deal)

// Ruta: POST /players/:id/economicActivity/company/:companyId/deal
// Controlador: makeDealWithPresident
// Parámetros: playerId, companyId
// Sabotaje a una Compañía de un Jugador Enemigo

// Ruta: POST /players/:id/economicActivity/companies/:companyId/sabotage
// Controlador: sabotageEnemyCompany
// Parámetros: playerId, enemyPlayerId, companyId
// Consideraciones:
// Deals: Podrías tener un modelo de "Deal" que se crea cuando el jugador propone el trato al presidente. El modelo podría tener estados como "propuesto", "aceptado" y "rechazado".

// Sabotajes: Similar a los "Deals", podrías tener un modelo de "Sabotage" que se crea cuando el jugador propone el sabotaje. También podría tener varios estados para rastrear su progreso.

// Validaciones y Autorización: Al igual que antes, asegúrate de validar los IDs y de que solo los jugadores autorizados puedan realizar ciertas acciones.

// Randomización: Podrías usar un número aleatorio para determinar si el "Deal" o el "Sabotaje" es exitoso o no, afectando así a la empresa correspondiente de manera positiva o negativa.