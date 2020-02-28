import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import PropsFilterInput from './props-filter-input'

class Filters extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    hasTextFilter: PropTypes.bool.isRequired,
    propsToFilter: PropTypes.array,
    selectedPropsFilter: PropTypes.object,
    onFilterProp: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    text: '',
    propsToFilter: null,
    selectedPropsFilter: {}
  }

  handleChange = event => {
    const {onChange} = this.props

    event.preventDefault()
    onChange(event.target.value)
  }

  render() {
    const {text, hasTextFilter, propsToFilter, selectedPropsFilter, onFilterProp} = this.props
    return (
      <div>
        <div className='filter-1'>
          {hasTextFilter && <input className='search' type='text' value={text} placeholder='Rechercher…' onChange={this.handleChange} />}
          {propsToFilter && propsToFilter[0].values.length > 1 && (
            <div className='props'>
              {propsToFilter.map(propFilter => propFilter.values.length >= 2 && (
                <PropsFilterInput
                  key={propFilter.title}
                  title={propFilter.title}
                  propFilter={propFilter}
                  selectedPropsFilter={selectedPropsFilter}
                  toggleProp={onFilterProp} />
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
            .filter-1 {
              display: flex;
            }

            .filter-1 .props {
              margin-left: 1em;
            }

            .props {
              width: 100%;
              border: 1px solid ${theme.colors.lightGrey};
            }

            @media (max-width: 700px) {
              .filter-1 {
                display: flex;
                flex-direction: column;
              }

              .filter-1 .props {
                margin: 5px 0 0 0;
              }

              .props {
                width: 100%;
                margin: 5px 0;
              }
            }
          `}</style>
      </div>
    )
  }
}

export default Filters
