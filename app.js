const http = require('http')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const config = require('./utils/config')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true })

app.use(cors())
app.use(bodyParser.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app