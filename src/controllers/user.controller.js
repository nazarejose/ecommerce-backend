const bcrypt = require('bcrypt')
const { User } = require('../models') 

class UserController {
  async create(req, res) {
    try {
      const { firstname, surname, email, password, confirmPassword } = req.body

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'As senhas não conferem.' })
      }

      const userExists = await User.findOne({ where: { email } })
      if (userExists) {
        return res.status(400).json({ error: 'Este e-mail já está em uso.' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await User.create({
        firstname,
        surname,
        email,
        password: hashedPassword,
      })

      newUser.password = undefined
      return res.status(201).json(newUser)

    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Falha ao criar usuário.' })
    }
  }
}

module.exports = new UserController()