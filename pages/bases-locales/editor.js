import React from 'react'
import FaEdit from 'react-icons/lib/fa/edit'
import Page from '../../layouts/main'

import Head from '../../components/head'
import Section from '../../components/section'

import Editor from '../../components/bases-locales/editor'

const title = 'Éditer une fichier base locale'
const description = 'Cet outil permet de réaliser de vérifier la conformité d’un fichier BAL et d’en éditer les champs.'

export default () => (
  <Page>
    <Head title={title} icon={<FaEdit />}>
      {description}
    </Head>

    <Section>
      <Editor />
    </Section>
  </Page>
)
