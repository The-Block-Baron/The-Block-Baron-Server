import express from 'express';
import { createState, getState, getStates } from '../controllers/state.controller.js';

const router = express.Router();

router.post('/states', createState);
router.get('/states', getStates);
router.get('/states/:id', getState);

// ... tus otras rutas

export default router;
