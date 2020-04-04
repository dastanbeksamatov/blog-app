const mostBlogs = require('../utils/mostBlogs')

const nBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7, __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Edsger W. Dijkstra',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  },
  {
    _id: '13132dsfafs123fsdasfdadfa',
    title: 'React',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  },
  {
    _id: '13132asdsfafs123fsdasfdadfa',
    title: 'Lool',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]


/* const blogs = [
  {
    _id: '132asdad123dsdfagjfkdj131',
    title: 'React fullstack',
    author: 'Dastan Samatov',
    url: 'https://www.example.com/attraction',
    likes: 123,
    __v: 0
  },
  {
    _id: 'dadsadsafadsf123123131313',
    title: 'random',
    author: 'random dude',
    url: 'https://example.com/random',
    likes: 12,
    __v: 1
  },
  {
    _id: 'e123131d1312dsad2e13e112e1',
    title: 'cools',
    author: 'random dude',
    url: 'https://new.com/new',
    likes: 1,
    __v: 0
  }
]
*/
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
const emptyBlog = []

describe('Most blogs', () => {
  test('Empty list returns 0', () => {
    const result = mostBlogs(emptyBlog)
    expect(result).toBe(0)
  })
  test('List with one blogs return first entry ', () => {
    const result = mostBlogs(listWithOneBlog)
    expect(result).toBe(listWithOneBlog[0].author)
  })
  test('List with n blogs returns author with most blogs', () => {
    const result = mostBlogs(nBlogs)
    expect(result).toEqual('Robert C. Martin')
  })
})