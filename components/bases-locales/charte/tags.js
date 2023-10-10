import PropTypes from 'prop-types'
import {uniq} from 'lodash'

import theme from '@/styles/theme'

import {formatTag} from '@/lib/tag'

import ActionButtonNeutral from '@/components/action-button-neutral'

function Tags({onSelectTags, selectedTags, filteredPartners, partnersServices}) {
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
      {partnersServices.map(tag => {
        const isActive = handleTagClassname(tag).includes('active')

        return (
          <ActionButtonNeutral
            label={`${isActive ? 'Désélectionner' : 'Sélectionner'} le tag ${tag}`}
            aria-disabled={!isActive}
            onClick={() => {
              onSelectTags(tag)
            }}
            key={tag}
          >
            <div className={handleTagClassname(tag)}> {formatTag(tag)}</div>
          </ActionButtonNeutral>
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
          background: ${theme.colors.lighterGrey};
        }

        .label-active {
          color: ${theme.colors.white};
          background-color: ${theme.colors.blue};
        }
      `}</style>
    </div>
  )
}

export default Tags

Tags.propTypes = {
  onSelectTags: PropTypes.func.isRequired,
  filteredPartners: PropTypes.array.isRequired,
  partnersServices: PropTypes.array.isRequired,
  selectedTags: PropTypes.array
}

Tags.defaultProps = {
  selectedTags: []
}
