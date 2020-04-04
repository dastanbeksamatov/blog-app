const array = require('lodash')

const mostBlogs = (blogs) => {
  if(blogs.length === 0){
    return 0
  }
  else if(blogs.lenth === 1 || blogs.length === 2) {
    return blogs[1].author
  }
  const result = array.countBy(blogs, 'author')
  const values = array.values(result)
  const max = array.max(values)

  return array.findKey(result, value => value === max)
}

module.exports = mostBlogs