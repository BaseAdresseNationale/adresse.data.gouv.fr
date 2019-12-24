import React from 'react'
import FaSearch from 'react-icons/lib/fa/search'

import Section from '../section'
import ExploreSearch from './explore-search'

const Explorer = () => (
  <Section background='color'>
    <div className='beta'>
      <h2><FaSearch /> Rechercher une commune, une voie ou une adresse</h2>
    </div>

    <ExploreSearch />

    <style jsx>{`
        .beta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: -3em;
        }

        .beta h2 {
          margin-right: 45px;
        }
      `}</style>
  </Section>
)

export default Explorer
