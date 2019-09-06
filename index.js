const http = require('http')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')

const mongoUrl = 'mongodb+srv://fullstack:fshizzle@cluster0-ip5pk.mongodb.net/blog-app?retryWrites=true&w=majority'
mongoose.connect(mongoUrl, { useNewUrlParser: true })

app.use(cors())
app.use(bodyParser.json())

app.use('/api/blogs', blogsRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})