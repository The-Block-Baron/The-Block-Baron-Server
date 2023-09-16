import express from 'express'

import { toggleAllPlayersStatus, getActivePlayers, updatePlayer, deletePlayer, getPlayer } from '../controllers/player.controller.js'
import adminAuthMiddleware from '../middlewares/adminAuthMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router()

router.put('/players/toggleAll', adminAuthMiddleware, toggleAllPlayersStatus);
router.get('/admin/players/active', adminAuthMiddleware, getActivePlayers)
router.get('/admin/players/:id', adminAuthMiddleware, getPlayer)
router.put('/admin/players/:id', adminAuthMiddleware, updatePlayer)
router.delete('/admin/players/:id', adminAuthMiddleware, deletePlayer)

router.get('/players/active', authMiddleware, getActivePlayers)
router.get('/players/:id', authMiddleware, getPlayer)
router.put('/players/:id', authMiddleware, updatePlayer)
router.delete('/players/:id', authMiddleware, deletePlayer)

export default router