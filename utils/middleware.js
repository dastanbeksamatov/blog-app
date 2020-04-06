const logger = require('./logger')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if(error.name === 'CastError' || error.name === 'ObjectId'){
    return res.status(400).send({ error: 'malformatted if' })
  }
  else if(error.name === 'ValidationError'){
    return res.status(400).json({ error:error.message })
  }
  else if(error.name === 'JsonWebTokenError'){
    return res.status(401).json({
      error: 'invalid token'
    })
  }
  logger.error(error.message)
  next(error)
}

module.exports = {
  unknownEndpoint, errorHandler
}