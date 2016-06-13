const React = require('react')

let Title = React.createClass({
  render () {
    const style = {color: this.props.color}
    return (
      <div>
        <div style={style} className='panel'>
          {this.props.title}
	</div>
      </div>
    )
  }
})

module.exports = Title
