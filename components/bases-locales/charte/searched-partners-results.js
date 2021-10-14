import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {HelpCircle, ChevronDown, ChevronRight} from 'react-feather'

import Partner from './partner'
import Notification from '@/components/notification'
import theme from '@/styles/theme'

function SearchedPartnersResults({companies, organizations}) {
  const [isCompaniesVisible, setIsCompaniesVisible] = useState(organizations.length === 0)

  const onCompaniesVisible = () => {
    setIsCompaniesVisible(!isCompaniesVisible)
  }

  useEffect(() => {
    setIsCompaniesVisible(organizations.length === 0)
  }, [organizations])

  return (
    <div>
      <div>
        {organizations.length > 0 ? (
          <div className='partners-container'>
            {organizations.map(partner => <Partner key={partner.name} partnerInfos={partner} />)}
          </div>
        ) : (
          <div>
            <div className='no-found'>Aucun organisme de mutualisation n’est référencé comme Partenaire de la Charte de la Base Adresse Locale dans ce Département.</div>
            <Notification isFullWidth>
              <HelpCircle style={{verticalAlign: 'bottom', marginRight: '5px'}} />
              Pour en faire partie, vous pouvez nous contacter à l’adresse suivante: <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr.</a>
            </Notification>
          </div>

        )}
      </div>
      <div className='organizations-container'>
        <div className='companies-dropdown' onClick={onCompaniesVisible}>
          {isCompaniesVisible ? (
            <ChevronDown color={theme.primary} />
          ) : (
            <ChevronRight color={theme.primary} />
          )}
          <div>Entreprises</div>
        </div>

        {isCompaniesVisible && (
          <div className='partners-container companies-container'>
            {companies.map(partner => <Partner key={partner.name} partnerInfos={partner} />)}
          </div>
        )}
      </div>

      <style jsx>{`
        .partners-container {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(335px, 1fr));
          justify-items: flex-start;
          margin: 4em 0;
          gap: 6em 5em;
        }

        .organizations-container {
          margin-top: 8em;
        }

        .no-found {
          text-align: center;
          margin: 1em 0;
          font-style: italic;
        }

        .companies-dropdown {
          width: fit-content;
          display: flex;
          font-size: 1.5em;
          gap: 15px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

SearchedPartnersResults.propTypes = {
  companies: PropTypes.array.isRequired,
  organizations: PropTypes.array.isRequired,
}

export default SearchedPartnersResults
