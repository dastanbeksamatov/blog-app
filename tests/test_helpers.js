const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    username: 'root',
    name: 'John',
    password: 'Roboto'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, initialUsers, usersInDb
}