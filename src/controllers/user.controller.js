import userService from "../services/user.service.js"

export const create = async (req, res) => {
  try{const { name, userName, email, password, avatar, background } = req.body

  if (!name || !userName || !email || !password || !avatar || !background) {
    res.status(400).send({ message: 'submit all fields for registration' })
  }

  const user = await createService(req.body)

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
  })} catch(error){
    res.status(500).send({message: error.message})
  }
}

export const findAll = async (req, res) => {
  try{const users = await userService.findAllService()

  if (users.length === 0) {
    return res.status(400).send({ message: 'There no registered users' })
  }

  res.send(users)} catch(error){
    res.status(500).send({message: error.message})
  }
}

export const findById = async (req, res) => {

  try{  const user = req.user

    res.send(user)} catch(error){
      res.status(500).send({message: error.message})
    }
}

export const update = async (req, res) => {
  try{const { name, userName, email, password, avatar, background } = req.body

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

  res.send({message : 'User successfully updated!'})} 
  catch(error){
    res.status(500).send({message: error.message})
  }
}

