require('dotenv/config')
const express = require('express')
const userRoutes = require('./routes/user.routes')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API E-commerce OK!' })
})

app.use('/v1/user', userRoutes)

module.exports = app