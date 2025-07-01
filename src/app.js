require('dotenv/config')
const express = require('express')
const userRoutes = require('./routes/user.routes')
const categoryRoutes = require('./routes/category.routes')
const productRoutes = require('./routes/product.routes');

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API E-commerce OK!' })
})

app.use('/v1/user', userRoutes)

app.use('/v1/category', categoryRoutes)

app.use('/v1/product', productRoutes);

module.exports = app