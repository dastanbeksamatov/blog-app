const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helpers')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('rootP', 10)
  const userObj = new User({ username: 'roor', passwordHash })
  await userObj.save()
})

describe('Adding users', () => {
  test('creating new user updates db', async () => {
    const user = {
      username: 'test',
      name: 'Kevin',
      password: 'passwrd'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(200)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)
    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(user.username)
  })
  test('creating user with password less than 4 chars', async () => {
    const user = {
      username: 'test',
      name: 'none',
      password:'at'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(400)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })
  test('creating user without username and password', async () => {
    const user = {
      name: 'kool',
      password: 'goodn'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(400)
  })
  test('creating user without password', async () => {
    const user = {
      username: 'goodwill',
      name: 'good'
    }
    await api
      .post('/api/users')
      .send(user)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})