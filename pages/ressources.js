import Link from 'next/link'
import Image from 'next/legacy/image'
import {Book} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import DocDownload from '@/components/doc-download'
import ButtonLink from '@/components/button-link'
import Notification from '@/components/notification'

function Guides() {
  return (
    <Page>
      <Head title='Ressources autour de l’adressage' icon={<Book size={56} alt='' aria-hidden='true' />} />
      <Section>
        <SectionText>
          <p>
            Pour vous accompagner dans la <b>gestion des adresses</b> de votre commune, vous trouverez sur cette page des <b>guides régulièrement mis à jour</b>.
          </p>
          <p>
            Placés sous le régime de la <b><i>licence ouverte</i></b>, ils sont <b>diffusables</b> et <b>réutilisables</b> sans restriction.
          </p>
          <p>La <b>documentation</b> présente la Base Adresse Nationale, les formats d’adresse ainsi que les services et outils accessibles sur le site.</p>
          <p>La <b>F.A.Q</b> répond aux questions les plus courantes, posées lors des <b>webinaires</b> par les acteurs de la commune.</p>
          <p>
            Pour être tenu informé des mises à jour ou suggérer des évolutions, n’hésitez-pas à <Link href='/nous-contacter'>nous contacter</Link>.
          </p>
        </SectionText>
      </Section>

      <Section background='color' title='Documentation'>
        <p>Cette <b>documentation</b> vous fournit les informations relatives à la <b>Base Adresse Nationale</b>, au format <b>Base Adresse Locale</b>, ainsi que des FAQ et conseils pratiques.</p>
        <div className='button-container'>
          <div className='logos-container' aria-hidden='true'>
            <Image src='/images/logos/BAN.svg' height={210} width={210} alt='' />
            <Image src='/images/logos/BAL.svg' height={200} width={200} alt='' />
          </div>
          <ButtonLink href='https://doc.adresse.data.gouv.fr/' isExternal isOutlined color='white'>
            Accéder à la documentation
          </ButtonLink>
        </div>

        <style jsx>{`
          p {
            margin-top: 2em;
            text-align: center;
          }

          .logos-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
          }

          .button-container {
            text-align: center;
            margin-top: 2em;
          }
        `}</style>
      </Section>

      <Section>
        <DocDownload
          id='guide-adressage'
          title='Le guide de Mes Adresses'
          link='https://adresse.data.gouv.fr/data/docs/guide-mes-adresses.pdf'
          src='/images/previews/guide-mes-adresses-preview.png'
          label='Télécharger le guide de l’adressage'
          alt='miniature du guide Mes Adresses'
          version='6 - 06/05/2022'
        >
          <SectionText>
            <p>&quot;Mes Adresses&quot; est un outil en ligne qui vous permet de gérer simplement vos adresses, de la constitution d’une Base Adresse Locale à sa mise à jour. Il est accessible sans compétences techniques et dispose d’un tutoriel embarqué.<br /> <a href='https://guide.mes-adresses.data.gouv.fr/'>Le Guide de Mes Adresses est disponible dans un format texte en ligne</a> ou en PDF.</p>          </SectionText>
          <Notification>
            Les guides sont régulièrement <b>actualisés</b>. Si vous téléchargez la version PDF, pensez à vérifier que vous disposez de <b>la dernière version en vigueur</b>. Le type de version et les dates de mises à jour figurent à la fin des PDF.
          </Notification>
        </DocDownload>
      </Section>

      <Section background='grey'>
        <DocDownload
          id='guide-bonnes-pratiques'
          title='Le guide des bonnes pratiques'
          subtitle='à l’usage des communes et de leurs partenaires'
          isReverse
          src='/images/previews/bonnes-pratiques-preview.png'
          alt='miniature du guide bonne pratique'
          link='https://adresse.data.gouv.fr/data/docs/guide-bonnes-pratiques.pdf'
          label='Télécharger le guide des bonnes pratiques'
          version='4.0 - 02/01/2023'
        >
          <SectionText>
            <p>
              Les communes sont responsables de leurs adresses.<br /> Ce guide passe en revue les bonnes pratiques pour nommer, numéroter les voies et diffuser l’information en parfaite conformité avec les obligations légales et rien que les obligations légales.<br /> <a href='https://guide-bonnes-pratiques.adresse.data.gouv.fr/'>Le Guide des Bonnes pratiques est disponible dans un format texte en ligne</a> ou en PDF.
            </p>
          </SectionText>
          <Notification>
            Les guides sont régulièrement <b>actualisés</b>. Si vous téléchargez la version PDF, pensez à vérifier que vous disposez de <b>la dernière version en vigueur</b>. Le type de version et les dates de mises à jour figurent à la fin des PDF.
          </Notification>
        </DocDownload>
      </Section>

      <Section>
        <DocDownload
          title='La fibre arrive dans la commune'
          src='/images/previews/obligations-adresse-preview.png'
          alt='miniature du document obligations-adresse'
          link='https://adresse.data.gouv.fr/data/docs/communes-operateurs-obligations-adresse.pdf'
          label='Télécharger le document "La fibre arrive dans votre commune"'
          version=''
        >
          <h4>Communes et opérateurs, vous pouvez gagner du temps</h4>
          <SectionText>
            <p>
              Avant de vous lancer dans une opération d’adressage et d’engager les finances de la commune, prenez connaissance des actions nécessaires et suffisantes.
            </p>
          </SectionText>
        </DocDownload>

        <style jsx>{`
          h4 {
            font-size: large;
          }
        `}</style>
      </Section>

      <Section background='color' title='F.A.Q'>
        <div className='faq-container'>
          <div className='icon-container'>
            <Image src='/images/icons/faq.svg' height={190} width={190} alt='' aria-hidden='true' />
          </div>
          <SectionText color='secondary'>
            Vous vous posez des questions sur <b>la création de votre Base Adresse Locale</b> et sur <b>la gestion de vos adresses</b> ? Certaines disposent déjà d’une réponse !<br />
            Cette <b>FAQ</b> est alimentée par les échanges avec <b>les élus et agents des communes</b> compilés dans les tchats des <b>webinaires</b> des communes.
          </SectionText>

          <ButtonLink href='https://adresse-data-gouv-fr.gitbook.io/faq/' isExternal color='white' isOutlined>Accéder à la FAQ</ButtonLink>
        </div>

        <style jsx>{`
          .faq-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2em;
          }

          .icon-container {
            margin-top: 2em;
          }
        `}</style>
      </Section>

      <Section title='Articles techniques et témoignages' subtitle='Créer une Base Adresse Locale' id='commune'>
        <div style={{textAlign: 'center'}}>
          <SectionText>
            <p>
              Vous souhaitez découvrir comment d’autres communes procèdent pour mettre à jour leurs adresses, comment vos adresses sont utilisées ou encore prendre connaissance des évolutions techniques de Mes Adresses et de la BAN ?
            </p>
            <p>
              Consultez le blog et naviguez grâce aux mots-clés.
            </p>
          </SectionText>
          <ButtonLink size='large' href='/blog'>Accéder au blog</ButtonLink>
        </div>
      </Section>

      <Section background='grey' title='En partenariat avec : '>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Image width={190} height={80} src='/images/logos/logo-anct.png' alt='l’ANCT' />
        </div>
      </Section>
    </Page>
  )
}

export default Guides
