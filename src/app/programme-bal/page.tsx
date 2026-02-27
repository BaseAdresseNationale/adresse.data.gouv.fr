import Section from '@/components/Section'
import { getStats } from '@/lib/api-ban'
import Button from '@codegouvfr/react-dsfr/Button'
import Link from 'next/link'
import { StyledPageProgrammeBAL } from './page.styles'
import IconCard from '@/components/IconCard'
import ResponsiveImage from '@/components/ResponsiveImage'
import { Quote } from '@codegouvfr/react-dsfr/Quote'

export default async function ProgrammeBALPage() {
  const stats = await getStats()

  return (
    <StyledPageProgrammeBAL>
      <Section className="hero-section" theme="primary">
        <div className="fr-container fr-py-5w">
          <div className="fr-grid-row">
            <div className="fr-col-md-7 improve-quality-card">
              <h1 className="fr-mb-3w">
                Améliorez la qualité de service de vos administrés
              </h1>
              <p
                style={{ marginBottom: 40 }}
                className="fr-text--lead fr-pr-3w"
              >
                <b>Base Adresse Locale</b> est un programme de l&apos;ANCT
                destiné aux communes. Référencez toutes les adresses de votre
                commune pour offrir de meilleurs services à vos administrés.
              </p>
              <Button
                linkProps={{
                  href: 'https://mes-adresses.data.gouv.fr/',
                  target: '_blank',
                }}
              >
                Créer la base de ma commune
              </Button>
            </div>
            <div className="fr-col-md-5 image-wrapper">
              <ResponsiveImage
                alt="Illustration d'une carte dans un smartphone"
                src="/programme-bal/illustration-1.png"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="fr-container fr-py-5w">
          <div className="fr-grid-row fr-grid-row--gutters">
            <IconCard
              title="Ludique"
              text="Redécouvrez votre commune autrement"
              imageSrc="/programme-bal/ludique.svg"
            />
            <IconCard
              title="À votre rythme"
              text="Complétez votre base en plusieurs temps"
              imageSrc="/programme-bal/a-votre-rythme.svg"
            />
            <IconCard
              title="Simple"
              text="Sans frais et sans compétence technique"
              imageSrc="/programme-bal/simple.svg"
            />
          </div>
        </div>
      </Section>

      <Section theme="primary" id="creer-sa-base-adresse-locale">
        <div className="fr-container fr-py-5w">
          <div className="fr-grid-row">
            <h2>Créer sa Base Adresse Locale</h2>
            <div className="fr-grid-row space-between-row">
              <div className="fr-col-md-5 cta-card">
                <h3>En autonomie</h3>
                <p>
                  Notre outil <strong>Mes Adresses</strong> vous permet de vous
                  lancer, gratuitement et sans compétences techniques.
                </p>
                <Button
                  linkProps={{
                    href: 'https://mes-adresses.data.gouv.fr/',
                    target: '_blank',
                  }}
                >
                  Créer la base de ma commune
                </Button>
                <p style={{ marginTop: '1.5rem' }}>
                  Vous disposez déjà d&apos;un SIG? Rendez-vous sur :<br />
                  <Link
                    href="https://doc.adresse.data.gouv.fr/docs/documentation-generale/mettre-a-jour-sa-base-adresse-locale/publier-une-base-adresse-locale"
                    className="fr-link--icon-right fr-icon-arrow-right-line fr-link"
                    target="_blank"
                  >
                    Gérer mes adresses
                  </Link>
                </p>
              </div>
              <div className="fr-col-md-5 cta-card">
                <h3>Avec accompagnement</h3>
                <Link
                  href="/formation-en-ligne"
                  className="fr-link--icon-right fr-icon-arrow-right-line fr-link"
                >
                  Suivre nos formations
                </Link>
                <p style={{ marginTop: '1em' }}>
                  Nos partenaires labellisés Charte de la Base Adresse Locale
                  vous proposent un accompagnement ou des outils adaptés à votre
                  territoire.
                </p>
                <Link
                  href="/bases-locales/charte#recherche-partenaires"
                  className="fr-link--icon-right fr-icon-arrow-right-line fr-link"
                >
                  Trouver un partenaire dans mon département
                </Link>
                <p style={{ marginTop: '1em' }}>
                  Différents types{' '}
                  <strong>d&apos;organismes à but non lucratif</strong> peuvent
                  vous accompagner dans la confection de votre Base Adresse
                  Locale, découvrez les via une{' '}
                  <strong>carte interactive</strong>.
                </p>
                <Link
                  target="_blank"
                  href="https://umap.openstreetmap.fr/en/map/partenaires-publics-de-la-charte-de-la-base-adress_953281#6/47.354/9.229"
                  className="fr-link--icon-right fr-icon-arrow-right-line fr-link"
                >
                  Découvrir nos partenaires
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section theme="primary">
        <div className="fr-container fr-py-5w">
          <div className="fr-grid-row hide-mobile">
            <h2>Une Base Adresse Locale pour...</h2>
          </div>

          <div className="fr-grid-row">
            <div className="fr-col-md-6">
              <h2 className="reasons-list-title">Vos habitants</h2>
              <p>
                Valorisez votre commune en mettant à jour votre{' '}
                <strong>Base Adresse Locale</strong>.
              </p>

              <ul style={{ listStyleType: 'none' }}>
                <li>
                  <span className="fr-h6">Fin des problèmes d’adressage</span>
                  <ul className="inner-list">
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Arrivée des secours accélérée
                    </li>
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Mise à jour des GPS facilitée
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="fr-h6">
                    Attractivité de votre territoire
                  </span>
                  <ul className="inner-list">
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Connexion à la fibre accélérée
                    </li>
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Entreprises mieux référencées
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="fr-h6">Promotion du patrimoine local</span>
                  <ul className="inner-list">
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Adresses en langue régionale
                    </li>
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Mise en avant des lieux d’intérêts
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="fr-col-md-6">
              <h2 className="reasons-list-title">Vous</h2>
              <p>
                Profitez d’une <strong>Base Adresse Locale</strong> à jour pour
                vous faciliter la vie.
              </p>

              <ul style={{ listStyleType: 'none' }}>
                <li>
                  <span className="fr-h6">Listing d’adresses à jour</span>
                  <ul className="inner-list">
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Inscription dans les écoles
                    </li>
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Listes électorales
                    </li>
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Plan canicule
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="fr-h6">Moins d’administratif</span>
                  <ul className="inner-list">
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Moins de sollicitations sur les adresses
                    </li>
                    <li>
                      <span className="fr-icon-check-line" aria-hidden="true" />
                      Autonomie de vos agents publics : votre commune est
                      souveraine
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="fr-container fr-py-5w">
          <div className="fr-grid-row main-steps-row">
            <div className="fr-col-md-7 main-steps-card">
              <h2>Les grandes étapes de l&apos;adressage</h2>
              <div className="action-list">
                <div>
                  <div className="action-number">1.</div>
                  <div className="action">
                    <h4>Faites l’état des lieux</h4>
                    <p>Repérez les adresses manquantes, les doublons... </p>
                    <div>
                      <Link
                        href="https://mes-adresses.data.gouv.fr/"
                        className="fr-link--icon-right fr-icon-arrow-right-line fr-link"
                      >
                        Créer une base pour ma commune
                      </Link>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="action-number">2.</div>
                  <div className="action">
                    <h4>Harmonisez vos adresses</h4>
                    <p>
                      Complétez votre base, consultez la population et délibérez
                      en Conseil municipal.
                    </p>
                    <div>
                      <Link
                        href="/ressources#guide-des-bonnes-pratiques"
                        className="fr-link--icon-right fr-icon-arrow-right-line fr-link"
                      >
                        Découvrez les bonnes pratiques
                      </Link>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="action-number">3.</div>
                  <div className="action">
                    <h4>Diffusez votre base</h4>
                    <p>
                      Publiez votre base, placez des panneaux et informez vos
                      habitants et partenaires.
                    </p>
                    <div>
                      <Link
                        href="https://doc.adresse.data.gouv.fr/docs/documentation-generale/mettre-a-jour-sa-base-adresse-locale/publier-une-base-adresse-locale"
                        className="fr-link--icon-right fr-icon-arrow-right-line fr-link"
                      >
                        Découvrez les méthodes de publication
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fr-col-offset-1 fr-col-md-3 image-wrapper">
              <ResponsiveImage
                src="/programme-bal/illustration-2.png"
                alt="Illustraction d'un homme cochant des cases"
              />
            </div>
          </div>
          {stats && (
            <div style={{ marginTop: 50 }} className="fr-grid-row">
              <h2>
                Déjà <strong>{stats.bal.nbCommunesCouvertes}</strong> communes
                ont mis jour leurs bases d’adresses
              </h2>
            </div>
          )}
          <div className="fr-grid-row quote-wrapper">
            <Quote
              className="fr-col-md-5"
              size="medium"
              text="Je m’attendais à un outil un peu indigeste. Et il est d’une simplicité à toute épreuve. Il est facile de se connecter, de suivre un webinaire - et même, nul besoin de webinaire, car l’outil est très simple d’utilisation. S’il existait déjà une adresse au niveau national, il les remonte et on vérifie, on valide avant de passer à la suivante. Cela permet surtout d’ajouter les lieux dits, ce qui est très important. Les adresses, avec les lieux-dits, seront utilisées par tous les secours."
              author="Judith Ardon Pernet, maire de Nogaret"
              source={<a href="https://adresse.data.gouv.fr/blog/les-bases-adresses-locales-pivot-de-la-transition-numerique-des-communes" target="_blank">Consulter l&apos;article entier</a>}
            />
            <Quote
              className="fr-col-md-5"
              size="medium"
              text="J’ai vérifié les numérotations et corrigé les fautes d’orthographe. Il est vrai qu’en Bretagne, l’orthographe est un peu particulière, pas toujours compatible avec les usages classiques de la langue française. Nous utilisons les apostrophes comme à « Kerflec’h », avec le « c’h ». C’est ainsi, c’est l’orthographe du mot, elle figure d’ailleurs sur les panneaux. Je souhaitais surtout procéder à ces corrections une seule fois, ne plus avoir à y revenir. J’ai ouvert à nouveau ma Base Adresse Locale afin de réaliser associer les adresses aux numéros de parcelles : il s’agit surtout d’une opération complémentaire. Bien entendu, nous effectuerons les mises à jour lors de nouvelles constructions."
              author="Joël Marivain, maire de Kerfourn"
              source={<a href="https://adresse.data.gouv.fr/blog/lassociation-des-maires-du-morbihan-mobilise-les-communes-sur-leurs-adresses" target="_blank">Consulter l&apos;article entier</a>}
            />
          </div>
          <div className="fr-grid-row hide-mobile" style={{ marginTop: 50 }}>
            <p>
              Le programme <strong>Base Adresse Locale</strong> permet de
              reprendre la main sur les données de son territoire. Il est
              soutenu par les maires et les territoires de France :
            </p>
          </div>
          <div className="fr-grid-row space-around-row hide-mobile">
            <div className="fr-col-md-3 image-wrapper">
              <Link href="https://www.amf.asso.fr/" passHref>
                <ResponsiveImage
                  src="/programme-bal/AMF.png"
                  alt="Logo de l'AMF"
                />
              </Link>
            </div>
            <div className="fr-col-md-3 image-wrapper">
              <Link href="https://www.amrf.fr/" passHref>
                <ResponsiveImage
                  src="/programme-bal/AMFR.png"
                  alt="Logo de l'AMRF"
                />
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </StyledPageProgrammeBAL>
  )
}
