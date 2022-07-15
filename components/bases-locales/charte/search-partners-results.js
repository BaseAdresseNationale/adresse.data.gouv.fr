import PropTypes from 'prop-types'
import {HelpCircle} from 'react-feather'

import Partner from './partner'
import Notification from '@/components/notification'

function SearchPartnersResults({companies, organizations, communes}) {
  return (
    <div>
      <div className='contact-container'>
        <div className='subscription-indication'>Vous souhaitez être référencé comme Partenaire de la Charte de la Base Adresse Nationale, contactez nous.</div>
        <Notification isFullWidth>
          <HelpCircle style={{verticalAlign: 'bottom', marginRight: '5px'}} alt />
          Pour en faire partie, vous pouvez nous contacter à l’adresse suivante: <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr.</a>
        </Notification>
      </div>

      <div className='partner-section'>
        <div className={`title ${communes.length === 0 && 'disabled'}`}>Communes - échelon de compétence</div>
        {communes.length > 0 ? (
          <div className='partners-container'>
            {communes.map(partner => <Partner key={partner.name} partnerInfos={partner} isCommune />)}
          </div>
        ) : (
          <div className='no-found'>Votre commune n’est pas encore référencée comme Partenaire de la Charte de la Base Adresse Locale.</div>
        )}
      </div>

      <div className='partner-section'>
        <div className={`title ${organizations.length === 0 && 'disabled'}`}>Organismes</div>
        {organizations.length > 0 ? (
          <div className='partners-container'>
            {organizations.map(partner => <Partner key={partner.name} partnerInfos={partner} />)}
          </div>
        ) : (
          <div className='no-found'>Aucun organisme de mutualisation n’est référencé comme Partenaire de la Charte de la Base Adresse Locale dans ce département.</div>

        )}
      </div>

      <div className='partner-section'>
        <div className={`title ${companies.length === 0 && 'disabled'}`}>Entreprises</div>
        {companies.length > 0 ? (
          <div className='partners-container'>
            {companies.map(partner => <Partner key={partner.name} partnerInfos={partner} />)}
          </div>
        ) : (
          <div className='no-found'>Aucune entreprise n’est référencée comme Partenaire de la Charte de la Base Adresse Locale dans ce département.</div>
        )}
      </div>

      <style jsx>{`
        .partners-container {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(335px, 1fr));
          justify-items: flex-start;
          margin: 2em 0;
          gap: 6em 5em;
        }

        .partner-section {
          margin-top: 4em;
        }

        .no-found, .subscription-indication {
          margin: 1em 0;
          font-style: italic;
        }

        .subscription-indication {
          text-align: center;
        }

        .title {
          font-size: 1.5em;
          font-weight: bold;
        }

        .contact-container {
          margin: 2em 0 4em 0;
        }

        .disabled {
          opacity: 60%;
        }
      `}</style>
    </div>
  )
}

SearchPartnersResults.propTypes = {
  companies: PropTypes.array.isRequired,
  organizations: PropTypes.array.isRequired,
  communes: PropTypes.array.isRequired
}

export default SearchPartnersResults
