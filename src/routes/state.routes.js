import express from 'express';
import { createState } from '../controllers/state.controller.js';

const router = express.Router();

router.post('/states', createState);

// ... tus otras rutas

export default router;
