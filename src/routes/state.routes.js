import express from 'express';
import { createState, getState, getStates } from '../controllers/state.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.post('/admin/states', adminAuthMiddleware, createState);
router.get('/admin/states', adminAuthMiddleware, getStates);
router.get('/admin/states/:id', adminAuthMiddleware, getState);

router.get('/states', authMiddleware, getStates);
router.get('/states/:id', authMiddleware, getState);

// ... tus otras rutas

export default router;
