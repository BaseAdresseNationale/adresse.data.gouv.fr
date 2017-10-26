import Link from 'next/link'

import Section from '../section'

export default () => (
  <Section title='Nos partenaires' subtitle=''>
    <div className='main'>
      <div>
        <p>IGN</p>
        <Link href='http://ign.fr/'>
          <a><img className='logo' src='/static/images/logos/IGN.jpg' alt='IGN' /></a>
        </Link>
      </div>
      <div>
        <p>La Poste</p>
        <Link href='http://www.laposte.fr/'>
          <a><img className='logo' src='/static/images/logos/laposte.jpg' alt='La Poste' /></a>
        </Link>
      </div>
      <div>
        <p>OpenStreetMap France</p>
        <Link href='http://openstreetmap.fr/'>
          <a><img className='logo' src='/static/images/logos/OSM.png' alt='OpenStreetMap France' /></a>
        </Link>
      </div>
      <div>
        <p>SGMAP / Etalab</p>
        <Link href='http://www.modernisation.gouv.fr/'>
          <a><img className='logo' src='/static/images/logos/SGMAP.png' alt='OpenStreetMap France' /></a>
        </Link>
      </div>
    </div>

    <style jsx>{`
      .main {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        grid-row-gap: 0.6em;
        text-align: center;
      }

      .logo {
        width: 130px;
      }
    `}</style>
  </Section>
)
