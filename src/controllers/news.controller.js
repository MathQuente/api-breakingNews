import { createService, findAllService } from '../services/news.service.js'

const create = async(req, res) => {
  try {
    const { title, text, banner } = req.body

    if(!title || !banner || !text){
      res.status(400).send({
        message: 'Submit all fields'
      })
    }

    await createService({
      title,
      text,
      banner,
      id: 'objectidfake1'
    })

    res.send(201)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
const findAll = (req, res) => {
  const news = []

  res.send({ news })
}

export default {
  create,
  findAll
}
