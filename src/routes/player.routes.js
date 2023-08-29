import express from 'express'

import { toggleAllPlayersStatus, getActivePlayers, createPlayer, updatePlayer, deletePlayer, getPlayer } from '../controllers/player.controller.js'

const router = express.Router()

router.put('/players/toggleAll', toggleAllPlayersStatus)
router.get('/players/active', getActivePlayers)
router.get('/players/:id', getPlayer)
router.put('/players/:id', updatePlayer)
router.post('/players', createPlayer)
router.delete('/players/:id', deletePlayer)

export default router