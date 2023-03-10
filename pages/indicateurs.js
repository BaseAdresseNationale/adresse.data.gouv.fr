import Image from 'next/legacy/image'
import {PieChart} from 'react-feather'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'

function Indicateurs() {
  const title = 'Indicateurs d’impact'
  const description = ''

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<PieChart size={56} alt='' aria-hidden='true' />} />

      <Section title='Nombre de requêtes' subtitle='en février 2023' >
        <Image src='/images/indicateurs/nb_requetes.png' height={250} width={1000} />
      </Section>

      <Section title='Part public-privé' subtitle='en février 2023' background='grey'>
        <Image src='/images/indicateurs/part_public.png' height={550} width={1000} />
      </Section>

      <Section title='Ils nous font confiance' subtitle='Les 5 plus gros utilisateurs publics en février 2023'>
        <Image src='/images/indicateurs/top5.png' height={590} width={1000} />
      </Section>

    </Page>
  )
}

export default Indicateurs

