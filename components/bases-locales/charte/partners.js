import React from 'react'
import PropTypes from 'prop-types'
import Partner from '@/components/bases-locales/charte/partner'

import allPartners from 'partners.json'

function Partners({searchedPartners}) {
  const partners = searchedPartners || allPartners
  return (
    <div className='partners-container'>
      {partners.map(partner => {
        return <Partner key={partner.name} partnerInfos={partner} />
      })}

      <style jsx>{`
        .partners-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          justify-items: center;
          margin-top: 2em;
          gap: 6em 5em;
        }
      `}</style>
    </div>
  )
}

Partners.propTypes = {
  searchedPartners: PropTypes.array
}

Partners.defaultProps = {
  searchedPartners: null
}

export default Partners
