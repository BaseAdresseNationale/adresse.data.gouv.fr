import ResponsiveImage from '@/components/ResponsiveImage'
import Section from '@/components/Section'
import { StyledPage } from './page.styles'
import CardWrapper from '@/components/CardWrapper'
import Card from '@codegouvfr/react-dsfr/Card'
import SectionTilesList from '@/components/SectionTilesList'
import Button from '@codegouvfr/react-dsfr/Button'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Link from 'next/link'

const ressourcesData = [
  {
    title: 'La documentation',
    description: 'Cette documentation vous fournit les informations relatives à la Base Adresse Nationale, au format Base Adresse Locale, ainsi que des FAQ et conseils pratiques.',
    picto: '/ressources-et-documentations/book.png',
    link: {
      href: '#',
      target: '_self',
    },
  },
  {
    title: 'Les guides',
    description: 'Pour vous accompagner dans la gestion des adresses de votre commune, vous trouverez sur cette page des guides régulièrement mis à jour.',
    picto: '/ressources-et-documentations/document-download.png',
    link: {
      href: '#',
      target: '_self',
    },
  },
  {
    title: 'La FAQ',
    description: 'La F.A.Q répond aux questions les plus courantes, posées lors des webinaires par les acteurs de la commune.',
    picto: '/ressources-et-documentations/community.png',
    link: {
      href: '#',
      target: '_self',
    },
  },
]

export default async function RessourcesPage() {
  return (
    <StyledPage>
      <Section pageTitle="Ressources autour de l'adressage">
        <div className="on-this-page">
          <div className="illustration-wrapper">
            <ResponsiveImage src="/ressources-et-documentations/ressources.png" alt="Illustration ressources et documentations" />
          </div>
          <div className="text-wrapper">
            <div>
              <b>Pour vous accompagner dans la gestion des adresses de votre commune,</b> vous trouverez sur cette page:
            </div>
            <ul>
              <li>
                <b>Des guides</b>
                <div>Régulièrement mis à jour.</div>
              </li>
              <li>
                <b>La documentation</b>
                <div>Présentant la Base Adresse Nationale, les formats d’adresse ainsi que les services et outils accessibles sur le site.</div>
              </li>
              <li>
                <b>Une FAQ</b>
                <div>Répondant aux questions les plus courantes.</div>
              </li>
            </ul>
            <div className="logo-wrapper">
              <ResponsiveImage src="/ressources-et-documentations/logo-ban.png" alt="Logo BAN" style={{ height: 80, width: 180 }} />
              <ResponsiveImage src="/ressources-et-documentations/logo-bal.png" alt="Logo BAL" style={{ height: 80, width: 140 }} />
            </div>
          </div>
        </div>
      </Section>
      <SectionTilesList
        data={ressourcesData}
        id="ressources-adressage"
        theme="primary"
      />
      <Section theme="secondary" className="stay-tuned">
        <div>
          <div className="text-wrapper">
            <i className="ri-information-line" />
            <h2>Restez informés </h2>
            <p>
              Pour être tenu informé des mises à jour ou suggérer des évolutions, n’hésitez-pas à nous contacter.
            </p>
            <Button>
              Contactez nous
            </Button>
          </div>
          <div className="illustration-wrapper">
            <ResponsiveImage src="/ressources-et-documentations/questions.png" alt="Illustration restez informés" style={{ width: 470 }} />
          </div>
        </div>
      </Section>
      <Section className="guide-section">
        <div>
          <div className="text-wrapper">
            <div>
              <h2>
                Le guide de &quot;Mes Adresses&quot;
              </h2>
              <legend>
                Version 8.2 - 01/06/2023
              </legend>
            </div>
            <p>
              &quot;Mes Adresses&quot; est un outil en ligne qui vous permet de gérer simplement vos adresses, de la constitution d’une Base Adresse Locale à sa mise à jour. Il est accessible sans compétences techniques et dispose d’un tutoriel embarqué.
            </p>
            <Link href="#" target="_blank">Le Guide de Mes Adresses est disponible dans un format texte en ligne</Link>
            <Button iconId="fr-icon-download-line">Télécharger le guide</Button>
            <Alert
              description="Si vous téléchargez la version PDF, pensez à vérifier que vous disposez de la dernière version en vigueur. Le type de version et les dates de mises à jour figurent à la fin des PDF."
              severity="info"
              title="Les guides sont régulièrement actualisés"
            />
          </div>
          <div className="illustration-wrapper">
            <ResponsiveImage src="/ressources-et-documentations/guide-mes-adresses.png" alt="Illustration guide Mes Adresses" style={{ width: 220, height: 300 }} />
          </div>
        </div>
      </Section>
      <Section theme="grey" className="guide-section">
        <div>
          <div className="illustration-wrapper">
            <ResponsiveImage src="/ressources-et-documentations/guide-mes-adresses.png" alt="Illustration guide Mes Adresses" style={{ width: 220, height: 300 }} />
          </div>
          <div className="text-wrapper">
            <div>
              <h2>
                Le guide des bonnes pratiques
              </h2>
              <b>à l’usage des communes et de leurs partenaires</b>
              <legend>
                Version 4.1 - 08/09/2023
              </legend>
            </div>
            <p>
              Les communes sont responsables de leurs adresses. Ce guide passe en revue les bonnes pratiques pour nommer, numéroter les voies et diffuser l’information en parfaite conformité avec les obligations légales et rien que les obligations légales.
            </p>
            <Link href="#" target="_blank">Le Guide des bonnes pratiques est disponible dans un format texte en ligne</Link>
            <Button iconId="fr-icon-download-line">Télécharger le guide</Button>
            <Alert
              description="Si vous téléchargez la version PDF, pensez à vérifier que vous disposez de la dernière version en vigueur. Le type de version et les dates de mises à jour figurent à la fin des PDF."
              severity="info"
              title="Les guides sont régulièrement actualisés"
            />
          </div>
        </div>
      </Section>
    </StyledPage>
  )
}
