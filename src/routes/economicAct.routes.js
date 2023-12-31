import express from 'express';

import { getEconomicActivitiesTypes } from '../controllers/economicController/getEconomic.js';
import { buildCompany } from '../controllers/economicController/buildCompany.js';
import { buyCompany } from '../controllers/economicController/buyCompany.js';
import { improveCompany } from '../controllers/economicController/improveCompany.js';
import { closeCompany } from '../controllers/economicController/closeCompany.js';
import { protectCompany } from '../controllers/economicController/protectCompany.js';
import { sabotageCompany } from '../controllers/economicController/sabotageCompany.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/economic-activities', authMiddleware, getEconomicActivitiesTypes);
router.post('/players/:id/economic-activities/build', authMiddleware, buildCompany);
router.put('/players/:id/economic-activities/improve/:companyId', authMiddleware, improveCompany);
router.delete('/players/:id/economic-activities/delete/:companyId', authMiddleware, closeCompany);
router.post('/players/:id/economic-activities/buy-company/:companyId', authMiddleware, buyCompany);
router.put('/players/:id/economic-activities/protect-company/:companyId', authMiddleware, protectCompany);
router.post('/players/:id/economic-activities/sabotage-company/:companyId', authMiddleware, sabotageCompany);





export default router;

