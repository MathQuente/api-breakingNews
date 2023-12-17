const userService = require('../services/user.service')


const create = async (req, res) => {
  const { name, userName, email, password, avatar, background } = req.body

  if (!name || !userName || !email || !password || !avatar || !background) {
    res.status(400).send({ message: 'submit all fields for registration' })
  }

  const user = await userService.createService(req.body)

  if (!user) {
    return res.status(400).send({ message: 'error creating user' })
  }

  res.status(201).send({
    message: 'user create sucessfully',
    user: {
      id: user._id,
      name,
      userName,
      email,
      avatar,
      background
    }
  })
}

const findAll = async (req, res) => {
  const users = await userService.findAllService()

  if (users.length === 0) {
    return res.status(400).send({ message: 'There no registered users' })
  }

  res.send(users)
}

const findById = async (req, res) => {

  const user = req.user

  res.send(user)
}

const update = async (req, res) => {
  const { name, userName, email, password, avatar, background } = req.body

  if (!name && !userName && !email && !password && !avatar && !background) {
    res.status(400).send({ message: 'submit at least one field for update' })
  }

  const {id, user} = req

  await userService.updateService(
    id,
    name,
    userName,
    email,
    password,
    avatar,
    background
  )

  res.send({message : 'User successfully updated!'})
}

module.exports = { create, findAll, findById, update }
