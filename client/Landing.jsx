const React = require('react')
const Title = require('./Title')
const Post = require('./postModel')

let Landing = React.createClass({
  getInitialState() {
    return Post.load()
  },
  render() {
    <div>
      <Title title='Musings' color='#000' />
      {this.posts.map((post) => { return (
	<div key={post._id} className='panel'><a href='#'>{post.title}</a></div> )
      } )}
    </div>
  }
})

module.exports = Landing
