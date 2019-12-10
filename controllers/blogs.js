const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

let getUserCreds = async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  return user
}

// TODO: test all endpoints with new getUserCreds

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const user = await getUserCreds(request, response)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id,
    })

    if (blog.title === undefined && blog.url == undefined) {
      response.status(400).json({ 'error:': 'Blog title and url not defined' })
    } else {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog)
      await user.save()
      response.status(201).json(savedBlog.toJSON())
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = await getUserCreds(request, response)
    const blog = await Blog.findById(request.params.id)

    if (!blog) response.status(404).json({ error: `No blog found with id ${request.params.id}` })
    if (!blog.user) {
      blog.remove()
      response.status(204).end()
    } else if (blog.user.toString() === user.id.toString()) {
      blog.remove()
      response.status(204).end()
    } else {
      response.status(403).json({ error: 'user not allowed to remove other than own blogs' })
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id/comments', async (request, response, next) => {
  console.log('request body: ', request.body)
  const comment = request.body.comment

  try {
    const existingBlog = await Blog.findById(request.params.id)

    if (!existingBlog) response.status(404).json({ error: `No blog found with id ${request.params.id}` })

    const comments = existingBlog.comments.concat(comment) || comment

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { comments: comments }, { new: true })
    console.log(`blog is updated: ${updatedBlog}`)
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  try {
    const existingBlog = await Blog.findById(request.params.id)

    if (!existingBlog) response.status(404).json({ error: `No blog found with id ${request.params.id}` })

    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      comments: body.comments || []
    }

    if (body.user) {
      newBlog.user = body.user
      user = await User.findById(body.user)
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    updatedBlog.user = user
    console.log(`blog is updated: ${updatedBlog}`)
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})


module.exports = blogsRouter