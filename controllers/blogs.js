const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username:1, name: 1 })
  res.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', async (req, res) => {
  const body = req.body
  if(!body.url && !body.title) {
    res.status(400).end()
  }
  else{
    if(!body.likes){
      body.likes = 0
    }
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id){
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    res.status(201).json(savedBlog)
  }
})

blogRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  const removedBlog = await Blog.findByIdAndRemove(id)
  res.status(201).json(removedBlog)
})

blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const newLikes = req.body.likes
  const updatedBlog = await Blog.findByIdAndUpdate(id, { likes: newLikes }, { new :true })
  res.status(201).json(updatedBlog)
})

module.exports = blogRouter