import React from 'react'

import Partner from '@/components/partner'

function Partners() {
  return (
    <div>
      <div className='partners'>
        <Partner link='https://ideo.ternum-bfc.fr/' src='/images/logos/partners/ideo.svg' alt='Logo partenaire IDéO Bourgogne-Franche-Comté' name='IDéO BFC' height={90} width={63} />
        <Partner link='https://www.crige.normandie.fr/crige' src='/images/logos/partners/crige.jpg' alt='Logo partenaire CRIGE Normandie' name='CRIGE Normandie' height={90} width={160} />
        <Partner link='https://www.communaute-paysbasque.fr/' src='/images/logos/partners/paysbasque.png' alt='Logo partenaire communauté d’agglomération Pays Basque' name='Communauté d’Agglomération du Pays Basque' height={90} width={90} />
        <Partner link='https://geo.compiegnois.fr/portail/' src='/images/logos/partners/geocompiegnois.png' alt='Logo partenaire Géocompiégnois' name='GéoCompiégnois' height={35} width={286} />
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

