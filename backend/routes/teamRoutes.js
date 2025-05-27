const express = require('express')
const router = express.Router()
const { getTeams, getPlayers, getFab, getPRank, getTRank } = require('../controllers/teamController')

router.route('/').get(getTeams)
router.route('/player').get(getPlayers)
router.route('/fab4').get(getFab)
router.route('/playerrank').get(getPRank)
router.route('/teamRank').get(getTRank)

module.exports = router