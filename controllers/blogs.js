const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('users', { name: 1, username: 1 })
  response.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(body.userId)

  if (!body.userId) {
    response.status(400).json({ 'error:': 'UserId not provided' })
  } else if (user === null) {
    response.status(404).json({ 'error:': 'Provided user not found' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  console.log(blog)

  if (blog.title === undefined && blog.url == undefined) {
    response.status(400).json({ 'error:': 'Blog title and url not defined' })
  } else {
    try {
      const savedBlog = await blog.save()
      console.log(savedBlog)
      user.blogs = user.blogs.concat(savedBlog.id)
      await user.save()
      response.status(201).json(savedBlog.toJSON())
    } catch (exception) {
      next(exception)
    }
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter