const mongoose = require('mongoose')
const supertest = require('supertest')
require('express-async-errors')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const helper = require('./test_helpers')
const Blog = require('../models/blog')
const User = require('../models/user')


beforeEach(async () => {
  await User.deleteMany({})
  for (let user of helper.initialUsers){
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(user.password, saltRounds)
    const newUser = {
      username: user.username,
      name: user.name,
      passwordHash
    }
    let userObj = new User(newUser)
    await userObj.save()
  }
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs){
    let users = await helper.usersInDb()
    const userId = users[0].id
    blog.user = userId
    let blogObj = new Blog(blog)
    await blogObj.save()
  }
})

const getToken = async () => {
  const users = helper.initialUsers
  const root = users[0]
  const res = await api
    .post('/api/login')
    .send(root)
    .expect(200)
  const token = 'bearer ' + res.body.token
  return token
}


describe('When there is initially saved blogs ', () => {
  describe('blogs can be viewed', () => {
    test('It returns blogs in JSON', async () => {
      await api
        .get('/api/blogs')
        .expect('Content-Type', /application\/json/)
    })
    test('The amount of blogs in the db ', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
  })
  describe('checks if the id property is defined', () => {
    test('Unique identifier is defined ', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[1].id).toBeDefined()
    })
  })
  describe('adding a blog in the db', () => {
    test('New blog can be added ', async () => {
      const newBlog = {
        title: 'Authorization',
        author: 'Dastan Samatov',
        url: 'https://dastan.sh/blog/why_testing',
        likes: 11
      }
      const token = await getToken()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('authorization', token)
        .expect(204)
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).toContain(newBlog.title)
    })
    test('If object has no property [likes], init and default it to 0 ', async () => {
      const newBlog = {
        title: 'Why should we learn React',
        author: 'Dastan Samatov',
        url: 'https://dastan.sh/blog/why_React',
      }

      const token = await getToken()

      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const savedBlog = blogsAtEnd[helper.initialBlogs.length]
      expect(savedBlog.likes).toBeDefined()
      expect(savedBlog.likes).toBe(0)
    })

    test('if url and title props are missing, expect bad request', async () => {
      const testBlog1 = {
        author: 'Dastan Samatov',
        likes: 12
      }
      const testBlog2 = {
        title: 'How Jest works',
        author: 'John Smith',
        likes:11
      }
      const token = await getToken()
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(testBlog1)
        .expect(400)
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(testBlog2)
        .expect(204)
    })
  })
  describe('blog can be deleted', () => {
    test('Blog will be deleted if authenticated ', async () => {
      //first we need to log in a user to generate token
      const token = await getToken()

      const blogsAtStart = await helper.blogsInDb()
      const id = blogsAtStart[0].id
      const title = blogsAtStart[0].title
      await api.delete(`/api/blogs/${id}`).set('Authorization', token).expect(201)
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtStart).toHaveLength(blogsAtEnd.length + 1)
      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).not.toContain(title)
    })
    test('Blog can not be deleted by not authorized user or if token is missing ', async () => {
      const users = helper.initialUsers
      const admin = users[1]
      const res = await api
        .post('/api/login')
        .send(admin)
        .expect(200)
      const token = 'bearer ' + res.body.token

      const blogsAtStart = await helper.blogsInDb()
      const id = blogsAtStart[0].id

      await api.delete(`/api/blogs/${id}`).set('Authorization', token).expect(401)

    })
  })
  describe('updating the blog', () => {
    test('Likes property of the blog is updated to new one', async () => {
      const newBlog = {
        title: 'random',
        author: 'random dude',
        url: 'https://example.com/random',
        likes: 1
      }
      const blogs = await helper.blogsInDb()
      const id = blogs[1].id
      await api.put(`/api/blogs/${id}`).send(newBlog).expect(201)
      const blogsEnd = await helper.blogsInDb()
      const updatedBlog = blogsEnd[1]
      expect(updatedBlog.likes).toBe(newBlog.likes)
    })
  })
})
afterAll(() => {
  mongoose.connection.close()
})
