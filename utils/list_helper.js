const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else {
    let likes = 0
    blogs.forEach(element => {
      likes += element.likes
    })
    return likes
  }
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  } else {
    let mostLikes = 0
    let bestBlog = {}
    blogs.forEach(element => {
      if (element.likes >= mostLikes) {
        mostLikes = element.likes
        bestBlog = {
          title: element.title,
          author: element.author,
          likes: element.likes
        }
      }
    })
    return bestBlog
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}