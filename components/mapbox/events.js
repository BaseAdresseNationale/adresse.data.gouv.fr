import React from 'react'
import PropTypes from 'prop-types'

class Events extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired
  }

  static contextTypes = {
    map: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  componentDidMount() {
    const {map} = this.context

    map.on('click', 'point', this.onClick)
    map.on('mousemove', 'point', this.onMouseEnter)
    map.on('mouseleave', 'point', this.onMouseLeave)
  }

  componentWillUnmount() {
    const {map} = this.context

    map.off('click', 'point', this.onClick)
    map.off('mousemove', 'point', this.onMouseEnter)
    map.off('mouseleave', 'point', this.onMouseLeave)
  }

  onClick(event) {
    const {map} = this.context
    const {onClick} = this.props

    onClick(map, event)
  }

  onMouseEnter(event) {
    const {map} = this.context
    const {onMouseEnter} = this.props

    onMouseEnter(map, event)
  }

  onMouseLeave(event) {
    const {map} = this.context
    const {onMouseLeave} = this.props

    onMouseLeave(map, event)
  }

  render() {
    return null
  }
}

export default Events
