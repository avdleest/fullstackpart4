const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

})

describe('blog retrieval correct and correctly formatted', () => {

  test('blogs are retured as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('the amount of blogs is the correct length', async () => {
    const data = await api.get('/api/blogs')
    expect(data.body.length).toBe(helper.initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const data = await api.get('/api/blogs')
    expect(data.body[0].id).toBeDefined()
  })
})

describe('posting a new blog', () => {
  test('a valid new blog can be added', async () => {
    newTitle = "Great ways for testing"
    const newBlog = new Blog({
      title: newTitle,
      author: "Unknown author",
      url: "http://www.letmegooglethatforyou.com"
    })

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    console.log(`blogs at end: ${blogsAtEnd.length}`)
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(blogs => blogs.title)
    expect(contents).toContain(newTitle)
  })
})


afterAll(() => {
  mongoose.disconnect()
  //mongoose.connection.close()
})