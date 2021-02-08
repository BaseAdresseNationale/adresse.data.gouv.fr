import React from 'react'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import TemoignagesComponent from '@/components/temoignages'

import {MoreHorizontal} from 'react-feather'

function Temoignages() {
  return (
    <Page>
      <Head title='Témoignages sur la Base d’adresses locales' icon={<MoreHorizontal size={56} />} />
      <Section title='Retrouvez l’avis des communes ayant adopté la BAL' >
        <TemoignagesComponent />
      </Section>
    </Page>
  )
}

export default Temoignages
