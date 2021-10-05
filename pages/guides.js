import Link from 'next/link'
import Image from 'next/image'
import {Book} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import DocDownload from '@/components/doc-download'

function Guides() {
  return (
    <Page>
      <Head title='Guides de l’adressage' icon={<Book size={56} />} />
      <Section>
        <div>
          <p>
            Pour vous accompagner dans la <b>gestion des adresses</b> de votre commune, vous trouverez sur cette page des <b>guides régulièrement mis à jour</b>.
          </p>
          <p>
            Placés sous le régime de la <b><i>licence ouverte</i></b>, ils sont <b>diffusables</b> et <b>réutilisables</b> sans restriction.
          </p>
          <p>
            Pour être tenu informé des mises à jour ou suggérer des évolutions, n’hésitez-pas à <Link href='/nous-contacter'>nous contacter</Link>.
          </p>
        </div>
      </Section>
      <Section background='grey'>
        <DocDownload
          id='guide-adressage'
          title='Le guide de Mes Adresses'
          link='https://adresse.data.gouv.fr/data/docs/guide-mes-adresses-v4.1.pdf'
          src='/images/previews/guide-mes-adresses-preview.png'
          alt='miniature du guide Mes Adresses'
        >
          <p>
            &quot;Mes Adresses&quot; est un outil en ligne qui vous permet de gérer simplement vos adresses, de la constitution d’une Base Adresse Locale à sa mise à jour. Il est accessible sans compétences techniques et dispose d’un tutoriel embarqué.<br /> Le Guide de Mes Adresses est disponible dans un <a href='https://guide.mes-adresses.data.gouv.fr/'>format texte en ligne</a> ou en PDF.
          </p>
        </DocDownload>
      </Section>
      <Section>
        <DocDownload
          id='guide-bonnes-pratiques'
          title='Le guide des bonnes pratiques'
          isReverse='true'
          src='/images/previews/bonnes-pratiques-preview.png'
          alt='miniature du guide bonne pratique'
          link='https://adresse.data.gouv.fr/data/docs/guide-bonnes-pratiques-v2.1.pdf'
        >
          <p>
            Les communes sont responsables de leurs adresses.<br /> Ce guide passe en revue les bonnes pratiques pour nommer, numéroter les voies et diffuser l’information en parfaite conformité avec les obligations légales et rien que les obligations légales.<br /> Le Guide des Bonnes pratiques est disponible dans un <a href='https://guide-bonnes-pratiques.adresse.data.gouv.fr/'>format texte en ligne</a> ou en PDF.
          </p>
        </DocDownload>
      </Section>
      <Section background='grey'>
        <DocDownload
          title='La fibre arrive dans la commune'
          src='/images/previews/obligations-adresse-preview.png'
          alt='miniature du document obligations-adresse'
          link='https://adresse.data.gouv.fr/data/docs/communes-operateurs-obligations-adresse.pdf'
        >
          <h5>Communes et opérateurs, vous pouvez gagner du temps</h5>
          <p>
            Avant de vous lancer dans une opération d’adressage et d’engager les finances de la commune, prenez connaissance des actions nécessaires et suffisantes.
          </p>
        </DocDownload>
      </Section>
      <Section title='En partenariat avec : '>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Image width={190} height={80} src='/images/logos/logo_ANCT.svg' alt='logo ANCT' />
        </div>
      </Section>
    </Page>
  )
}

export default Guides
