import React from 'react'
import partners from 'partners.json'
import PropTypes from 'prop-types'
import Partner from '@/components/partner'

function Partners({isChartePage}) {
  const displayPartners = partners.map(partner => {
    return isChartePage ? <Partner key={partner.name} partnerInfos={partner} isChartePage /> : <Partner key={partner.name} partnerInfos={partner} />
  })

  return (
    <div className={isChartePage ? 'partners-container' : 'light-partners-container'}>
      {displayPartners}

      <style jsx>{`
        .partners-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          align-items: start;
          justify-items: center;
          margin-top: 5em;
          gap: 6em 5em;
        }

        .light-partners-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          align-items: center;
          margin-top: 1em;
          row-gap: 3em;
        }
        `}</style>
    </div>
  )
}

Partners.propTypes = {
  isChartePage: PropTypes.bool
}

export default Partners
