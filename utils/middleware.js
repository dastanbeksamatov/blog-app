const logger = require('../utils/logger')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {

  if(error.name === 'CastError' || error.name === 'ObjectId'){
    return res.status(400).send({ error: 'malformatted if' })
  }
  else if(error.name === 'ValidationError'){
    return res.status(400).send({ error: error.message })
  }
  else if(error.name === 'JsonWebTokenError'){
    return res.status(401).send({
      error: 'invalid token'
    })
  }
  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  logger.info(authorization)
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    logger.info(authorization.substring(7))
    req.token = authorization.substring(7)
  }
  else(
    req.token = null
  )
  next()
}

module.exports = {
  unknownEndpoint, errorHandler, tokenExtractor
}