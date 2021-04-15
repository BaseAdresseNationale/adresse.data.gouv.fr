import React from 'react'
import PropTypes from 'prop-types'
import {uniq} from 'lodash'

import theme from '@/styles/theme'

const formatService = service => {
  if (service.includes('’')) {
    service = service.replace('’', ' ')
  }

  return `#${service.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1, word.length)
  ).join('')}`
}

const handleListOfTags = partners => {
  const tags = []
  partners.forEach(partner => {
    partner.services.forEach(service => {
      tags.push(service)
    })
  })
  return uniq(tags)
}

function Tags({onSelectTags, selectedTags, filteredPartners, allPartners}) {
  const handleTagClassname = tag => {
    const filteredPartnersTags = uniq(filteredPartners.map(({services}) => services).flat())

    if (selectedTags.includes(tag)) {
      return 'label label-active'
    }

    if (!filteredPartnersTags.includes(tag)) {
      return 'label label-inactive'
    }

    return 'label'
  }

  return (
    <div className='labels-container'>
      {handleListOfTags(allPartners).map(tag => {
        return (
          <div
            onClick={() => {
              onSelectTags(tag)
            }}
            key={tag}
            className={handleTagClassname(tag)}
          >
            {formatService(tag)}
          </div>
        )
      })}

      <style jsx>{`
        .labels-container {
            margin: 1.5em 0 1em 0;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          }

        .label {
          font-size: 1.1em;
          background-color: ${theme.colors.lightGrey};
          color: ${theme.colors.black};
          border-radius: 4px;
          font-style: italic;
        }

        .label-inactive {
          color: ${theme.colors.darkerGrey};
          pointer-events: none;
        }

        .label-active {
          color: ${theme.colors.white};
          background-color: ${theme.colors.blue};
        }

        .label:hover {
          cursor: pointer;
        }

        @media (max-width: 400px) {
          .label {
            font-size: 1em;
          }
         }
      `}</style>
    </div>
  )
}

export default Tags

Tags.propTypes = {
  onSelectTags: PropTypes.func.isRequired,
  filteredPartners: PropTypes.array.isRequired,
  allPartners: PropTypes.array.isRequired,
  selectedTags: PropTypes.array
}

Tags.defaultProps = {
  selectedTags: []
}
