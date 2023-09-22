import express from 'express';

import { getEconomicActivitiesTypes } from '../controllers/economicController/getEconomic.js';
import { buildCompany } from '../controllers/economicController/buildCompany.js';
import { buyCompany } from '../controllers/economicController/buyCompany.js';
import { improveCompany } from '../controllers/economicController/improveCompany.js';
import { closeCompany } from '../controllers/economicController/closeCompany.js';
import { protectCompany } from '../controllers/economicController/protectCompany.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.get('/admin/economic-activities', adminAuthMiddleware, getEconomicActivitiesTypes);
router.post('/admin/players/:id/economic-activities/build', adminAuthMiddleware, buildCompany);
router.put('/admin/players/:id/economic-activities/improve/:companyId', adminAuthMiddleware, improveCompany);
router.delete('/admin/players/:id/economic-activities/delete/:companyId', adminAuthMiddleware, closeCompany);
router.post('/admin/players/:id/economic-activities/buy-company/:companyId', adminAuthMiddleware, buyCompany);
router.put('/admin/players/:id/economic-activities/protect-company/:companyId', adminAuthMiddleware, protectCompany);

router.get('/economic-activities', authMiddleware, getEconomicActivitiesTypes);
router.post('/players/:id/economic-activities/build', authMiddleware, buildCompany);
router.put('/players/:id/economic-activities/improve/:companyId', authMiddleware, improveCompany);
router.delete('/players/:id/economic-activities/delete/:companyId', authMiddleware, closeCompany);
router.post('/players/:id/economic-activities/buy-company/:companyId', authMiddleware, buyCompany);
router.put('/players/:id/economic-activities/protect-company/:companyId', adminAuthMiddleware, protectCompany);





export default router;

