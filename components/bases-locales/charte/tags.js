import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {uniqueId, uniq} from 'lodash'

import theme from '@/styles/theme'

const formatService = service => {
  return `#${service.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1, word.length)
  ).join('')}`
}

function Tags({onSelectLabels, selectedLabels, filteredPartners, allPartners}) {
  const [listOfTags, setListOfTags] = useState([])

  const handleListOfTags = useCallback(
    () => {
      const tags = []
      allPartners.forEach(partner => {
        partner.services.forEach(service => {
          tags.push(service)
        })
      })
      setListOfTags(uniq(tags))
    },
    [allPartners]
  )

  const handleTagClassname = label => {
    const matchingTags = []
    filteredPartners.forEach(partner => {
      if (partner.services.includes(label)) {
        matchingTags.push(label)
      }
    })
    if (selectedLabels.includes(label)) {
      return 'label label-active'
    }

    if (!matchingTags.includes(label)) {
      return 'label label-inactive'
    }

    return 'label'
  }

  useEffect(() => {
    handleListOfTags()
  }, [handleListOfTags])

  return (
    <div className='labels-container'>
      {listOfTags.map(tag => {
        return (
          <div
            onClick={() => {
              onSelectLabels(tag)
            }}
            key={uniqueId()}
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
  onSelectLabels: PropTypes.func.isRequired,
  filteredPartners: PropTypes.array.isRequired,
  allPartners: PropTypes.array.isRequired,
  selectedLabels: PropTypes.array
}

Tags.defaultProps = {
  selectedLabels: []
}
