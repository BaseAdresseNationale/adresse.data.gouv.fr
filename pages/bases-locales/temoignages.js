import React from 'react'
import testimoniesData from 'public/temoignages.json'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import Temoignage from '@/components/temoignage'

import {MoreHorizontal} from 'react-feather'

function Temoignages() {
  const temoignages = testimoniesData

  return (
    <Page>
      <Head title='Témoignages sur la Base d’adresses locales' icon={<MoreHorizontal size={56} />} />
      <Section title='Retrouvez l’avis des communes ayant adopté la BAL' >
        <div className='temoignages-section'>
          {temoignages.map(temoignage => {
            return (
              <Temoignage key={temoignage.title} temoignage={temoignage} />
            )
          })}

          <style jsx>{`
          .temoignages-section {
            margin-top: 8em;
            text-align: center;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 4em
          }
        `}</style>
        </div>
      </Section>
    </Page>
  )
}

export default Temoignages
