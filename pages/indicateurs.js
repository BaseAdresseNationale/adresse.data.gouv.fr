import Image from 'next/legacy/image'
import {PieChart} from 'react-feather'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'

function Indicateurs() {
  const title = 'Indicateurs d’impact'
  const description = ''

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<PieChart size={56} alt='' aria-hidden='true' />} />

      <Section background='grey'>
        <SectionText>
          Cette page d’indicateurs ne reflète qu’une partie des usages. Sont ici représentés les usages de l’API adresse et non les usages de téléchargement des fichiers adresse. Néanmoins, les exploitations de l’API sont une illustration relativement fidèle des usages de l’adresse et de la typologie des utilisateurs.<br />
          Les statistiques sont présentées sur une périodicité mensuelle et sont issues des données brutes d’exploitation.<br />
          Ces données seront régulièrement enrichies afin de donner une lecture la plus fidèle des usages de la BAN.<br />
          Date de dernière mise à jour : Avril 2023
        </SectionText>
      </Section>

      <Section title='Nombre de requêtes' subtitle='en mars 2023' >
        <Image src='/images/indicateurs/nb_requetes.png' height={200} width={1000} />
      </Section>

      <Section title='Part public-privé' subtitle='en mars 2023' background='grey'>
        <Image src='/images/indicateurs/part_public.png' height={550} width={1000} />
      </Section>

      <Section title='Ils nous font confiance' subtitle='Les 5 plus gros utilisateurs publics en mars 2023'>
        <Image src='/images/indicateurs/top5.png' height={520} width={1000} />
      </Section>

    </Page>
  )
}

export default Indicateurs

