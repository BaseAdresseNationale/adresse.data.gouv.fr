import React from 'react'
import PropTypes from 'prop-types'

import {CustomControlGroup, CustomControl} from './controls'

import CustomControlsStyle from './controls.css'

class ControlGroup extends React.Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    buttons: PropTypes.array.isRequired
  }

  componentDidMount() {
    const {map, buttons} = this.props

    const controls = buttons.map(button => {
      const {icon, action, active} = button
      return new CustomControl(icon, action, active)
    })

    this.groupControl = new CustomControlGroup(controls)
    map.addControl(this.groupControl)
  }

  render() {
    return (
      <style
        dangerouslySetInnerHTML={{__html: CustomControlsStyle}} // eslint-disable-line react/no-danger
      />
    )
  }
}

export default ControlGroup
