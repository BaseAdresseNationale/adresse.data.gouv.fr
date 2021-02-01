import React from 'react'
import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import DocDownload from '@/components/doc-download'
import {FileText} from 'react-feather'

const title = 'Chartre de la Base Adresse Locale'

function charte() {
  return (
    <Page>
      <Head title={title} icon={<FileText size={56} />} />
      <Section background='white'>
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
              .charte-list li {
                margin-top:2em
              }
              .charte-list li:last-child {
                margin-bottom:2em
              }
            `}</style>
      </Section>

      <Section background='grey' >
        <DocDownload
          title='Télécharger la chartre de la Base Adresse Locale'
          src='/images/previews/charte.png'
          alt='miniature du document charte'
          link='https://livingdata-chat.slack.com/files/UP06LNQGY/F01LW2NB933/20210129_charte_bal_ideo-bfc.pdf'
          isVersionLight='true'
        />
      </Section>
    </Page>
  )
}

export default charte
