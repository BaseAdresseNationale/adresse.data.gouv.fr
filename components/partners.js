import React from 'react'

import Partner from '@/components/partner'

function Partners() {
  return (
    <div>
      <div className='partners'>
        <Partner link='https://ideo.ternum-bfc.fr/' src='/images/logos/partners/IDeO.svg' alt='partenaire ideo bfc' name='IDéO BFC' height={90} width={63} />
        <Partner link='https://www.crige.normandie.fr/crige' src='/images/logos/partners/Crige.jpg' alt='partenaire crige' name='CRIGE Normandie' height={90} width={160} />
        <Partner link='https://www.communaute-paysbasque.fr/' src='/images/logos/partners/commupb.png' alt='partenaire communauté pays basques' name='Communauté d’Agglomération du Pays Basque' height={90} width={90} />
        <Partner link='https://geo.compiegnois.fr/portail/' src='/images/logos/partners/Geocompiegnois.png' alt='partenaire geocompiegnois' name='GéoCompiégnois' height={35} width={286} />
      </div>
      <style jsx>{`
        .partners {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(286px, 1fr));
          justify-content: space-around;
          margin-top: 3em;
          align-items: center;
          grid-gap: 1em;
        }
        `}</style>
    </div>
  )
}

export default Partners

