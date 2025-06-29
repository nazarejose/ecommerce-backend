const bcrypt = require('bcrypt')
const { User } = require('../models') 
const jwt = require('jsonwebtoken')

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

  async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' })
      }

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas.' })
      }

      const payload = { id: user.id }
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET, 
        { expiresIn: '8h' }
      )

      return res.status(200).json({ token });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Falha ao fazer login.' });
    }
  }
}

module.exports = new UserController()