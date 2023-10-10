import PropTypes from 'prop-types'
import {keyBy} from 'lodash'
import communes from '@etalab/decoupage-administratif/data/communes.json'
import styled from 'styled-components'
import {Accordion} from '@codegouvfr/react-dsfr/Accordion'

import BaseLocaleCard from '@/components/bases-locales/deploiement-bal/bal-card'

const communesActuelles = communes.filter(({type}) => type === 'commune-actuelle')
const communesIndex = keyBy(communesActuelles, 'code')

const findCommuneName = codeCommune => {
  return communesIndex[codeCommune]?.nom || ''
}

const StyledAccordion = styled(Accordion)`
  .fr-accordion__btn {
    font-size: 16px;
    font-weight: bold;
  }
  .fr-accordion__btn:hover {
    background: none !important;
  }
  .fr-collapse--expanded {
    padding-left: 0;
    padding-right: 0;
  }
  .accordion {
    padding: 10px;
  }
`

function CommuneBALList({codeCommune, balsCommune}) {
  const nomCommune = findCommuneName(codeCommune)
  const title = `${codeCommune} ${nomCommune} - ${balsCommune.length > 0 ? balsCommune.length + ' BAL(s)' : 'Aucune BAL'} `

  return (
    <div>
      {balsCommune.length > 0 ? (
        <StyledAccordion label={title} className='accordion'>
          {balsCommune.map(bal => (
            <BaseLocaleCard key={bal._id} bal={bal} />
          ))}
        </StyledAccordion>
      ) : (
        <section className='section-no-bal'>
          <p>{title}</p>
        </section>
      )}
      <style jsx>{`
          .section-no-bal {
            margin-bottom: -1px;
          }
          .section-no-bal p {
            font-size: 16px;
            line-height: 3em;
            margin: 0;
            text-align: left;
            padding-left: 16px;
            border-bottom: 1px solid #ddd;
          }
          `}</style>
    </div>
  )
}

CommuneBALList.propTypes = {
  codeCommune: PropTypes.string.isRequired,
  balsCommune: PropTypes.array.isRequired
}

export default CommuneBALList
