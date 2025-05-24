const express = require('express')
const router = express.Router()
const { getTeams, getPlayers } = require('../controllers/teamController')

router.route('/').get(getTeams)
router.route('/player').get(getPlayers)

module.exports = router