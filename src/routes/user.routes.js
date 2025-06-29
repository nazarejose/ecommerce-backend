const { Router } = require('express')
const UserController = require('../controllers/user.controller')

const router = new Router()

router.post('/', UserController.create)

module.exports = router