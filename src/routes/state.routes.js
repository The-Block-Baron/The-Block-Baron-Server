import express from 'express';
import { createState, getState, getStates } from '../controllers/state.controller.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { adminAuthMiddleware } from '../middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.post('/states', adminAuthMiddleware, createState);
router.get('/states', authMiddleware, getStates);
router.get('/states/:id', authMiddleware, getState);

// ... tus otras rutas

export default router;
