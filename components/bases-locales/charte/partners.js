import PropTypes from 'prop-types'
import Partner from '@/components/bases-locales/charte/partner'

import colors from '@/styles/colors'

function Partners({partnersList, isAllPartners}) {
  const companyPartners = partnersList.filter(partner => partner.isCompany === true)
  const partners = isAllPartners ? partnersList.filter(partner => partner.isCompany === false) : partnersList

  return (
    <>
      <div className='partners-container'>
        {partners.map(partner => <Partner key={partner.name} partnerInfos={partner} />)}
      </div>

      {isAllPartners && (
        <div className='compagny'>
          <h3 className='subtitle'>Sociétés</h3>
          <div className='partners-container'>
            {companyPartners.map(partner => <Partner key={partner.name} partnerInfos={partner} />)}
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
  partnersList: PropTypes.array,
  isAllPartners: PropTypes.bool
}

Partner.defaultProps = {
  partnersList: null,
  isAllPartners: false
}

export default Partners
