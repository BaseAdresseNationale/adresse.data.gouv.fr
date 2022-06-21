import PropTypes from 'prop-types'
import {uniq} from 'lodash'

import theme from '@/styles/theme'

import {formatTag} from '@/lib/tag'

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
        const isActive = handleTagClassname(tag) === 'label label-active'
        const isDisable = handleTagClassname(tag) === 'label label-inactive'

        return (
          <button
            type='button'
            aria-label={`${isActive ? 'Désélectionner' : 'Sélectionner'} le tag ${tag}`}
            aria-disabled={isDisable}
            onClick={() => {
              onSelectTags(tag)
            }}
            key={tag}
            className={handleTagClassname(tag)}
          >
            {formatTag(tag)}
          </button>
        )
      })}

      <style jsx>{`
        .labels-container {
            margin: 1.5em 0 1em 0;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          }

        .labels-container button {
          border: none;
        }

        .label {
          font-size: .9em;
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
