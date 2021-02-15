import React from 'react'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import TemoignagesComponent from '@/components/temoignages'

import {MessageCircle} from 'react-feather'

function Temoignages() {
  const title = 'Témoignages sur les Bases Adresses Locales'
  const description = 'Découvrez des témoignages de terrain sur les solutions à adopter pour conserver toute la richesse de vos adresses dans une Base Adresse Locale'

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<MessageCircle size={56} />} />
      <Section title={description} >
        <TemoignagesComponent />
      </Section>
    </Page>
  )
}

export default Temoignages
