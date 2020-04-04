const dummy = (blogs) => {
  return blogs ? 1:1
}


const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0){
    return {}
  }
  const reducer = (max, item) => {
    return max>item.likes ? max: item.likes
  }
  const max = blogs.reduce(reducer, blogs[0].likes)
  const filtered = blogs.filter(blog => blog.likes === max)
  // eslint-disable-next-line no-unused-vars
  const { _id, __v, url, ...blog } = filtered[0]
  return blog
}


module.exports = {
  dummy, totalLikes, favoriteBlog
}