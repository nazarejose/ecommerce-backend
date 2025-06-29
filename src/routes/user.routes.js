const { Router } = require('express')
const UserController = require('../controllers/user.controller')

const router = new Router()

router.post('/', UserController.create)

router.post('/token', UserController.login)

module.exports = router