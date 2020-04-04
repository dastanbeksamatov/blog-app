const array = require('lodash')

const mostBlogs = (blogs) => {
  if(blogs.length === 0){
    return 0
  }
  else if(blogs.lenth === 1) {
    return {
      author: blogs[1].author,
      posts: 1
    }
  }
  const result = array.countBy(blogs, 'author')
  const values = array.values(result)
  const max = array.max(values)

  return {
    author: array.findKey(result, value => value === max),
    posts: max
  }
}

module.exports = mostBlogs