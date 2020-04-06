const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
//const jwt = require('jsonwebtoken')

usersRouter.post('/', async (req, res) => {
  const body = req.body
  if(!body.password){
    return res.status(400).json({
      error: 'Password can not be empty'
    })
  }
  else if(!body.username){
    return res.status(400).json({
      error: 'username can not be empty'
    }
    )
  }
  else if(body.password.length < 4){
    return res.status(400).json({
      error: 'Password has to be at least 4 characters long'
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })
  const savedUser = await user.save()
  res.json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs')
  res.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter