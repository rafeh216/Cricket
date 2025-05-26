const express = require('express')
const router = express.Router()
const { getTeams, getPlayers, getFab } = require('../controllers/teamController')

router.route('/').get(getTeams)
router.route('/player').get(getPlayers)
router.route('/fab4').get(getFab)

module.exports = router