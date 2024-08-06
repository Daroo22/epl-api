import express from 'express'

import { getAllPlayers } from '../utils/soccerAPIconnection.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const playerData = await getAllPlayers()

  res.render('players.ejs', {
    players: playerData.season_players
  })
})

router.post('/', (req, res) => {
  // MongoDB .create()
})

export default router