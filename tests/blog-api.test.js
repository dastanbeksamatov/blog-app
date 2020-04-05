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

test('It returns blogs in JSON', async () => {
  await api
    .get('/api/blogs')
    .expect('Content-Type', /application\/json/)
})
test('The amount of blogs in the db ', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('Unique identifier is defined ', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[1].id).toBeDefined()
})

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

afterAll(() => {
  mongoose.connection.close()
})
