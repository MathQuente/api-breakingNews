import {
  createService,
  findAllService,
  countNews,
  topNewsService,
  findByIdService,
  searchByTitleService,
  byUserService,
  updateService,
  eraseService,
  likeNewsService,
  deleteLikeNewsService,
  addCommentService,
  deleteCommentService
} from '../services/news.service.js'

export const create = async (req, res) => {
  try {
    const { title, text, banner } = req.body

    if (!title || !banner || !text) {
      res.status(400).send({
        message: 'Submit all fields'
      })
    }

    await createService({
      title,
      text,
      banner,
      user: req.userId
    })

    res.send(201)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

export const findAll = async (req, res) => {
  try {
    let { limit, offset } = req.query

    limit = Number(limit)
    offset = Number(offset)

    if (!limit) {
      limit = 5
    }

    if (!offset) {
      offset = 0
    }

    const news = await findAllService(offset, limit)
    const total = await countNews()
    const currentUrl = req.baseUrl

    const next = offset + limit
    const nextUrl =
      next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null
    const previous = offset - limit < 0 ? null : offset - limit

    const previousUrl =
      previous != null
        ? `${currentUrl}?limit=${limit}&offset=${previous}`
        : null

    if (news.length === 0) {
      return res.status(400).send({ message: 'There no news' })
    }

    res.send({
      nextUrl,
      previousUrl,
      limit,
      offset,
      total,

      results: news.map(item => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        name: item.user.name,
        comments: item.comments,
        userName: item.user.username,
        userAvatar: item.user.avatar
      }))
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

export const topNews = async (req, res) => {
  try {
    const news = await topNewsService()

    if (!news) {
      return res.status(400).send({ message: 'There no exist news' })
    }

    res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        name: news.user.name,
        comments: news.comments,
        userName: news.user.username,
        userAvatar: news.user.avatarnews
      }
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

export const findById = async (req, res) => {
  try {
    const { id } = req.params

    const news = await findByIdService(id)

    return res.send({
      news: {
        id: news._id,
        title: news.title,
        text: news.text,
        banner: news.banner,
        likes: news.likes,
        name: news.user.name,
        comments: news.comments,
        userName: news.user.username,
        userAvatar: news.user.avatarnews
      }
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

export const searchByTitle = async (req, res) => {
  try {
    const { title } = req.query

    const news = await searchByTitleService(title)

    if (!news.length === 0) {
      return res
        .status(400)
        .send({ message: 'there are no news with this title' })
    }

    return res.send({
      results: news.map(item => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        name: item.user.name,
        comments: item.comments,
        userName: item.user.username,
        userAvatar: item.user.avatar
      }))
    })
  } catch (error) {
    res.status(500).send({
      message: error.message
    })
  }
}

export const byUser = async (req, res) => {
  try {
    const id = req.userId
    const news = await byUserService(id)

    return res.send({
      results: news.map(item => ({
        id: item._id,
        title: item.title,
        text: item.text,
        banner: item.banner,
        likes: item.likes,
        name: item.user.name,
        comments: item.comments,
        userName: item.user.username,
        userAvatar: item.user.avatar
      }))
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

export const update = async (req, res) => {
  try {
    const { title, text, banner } = req.body
    const { id } = req.params

    if (!title && !banner && !text) {
      return res.status(400).send({
        message: 'Submit at least one field to update the post'
      })
    }

    const news = await findByIdService(id)

    if (news.user._id.toString() != req.userId.toString()) {
      return res.status(400).send({
        message: "You didn't update this post"
      })
    }

    await updateService(id, title, text, banner)

    return res.send({
      message: 'Post sucessfully updated!'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error.message })
  }
}

export const erase = async (req, res) => {
  try {
    const { id } = req.params
    const news = await findByIdService(id)

    if (news.user._id.toString() != req.userId.toString()) {
      return res.status(400).send({
        message: "You didn't delete this post"
      })
    }

    await eraseService(id)

    return res.send({ message: 'Post deleted sucessfully!' })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}

export const likeNews = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const newsLiked = await likeNewsService(id, userId)

    if (!newsLiked) {
      await deleteLikeNewsService(id, userId)
      return res.status(200).send({
        message: 'like removed sucessfully'
      })
    }

    res.send({ message: 'Like done sucessfully' })
  } catch (error) {
    res.status(500).send({
      message: error.message
    })
  }
}

export const addComment = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    const {comment} = req.body

    if (!comment) {
      return res.status(400).send({
        message: 'Write a message to comment'
      })
    }

    await addCommentService(id, comment, userId)

    res.send({message: "Comment successfully completed!"})
  } catch (error) {
    res.status(500).send({message: error.message})
  }
}

export const deleteComment = async (req, res) =>{
  try {
    const { idNews, idComment } = req.params
    const userId = req.userId

    const commentDeleted = await deleteCommentService(idNews, idComment, userId)

    const commentFinder = commentDeleted.comments.find((comment) => comment.idComment === idComment)

    if(commentFinder.userId !== userId){
      return res.status(400).send({message: "You can't delete this comment"})
    }

    res.send({message: "Comment successfully removed!"})
  } catch (error) {
    res.status(500).send({message: error.message})
  }

}