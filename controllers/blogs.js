const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  blog.likes = blog.likes || 0

  console.log(blog)

  if (blog.title === undefined && blog.url == undefined) {
    response.status(400).end()
  } else {
    try {
      const savedBlog = await blog.save()
      response.status(201).json(savedBlog.toJSON())
    } catch (exception) {
      next(exception)
    }
  }
})

module.exports = blogsRouter