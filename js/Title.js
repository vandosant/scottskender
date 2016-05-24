const React = require('react')

let Title = React.createClass({
  render () {
    const style = {color: this.props.color}
    return (
      <div>
        <h1 style={style}>
          {this.props.title}
	</h1>
      </div>
    )
  }
})

module.exports = Title
