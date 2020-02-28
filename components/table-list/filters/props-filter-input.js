import React from 'react'
import PropTypes from 'prop-types'

import CheckboxInput from './checkbox-input'

class PropsFilterInput extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    propFilter: PropTypes.shape({
      name: PropTypes.string.isRequired,
      values: PropTypes.array.isRequired
    }).isRequired,
    selectedPropsFilter: PropTypes.object.isRequired,
    toggleProp: PropTypes.func.isRequired
  }

  handleInput = value => {
    const {propFilter: {name}, toggleProp} = this.props
    toggleProp({name, value})
  }

  render() {
    const {title, propFilter, selectedPropsFilter} = this.props

    return (
      <div className='form'>
        <div className='title'>{title}</div>
        <div className='props'>
          {propFilter.values.map(propValue => (
            <CheckboxInput
              key={propValue}
              style={{display: 'flex', alignItems: 'flex-start', margin: '5px 10px 0'}}
              value={propValue}
              isChecked={selectedPropsFilter[propFilter.name] && selectedPropsFilter[propFilter.name].includes(propValue)}
              toggleInput={this.handleInput} />
          ))}
        </div>
        <style jsx>{`
          .form {
            display: flex;
            flex-flow: wrap;
            align-items: center;
            text-align: center;
          }

          .title {
            padding: 1em;
          }

          .props {
            display: flex;
            justify-content: start;
            flex-flow: wrap;
          }
          `}</style>
      </div>
    )
  }
}

export default PropsFilterInput
