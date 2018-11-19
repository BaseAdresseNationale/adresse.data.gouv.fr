import React from 'react'

import Section from '../section'

export default () => (
  <Section title='En partenariat avec' subtitle=''>
    <div className='main'>
      <div>
        <a href='https://portail.dgfip.finances.gouv.fr/portail/accueilIAM.pl/'>
          <img className='logo' src='/static/images/logos/dgfip.png' alt='DGFIP' />
        </a>
      </div>
      <div>
        <a href='http://ign.fr/'>
          <img className='logo' src='/static/images/logos/IGN.jpg' alt='IGN' />
        </a>
      </div>
      <div>
        <a href='http://openstreetmap.fr/'>
          <img className='logo' src='/static/images/logos/OSM.png' alt='OpenStreetMap France' />
        </a>
      </div>
      <div>
        <a href='http://www.laposte.fr/'>
          <img className='logo' src='/static/images/logos/laposte.jpg' alt='La Poste' />
        </a>
      </div>
    </div>

    <style jsx>{`
      .main {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        grid-row-gap: 0.6em;
        text-align: center;
        align-items: center;
      }

      .logo {
        height: 130px;
      }
    `}</style>
  </Section>
)
