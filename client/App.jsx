const React = require('react')
const Landing = require('./Landing')
module.exports = React.createClass({
  render () {
    return (
      <Landing {...this.props}/>
    )
  }
})
