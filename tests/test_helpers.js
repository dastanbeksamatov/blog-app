const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React fullstack',
    author: 'Dastan Samatov',
    url: 'https://www.example.com/attraction',
    likes: 123
  },
  {
    title: 'random',
    author: 'random dude',
    url: 'https://example.com/random',
    likes: 12
  },
  {
    title: 'cools',
    author: 'random dude',
    url: 'https://new.com/new',
    likes: 1
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}