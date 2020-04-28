const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
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
    const token = req.token
    if(!token){
      return res.status(401).json( { error: 'token missing' })
    }
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
  const token = req.token
  if(!token){
    return res.status(401).json({
      error: 'missing token'
    })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!decodedToken.id){
    return res.status(401).json({
      error: 'invalid or missing token'
    })
  }
  const userIdReq = decodedToken.id
  const blog = await Blog.findById(id)
  const userId = blog.user.toString()

  if(userId !== userIdReq.toString()){
    return res.status(401).json({
      error: 'Not authorized to delete'
    })
  }
  const removedBlog = await blog.remove()
  res.status(201).json(removedBlog)
})

blogRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const newLikes = req.body.likes
  const token = req.token
  if(!token){
    return res.status(401).json({
      error: 'missing token'
    })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!decodedToken.id){
    return res.status(401).json({
      error: 'invalid or missing token'
    })
  }
  const userIdReq = decodedToken.id
  const blog = await Blog.findById(id)
  const userId = blog.user.toString()
  if(userId !== userIdReq.toString()){
    console.log(userId, userIdReq)
    return res.status(401).json({
      error: 'Not authorized to delete'
    })
  }
  const updatedBlog = await blog.updateOne({ likes: newLikes })
  res.status(201).json(updatedBlog.config.data)
})

module.exports = blogRouter