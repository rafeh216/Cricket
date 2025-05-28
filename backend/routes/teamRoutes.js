const express = require('express')
const router = express.Router()
const { getTeams, getPlayers, getFab, getPRank, getTRank, getFixture } = require('../controllers/teamController')

router.route('/').get(getTeams)
router.route('/player').get(getPlayers)
router.route('/fab4').get(getFab)
router.route('/playerrank').get(getPRank)
router.route('/teamRank').get(getTRank)
router.route('/Fixture').get(getFixture)

module.exports = router