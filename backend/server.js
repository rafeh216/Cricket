const express = require('express')
const cors = require('cors')
const { errorHandler } = require('./middleware/errorMiddleware')
const dotenv = require('dotenv').config()
const conn = require('./config/db')

const app = express()
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    credentials: true
}))

const PORT = process.env.PORT || 5000

app.use('/api/team', require('./routes/teamRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`App started on port: ${PORT}`))