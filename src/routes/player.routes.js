import express from 'express'

import { getActivePlayers } from '../controllers/playerController/getPlayers.js';
import { getPlayer } from '../controllers/playerController/getPlayers.js';
import { updatePlayer } from '../controllers/playerController/updatePlayer.js';
import { deletePlayer } from '../controllers/playerController/deletePlayer.js';
import { getLeaderboard } from '../controllers/playerController/getLeaderboard.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router()

router.get('/players/leaderboard', authMiddleware, getLeaderboard)
router.get('/players/active', authMiddleware, getActivePlayers)
router.get('/players/:id', authMiddleware, getPlayer)
router.put('/players/:id', authMiddleware, updatePlayer)
router.delete('/players/:id', authMiddleware, deletePlayer)


export default router