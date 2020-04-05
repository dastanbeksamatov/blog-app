const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', async (req, res) => {
  const body = req.body
  const blog = new Blog(body)

  if(!blog.url && !blog.title) {
    res.status(400).end()
  }
  else{
    if(!blog.likes){
      blog.likes = 0
    }
    const result = await blog.save()
    res.status(201).json(result)
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
  req.status(201).json(updatedBlog)
})

module.exports = blogRouter