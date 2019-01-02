import React from 'react'
import PropTypes from 'prop-types'

import {CustomControlWrapper, CustomControl} from './controls'

import CustomControlsStyle from './controls.css'

class ControlWrapper extends React.Component {
  state = {
    open: false
  }

  static propTypes = {
    map: PropTypes.object.isRequired,
    buttons: PropTypes.array.isRequired
  }

  componentDidMount() {
    const {map} = this.props

    this.groupControl = new CustomControlWrapper(this.toggleMenu)

    map.addControl(this.groupControl)
  }

  addButtonsToControl = () => {
    const {buttons} = this.props

    const customControls = buttons.map(button => {
      const {icon, action, active} = button
      return new CustomControl(icon, action, active)
    })

    this.groupControl.addChilds(customControls)
  }

  toggleMenu = () => {
    const {open} = this.state

    if (open) {
      this.groupControl.removeChilds()
    } else {
      this.addButtonsToControl()
    }

    this.setState(state => {
      return {
        open: !state.open
      }
    })
  }

  render() {
    return (
      <style
        dangerouslySetInnerHTML={{__html: CustomControlsStyle}} // eslint-disable-line react/no-danger
      />
    )
  }
}

export default ControlWrapper
