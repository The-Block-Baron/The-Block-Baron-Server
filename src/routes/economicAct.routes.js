import express from 'express';
import { getEconomicActivitiesTypes, buildCompany, improveCompany, closeCompany } from '../controllers/economicAct.controller.js';

const router = express.Router();

// Ruta para obtener los tipos de actividades económicas y tipos de mejoras
router.get('/economicActivities', getEconomicActivitiesTypes);
router.post('/players/:id/economicActivity/build', buildCompany);
router.put('/players/:id/economicActivity/improve/:companyId', improveCompany);
router.delete('/players/:id/economicActivity/delete/:companyId', closeCompany);


// ... tus otras rutas

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