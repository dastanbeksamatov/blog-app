const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React fullstack',
    author: 'Dastan Samatov',
    url: 'https://www.example.com/attraction',
    likes: 123,
    user: '5e8a7e04727dc21d80c63bd4'
  },
  {
    title: 'random',
    author: 'random dude',
    url: 'https://example.com/random',
    likes: 12,
    user: '5e8a7e04727dc21d80c63bd4'
  },
  {
    title: 'cools',
    author: 'random dude',
    url: 'https://new.com/new',
    likes: 1,
    user: '5e8a7e04727dc21d80c63bd4'
  }
]

const initialUsers = [
  {
    username: 'root',
    name: 'Liza',
    password: 'Roboto'
  },
  {
    username: 'admin',
    name: 'Das',
    password: 'Messi'
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