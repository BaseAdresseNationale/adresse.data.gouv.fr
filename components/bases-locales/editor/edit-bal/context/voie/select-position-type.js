import React from 'react'
import PropTypes from 'prop-types'

class SelectPositionType extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
  }

  static defaultProps = {
    type: 'entrée'
  }

  handleChange = e => {
    const {onSubmit} = this.props
    e.preventDefault()

    onSubmit(e.target.value)
  }

  render() {
    const {type} = this.props

    return (
      <div>
        <div className='select'>
          <label>Type</label>
          <select value={type} onChange={this.handleChange}>
            <option value='entrée'>Entrée</option>
            <option value='délivrance postale'>Délivrance postale</option>
            <option value='bâtiment'>Bâtiment</option>
            <option value='cage d’escalier'>Cage d’escalier</option>
            <option value='logement'>Logement</option>
            <option value='parcelle'>Parcelle</option>
            <option value='segment'>Segment</option>
            <option value='service technique'>Service technique</option>
          </select>
        </div>

        <style jsx>{`
          .close {
            display: flex;
            justify-content: flex-end;
          }

          .close-button {
            padding: 0px 4px 4px 4px;
          }

          .close-button:hover {
            cursor: pointer;
            background: whitesmoke;
          }

          .button-marker {
            display: flex;
            justify-content: center;
            margin: 1em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default SelectPositionType
