import React from 'react'
import PropTypes from 'prop-types'

class Events extends React.PureComponent {
  static propTypes = {
    layers: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired
  }

  static contextTypes = {
    map: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.handlers = []

    for (const layer of props.layers) {
      this.handlers.push({
        event: 'click',
        layer,
        handler: this.onClick.bind(this, layer)
      }, {
        event: 'mousemove',
        layer,
        handler: this.onMouseEnter.bind(this, layer)
      }, {
        event: 'mouseleave',
        layer,
        handler: this.onMouseLeave.bind(this, layer)
      }, {
        event: 'dragend',
        layer,
        handler: this.onDragEnd.bind(this)
      })
    }
  }

  componentDidMount() {
    const {map} = this.context

    for (const {event, layer, handler} of this.handlers) {
      map.on(event, layer, handler)
    }
  }

  componentWillUnmount() {
    const {map} = this.context

    for (const {event, layer, handler} of this.handlers) {
      map.off(event, layer, handler)
    }
  }

  componentWillUpdate() {
    return false
  }

  onClick(layer, event) {
    const {map} = this.context
    const {onClick} = this.props

    onClick(map, event)
  }

  onMouseEnter(layer, event) {
    const {map} = this.context
    const {onMouseEnter} = this.props

    onMouseEnter(map, event)
  }

  onMouseLeave(layer, event) {
    const {map} = this.context
    const {onMouseLeave} = this.props

    onMouseLeave(map, event)
  }

  onDragEnd() {
    const {map} = this.context
    const {onDragEnd} = this.props

    onDragEnd(map)
  }

  render() {
    return null
  }
}

export default Events
