import React from 'react'
import PropTypes from 'prop-types'

import RadioInput from './radio-input'

class TagsInput extends React.Component {
  render() {
    const {title, tags, selected, toggleTag} = this.props
    return (
      <div className='form'>
        <div className='title'>{title}</div>
        <div className='tags'>
          {tags.map(tag => (
            <RadioInput
              key={tag}
              style={{display: 'flex', alignItems: 'flex-start', margin: '5px 10px 0'}}
              value={tag}
              checked={selected.includes(tag)}
              toggleInput={toggleTag} />
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

          .tags {
            display: flex;
            justify-content: start;
            flex-flow: wrap;
          }
          `}</style>
      </div>
    )
  }
}

TagsInput.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  toggleTag: PropTypes.func.isRequired
}

export default TagsInput
