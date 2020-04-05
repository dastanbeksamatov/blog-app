const mongoose = require('mongoose')
const supertest = require('supertest')
require('express-async-errors')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helpers')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs){
    let blogObj = new Blog(blog)
    await blogObj.save()
  }
})
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
        title: 'Why should we do testing',
        author: 'Dastan Samatov',
        url: 'https://dastan.sh/blog/why_testing',
        likes: 10
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).toContain('Why should we do testing')
    })

    test('If object has no property [likes], init and default it to 0 ', async () => {
      const newBlog = {
        title: 'Why should we learn React',
        author: 'Dastan Samatov',
        url: 'https://dastan.sh/blog/why_React',
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
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
      await api
        .post('/api/blogs')
        .send(testBlog1)
        .expect(400)
      await api
        .post('/api/blogs')
        .send(testBlog2)
        .expect(201)
    })
  })
  describe('blog can be deleted', () => {
    test('Blog will be deleted if id matches', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const id = blogsAtStart[0].id
      const title = blogsAtStart[0].title
      await api.delete(`/api/blogs/${id}`)
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtStart).toHaveLength(blogsAtEnd.length + 1)
      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).not.toContain(title)
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
      await api.put(`/api/blogs/${id}`).send(newBlog)
      const blogsEnd = await helper.blogsInDb()
      const updatedBlog = blogsEnd[1]
      expect(updatedBlog.likes).toBe(newBlog.likes)
    })
  })
})
afterAll(() => {
  mongoose.connection.close()
})
