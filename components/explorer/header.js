import React from 'react'

import Section from '../section'
import ExploreSearch from './explore-search'

const Explorer = () => (
  <Section>
    <div className='header-section'>
      <h2>Rechercher une commune, une voie ou une adresse</h2>
    </div>

    <ExploreSearch />

    <style jsx>{`
        .header-section {
          margin-top: -3em;
        }
      `}</style>
  </Section>
)

export default Explorer
