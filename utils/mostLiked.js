const _ = require('lodash')
const mostLiked = (blogs) => {
  if(blogs.length === 0){
    return 0
  }
  else if(blogs.lenth === 1) {
    // eslint-disable-next-line no-unused-vars
    const { _id, author, url, __v, ...post } = blogs[0]
    return post
  }
  const result = _.groupBy(blogs, 'author')
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  const sorted = _.mapValues(result, values => {
    return values.reduce(reducer, 0)
  })
  const value = _.max(_.values(sorted))
  const author = _.findKey(sorted, val => value === val)
  // eslint-disable-next-line no-unused-vars
  return { [author]:value }
}

module.exports = mostLiked