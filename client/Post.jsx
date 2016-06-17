const React = require('react')

const Post = React.createClass({
  render() {
    const title = this.props.params.title
    return (
      <div>
        <h3>{title}</h3>
      </div>
    )
  }
})

module.exports = Post
