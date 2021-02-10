import React from 'react'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import TemoignagesComponent from '@/components/temoignages'

import {MessageCircle} from 'react-feather'

function Temoignages() {
  return (
    <Page>
      <Head title='Bonnes pratiques des Bases Adresses Locales' icon={<MessageCircle size={56} />} />
      <Section title='Élus et agents apportent leurs témoignages' >
        <TemoignagesComponent />
      </Section>
    </Page>
  )
}

export default Temoignages
