import PropTypes from 'prop-types'
import Partner from '@/components/bases-locales/charte/partner'
import {orderBy} from 'lodash'

import colors from '@/styles/colors'

const orderByName = partners => {
  return orderBy(partners, [partner => partner.name], ['asc'])
}

function Partners({epci, companies, shuffledPartners}) {
  const companiesPartners = companies && orderByName(companies)
  const partners = epci ? orderByName(epci) : shuffledPartners

  return (
    <>
      <div className='partners-container'>
        {partners.map(partner => <Partner key={partner.name} partnerInfos={partner} />)}
      </div>

      {companiesPartners && (
        <div className='compagny'>
          <h3 className='subtitle'>Sociétés</h3>
          <div className='partners-container'>
            {companiesPartners.map(partner => <Partner key={partner.name} partnerInfos={partner} />)}
          </div>
        </div>
      )}

      <style jsx>{`
        .partners-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          justify-items: center;
          margin-top: 4em;
          gap: 8em;
        }

        .compagny {
          margin-top: 8em;
          border-top: ${colors.lighterGrey} solid;
          display: grid;
          grid-template-rows: 50px 1fr;
        }

        .subtitle {
          margin-top: 2em;
          color: ${colors.black};
          font-weight: bold;
          align-self: center;
        }
      `}</style>
    </>
  )
}

Partners.propTypes = {
  epci: PropTypes.array,
  companies: PropTypes.array,
  shuffledPartners: PropTypes.array
}

Partners.defaultProps = {
  epci: null,
  companies: null,
  shuffledPartners: null
}

export default Partners
