import React from 'react'
import dynamic from 'next/dynamic'
import FaEdit from 'react-icons/lib/fa/edit'

import Page from '../../layouts/main'

import Loader from '../../components/loader'
import Head from '../../components/head'
import Section from '../../components/section'

const title = 'Éditer une fichier base locale'
const description = 'Cet outil permet de réaliser de vérifier la conformité d’un fichier BAL et d’en éditer les champs.'

const Editor = dynamic(import('../../components/bases-locales/editor'), {
  ssr: false,
  loading: () => (
    <div className='centered'>
      <Loader />
      <p>Chargement…</p>
      <style jsx>{`
          .centered {
             position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}</style>
    </div>
  )
})

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
