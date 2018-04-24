import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

import SwitchInput from './switch-input'
import TagsInput from './tags-input'

class TableList extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleChange(event) {
    const {onChange} = this.props
    event.preventDefault()
    onChange(event.target.value)
  }

  handleSelect(event) {
    const {onFilterTags} = this.props
    event.preventDefault()
    onFilterTags(event.target.value)
  }

  render() {
    const {text, sources, destinations, selectedTags, onFilterTags, onSwitch, onlyActive} = this.props

    return (
      <div className='grid'>
        <div className='row-1'>
          <input className='search' type='text' value={text} placeholder='Rechercher…' onChange={this.handleChange} />
          <div className='switch'>
            <SwitchInput handleChange={onSwitch} label='Active' isChecked={onlyActive} />
          </div>
        </div>

        <div className='row-2'>
          {sources &&
            <div className='tags'>
              <TagsInput
                title='Sources'
                tags={sources}
                selected={selectedTags}
                toggleTag={onFilterTags} />
            </div>
          }
          {destinations &&
            <div className='tags'>
              <TagsInput
                title='Destination'
                tags={destinations}
                selected={selectedTags}
                toggleTag={onFilterTags} />
            </div>
          }
        </div>

        <style jsx>{`
            .grid {
              display: grid;
            }

            .row-1 {
              display: grid;
            }

            .row-1 .search {
              grid-column-start: 1;
              grid-column-end: 4;
            }

            .row-1 .switch {
              grid-column-start: 4;
              grid-column-end: 4;
            }

            row-2 {
              display: grid;
            }

            .tags {
              width: 100%;
              border: 1px solid ${theme.colors.lightGrey};
              margin: 5px 0;
            }

          `}</style>
      </div>
    )
  }
}

TableList.propTypes = {
  text: PropTypes.string,
  sources: PropTypes.array,
  destinations: PropTypes.array,
  selectedTags: PropTypes.array,
  onlyActive: PropTypes.bool,
  onFilterTags: PropTypes.func.isRequired,
  onSwitch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

TableList.defaultProps = {
  text: '',
  sources: null,
  destinations: null,
  selectedTags: []
}

export default TableList
