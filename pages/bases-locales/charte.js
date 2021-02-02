import React from 'react'
import Image from 'next/image'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import Partner from '@/components/partner'
import {Download, Book} from 'react-feather'

import theme from '@/styles/theme'

const title = 'Charte et organismes partenaires'

function Charte() {
  return (
    <Page>
      <Head title={title} icon={<Download size={56} />} />

      <Section background='white' title='Charte de la Base Adresse Locale'>
        <div className='charte-container'>
          <p>La présence de cette <b>Charte de la Base Adresse Locale</b> sur le site Internet d’un organisme signifie qu’il privilégie le format <b>Base Adresse Locale</b> pour la transmission des adresses communales à la <b>Base Adresse Nationale</b>. Cet organisme est donc référencé sur <b>adresse.data.gouv.fr</b>.</p>
          <p>Cette charte vise à fédérer le plus grand nombre d’acteurs qui ont en commun le souhait d’utiliser et de promouvoir <b>les Bases Adresses Locales</b> à travers plusieurs actions dédiées.</p>
        </div>
        <div>
          <ul className='charte-list'>
            <li>Cet organisme promeut <b>une gouvernance</b> qui assure à la commune d’être la seule autorité compétente sur l’adresse à travers <b>sa Base Adresse Locale</b> -même si elle peut en déléguer la réalisation technique. En outre, une commune peut à tout moment reprendre une gestion autonome de ses adresses ;</li>
            <li>Cet organisme programme, soutient, valorise (selon le cas) des formations permettant à la commune d’administrer <b>sa Base Adresse Locale</b> sur <b>mes-adresses.data.gouv.fr</b> lorsque la commune ne dispose pas d’outils (les siens ou ceux du délégataires) ;</li>
            <li>Cet organisme veille à la participation active de la commune pour certifier ses adresses ;</li>
            <li>Cet organisme informe la commune de l’importance de mettre à jour régulièrement ses adresses et de créer une routine ;</li>
            <li>Cet organisme encourage et facilite la transmission rapide de <b>la Base Adresse Locale</b> à <b>la Base Adresse Nationale</b> ; </li>
            <li>S’il souhaite prendre en charge l’alimentation de <b>la Base Adresse Nationale</b>, cet organisme, devra <b>privilégier l’API d’alimentation</b>, et ce dès que possible après le porter à connaissance de la nouvelle version de <b>la Base Adresse Locale</b> d’une commune.</li>
          </ul>
        </div>
        <div>
          <p>Cette Charte est éditée le 29 janvier 2021 à Paris et <b>valable pour une durée d’un an</b>.</p>
        </div>
        <style jsx>{`
              .charte-container {
                margin-top: 3em;
              }

              .charte-list li {
                margin-top: 0.5em;
              }
            `}</style>
      </Section>

      <Section background='grey' title='Télécharger la charte' >
        <div className='charte-download-section'>
          <div className='charte-preview'>
            <Image
              src='/images/previews/charte.png'
              alt='miniature de la charte'
              width={150}
              height={200}
            />
          </div>
          <a href='https://adresse.data.gouv.fr/data/docs/charte-bal-v1.0.pdf' target='_blank' rel='noreferrer'>
            <Book style={{verticalAlign: 'bottom', marginRight: '5px'}} />
            Télécharger
          </a>
        </div>

        <style jsx>{`
              .charte-download-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 1.5em;
              }

              .charte-preview {
                margin: 1.5em;
                border: 1px solid ${theme.border};
              }
            `}</style>
      </Section>

      <Section background='white' title='Organismes partenaires'>
        <div className='partners'>
          <Partner link='https://ideo.ternum-bfc.fr/' src='/images/logos/partners/IDeO.svg' alt='partenaire ideo bfc' name='IDéO BFC' height={200} width={140} />
          <Partner link='https://www.crige.normandie.fr/crige' src='/images/logos/partners/Crige.jpg' alt='partenaire crige' name='CRIGE Normandie' height={200} width={356} />
          <Partner link='https://www.communaute-paysbasque.fr/' src='/images/logos/partners/commupb.png' alt='partenaire communauté pays basques' name='Communauté d’Agglomération du Pays Basque' height={200} width={200} />
          <Partner link='https://geo.compiegnois.fr/portail/' src='/images/logos/partners/Geocompiegnois.png' alt='partenaire geocompiegnois' name='GéoCompiégnois' height={50} width={409} />
        </div>
        <style jsx>{`
        .partners {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          justify-content: space-around;
          margin-top: 12em;
          align-items: center;
          grid-gap: 1em;
        }
        `}</style>
      </Section>
    </Page>
  )
}

export default Charte
