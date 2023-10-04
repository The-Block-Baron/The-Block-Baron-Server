import express from 'express';

import { getState } from '../controllers/stateController/getStates.js';
import { getStates } from '../controllers/stateController/getStates.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/states', authMiddleware, getStates);
router.get('/states/:id', authMiddleware, getState);


export default router;
