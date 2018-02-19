import Link from 'next/link'

import Section from './section'

export default () => (
  <Section title='En partenariat avec' subtitle=''>
    <div className='main'>
      <div>
        <Link href='https://portail.dgfip.finances.gouv.fr/portail/accueilIAM.pl/'>
          <a><img className='logo' src='/static/images/logos/dgfip.png' alt='DGFIP' /></a>
        </Link>
      </div>
      <div>
        <Link href='http://ign.fr/'>
          <a><img className='logo' src='/static/images/logos/IGN.jpg' alt='IGN' /></a>
        </Link>
      </div>
      <div>
        <Link href='http://openstreetmap.fr/'>
          <a><img className='logo' src='/static/images/logos/OSM.png' alt='OpenStreetMap France' /></a>
        </Link>
      </div>
      <div>
        <Link href='http://www.laposte.fr/'>
          <a><img className='logo' src='/static/images/logos/laposte.jpg' alt='La Poste' /></a>
        </Link>
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
