import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../../../../../styles/theme'
import TagsInput from './tags-input'

class TableList extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    sources: PropTypes.array,
    selectedTags: PropTypes.array,
    onFilterTags: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    text: '',
    sources: null,
    selectedTags: []
  }

  handleChange = event => {
    const {onChange} = this.props

    event.preventDefault()
    onChange(event.target.value)
  }

  handleSelect = event => {
    const {onFilterTags} = this.props

    event.preventDefault()
    onFilterTags(event.target.value)
  }

  render() {
    const {text, sources, selectedTags, onFilterTags} = this.props

    return (
      <div>
        <div className='filter-1'>
          <input className='search' type='text' value={text} placeholder='Rechercher…' onChange={this.handleChange} />
          {sources &&
            <div className='tags'>
              <TagsInput
                title='Sources'
                tags={sources}
                selected={selectedTags}
                toggleTag={onFilterTags} />
            </div>}
        </div>

        <style jsx>{`
            .filter-1 {
              display: flex;
            }

            .filter-1 .tags {
              margin-left: 1em;
            }

            .tags {
              width: 100%;
              border: 1px solid ${theme.colors.lightGrey};
            }

            @media (max-width: 700px) {
              .filter-1 {
                display: flex;
                flex-direction: column;
              }

              .filter-1 .tags {
                margin: 5px 0 0 0;
              }

              .tags {
                width: 100%;
                margin: 5px 0;
              }
            }
          `}</style>
      </div>
    )
  }
}

export default TableList
