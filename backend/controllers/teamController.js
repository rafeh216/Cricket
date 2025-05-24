const asyncHandler = require('express-async-handler')
const conn = require('../config/db')

const getTeams = asyncHandler(async (req, res) => {
    conn.query('SELECT * FROM TEAM', (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: "Problem getting players" })
        }

        res.status(200).json(results)
    })
})


const getPlayers = asyncHandler(async (req, res) => {
    conn.query("SELECT P.*, T.team_name FROM PLAYER P JOIN TEAM T ON P.team_id = T.team_id WHERE t.team_name = 'India' LIMIT 5", (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: "Problem getting players" })
        }

        res.status(200).json(results)
    })
})



module.exports = {
    getTeams,
    getPlayers
}