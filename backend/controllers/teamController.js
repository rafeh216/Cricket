const asyncHandler = require('express-async-handler')
const conn = require('../config/db')

const getTeams = asyncHandler(async (req, res) => {
    conn.query('SELECT * FROM TEAM', (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: "Problem getting Teams" })
        }

        res.status(200).json(results)
    })
})


const getPlayers = asyncHandler(async (req, res) => {
    conn.query('SELECT P.player_name, T.team_name, PS.t20_matches, PS.t20_runs, PS.t20_batting_avg, PS.t20_strike_rate, PS.t20_wickets, PS.t20_bowling_avg, PS.t20_economy, PS.odi_matches, PS.odi_runs, PS.odi_batting_avg, PS.odi_strike_rate, PS.odi_wickets, PS.odi_bowling_avg, PS.odi_economy, PS.test_matches, PS.test_runs, PS.test_batting_avg, PS.test_strike_rate, PS.test_wickets, PS.test_bowling_avg, PS.test_economy FROM PLAYER P JOIN TEAM T ON P.team_id = T.team_id JOIN player_stats PS ON P.player_id = PS.player_id;', (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: "Problem getting players" })
        }

        res.status(200).json(results)
    })
})

const getFab = asyncHandler(async (req, res) => {
    conn.query('SELECT player_name, TEST_RUNS, odi_runs, t20_runs, des FROM fabulous_four', (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: "Problem getting players" })
        }

        res.status(200).json(results)
    })
})
const getPRank = asyncHandler(async (req, res) => {
    const { format, category } = req.query;
    
    let query = '';
    
    // Determine which table to query based on format and category
    if (format === 'test') {
        if (category === 'batting') {
            query = 'SELECT ranking as pos, player_name, country as team, rating FROM TEST_BATTER_RANKINGS ORDER BY ranking LIMIT 5';
        } else if (category === 'bowling') {
            query = 'SELECT ranking as pos, player_name, country as team, rating FROM TEST_BOWLER_RANKINGS ORDER BY ranking LIMIT 5';
        } else if (category === 'all-rounder') {
            query = 'SELECT ranking as pos, player_name, country as team, rating FROM TEST_ALLROUNDER_RANKINGS ORDER BY ranking LIMIT 5';
        }
    } else if (format === 'odi') {
        if (category === 'batting') {
            query = 'SELECT ranking as pos, player_name, country as team, rating FROM ODI_BATTER_RANKINGS ORDER BY ranking LIMIT 5';
        } else if (category === 'bowling') {
            query = 'SELECT ranking as pos, player_name, country as team, rating FROM ODI_BOWLER_RANKINGS ORDER BY ranking LIMIT 5';
        } else if (category === 'all-rounder') {
            query = 'SELECT ranking as pos, player_name, country as team, rating FROM ODI_ALLROUNDER_RANKINGS ORDER BY ranking LIMIT 5';
        }
    } else if (format === 't20') {
        if (category === 'batting') {
            query = 'SELECT ranking as pos, player_name, country as team, rating FROM T20_BATTER_RANKINGS ORDER BY ranking LIMIT 5';
        } else if (category === 'bowling') {
            query = 'SELECT ranking as pos, player_name, country as team, rating FROM T20_BOWLER_RANKINGS ORDER BY ranking LIMIT 5';
        } else if (category === 'all-rounder') {
            query = 'SELECT ranking as pos, player_name, country as team, rating FROM T20_ALLROUNDER_RANKINGS ORDER BY ranking LIMIT 5';
        }
    }
    
    if (!query) {
        return res.status(400).json({ message: "Invalid format or category" });
    }
    
    conn.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Problem getting rankings" });
        }
        
        res.status(200).json(results);
    });
});

const getTRank = async (req, res) => {
  try {
    console.log('getTRank called with query:', req.query);
    const { format } = req.query;
    
    if (!format) {
      return res.status(400).json({ message: 'Format parameter is required' });
    }
    
    const validFormats = ['Test', 'ODI', 'T20I'];
    if (!validFormats.includes(format)) {
      return res.status(400).json({ message: 'Invalid format. Must be Test, ODI, or T20I' });
    }
    
    const query = `
      SELECT position, teamName, rating 
      FROM teamRank 
      WHERE format = ? 
      ORDER BY position ASC
    `;
    
    // If you're using a promisified version
    const results = await conn.promise().query(query, [format]);
    console.log(`Found ${results[0].length} results for ${format}`);
    
    res.status(200).json(results[0]);
    
  } catch (error) {
    console.error('Error in getTRank:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
// Get all fixtures
const getFixture = async (req, res) => {
  try {
    const query = `
      SELECT 
        fixture_id,
        home_team_name,
        away_team_name,
        venue,
        date,
        time,
        format,
        match_title
      FROM fixture 
      ORDER BY date ASC, time ASC
    `;
    
    const [fixtures] = await conn.promise().query(query);
    
    // Group fixtures by series/match_title
    const groupedFixtures = fixtures.reduce((acc, fixture) => {
      const seriesName = fixture.match_title;
      if (!acc[seriesName]) {
        acc[seriesName] = [];
      }
      acc[seriesName].push(fixture);
      return acc;
    }, {});
    
    res.status(200).json(groupedFixtures);
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    res.status(500).json({ message: 'Error fetching fixtures' });
  }
};
module.exports = {
    getTeams,
    getPlayers,
    getFab,
    getPRank,
    getTRank,
    getFixture
}