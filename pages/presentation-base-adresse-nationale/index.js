/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@codegouvfr/react-dsfr/Button'

import {getStats} from '@/lib/api-ban'
import theme from '@/styles/theme'
import Page from '@/layouts/main'
import Section from '@/components/section'

import HeroSection from './hero-section'
import KeyNumberSection from './key-number-section'

function ProgrammeBAL({stats}) {
  const title = 'Programme Base Adresse Locale'
  const description = 'Améliorer la qualité de service de vos administrés'

  const navigateTo = path => {
    window.open(path, '_blank')
  }

  const data = [
    {
      number: '35 000',
      label: 'Districts',
      description: 'Communes & Arrondissements, reparties sur l’ensemble du territoire'
    },
    {
      number: '250 000',
      label: 'Toponymes',
      description: 'Voies & lieux-dits'
    },
    {
      number: '25',
      unity: 'M',
      label: 'Adresses',
      description: 'Referencées dans la BAN'
    }
  ]

  return (
    <Page title={title} description={description}>
      <HeroSection imgSrc='/images/bal-landing-page/illustration.png'>
        <h1 className='fr-mb-3w'>La Base Adresse Nationale</h1>

        <p style={{marginBottom: 40}} className='fr-text--lead fr-pr-3w'>
          Unique base de données d’adresses <b>officiellement reconnue par l’administration</b>,
          la <b>Base Adresse Nationale (BAN)</b> est l’une des neuf bases de données du <b>service public
            des données de référence</b>.
        </p>

        <Link href='#'>Visitez la BAN sur notre cartographie</Link>
      </HeroSection>

      <Section>
        <p>
          <b>Service numérique d’usage partagé</b> et <b>infrastructure socle</b> sur
          laquelle sont adossées de nombreuses politiques publiques, la <b>Base Adresses Nationale (BAN)</b> fait partie
          du <b>système d’information et de communication de l’État</b>. Elle est à ce titre
          placée sous la <b>responsabilité du Premier ministre</b>.</p>

        <p>
          Son <b>pilotage</b> est assuré par la Direction Interministérielle du
          Numérique (DINUM), qui est chargée d’en définir les modalités de gouvernance et
          de fonctionnement (à la suite d’une décision du Premier ministre).</p>

        <p>
          Sa <b>construction</b> est assurée grâce à de nombreux partenaires, et en
          premier lieu par les communes, <b>seules autorités compétentes en
            terme d’adressage</b>.
        </p>

        <p>
          La <b>Base Adresse Nationale</b> est accessible sous forme de <b>fichiers</b> et
          d’<b>API</b>.
        </p>

      </Section>

      <KeyNumberSection title='Les chiffres clés' data={data} />

      <section>
        <div className='fr-container fr-py-5w'>
          <div className='fr-grid-row fr-grid-row--gutters'>
            <div className='fr-illu fr-col-12 fr-col-md-4 align-center'>
              <Image src='/images/bal-landing-page/map.svg' alt='icone carte' width={72} height={72} />
              <h4>Ludique</h4>
              <p>Redécouvrez votre commune autrement</p>
            </div>
            <div className='fr-illu fr-col-12 fr-col-md-4 align-center'>
              <Image src='/images/bal-landing-page/calendar.svg' alt='icone calendrier' width={72} height={72} />
              <h4>A votre rythme</h4>
              <p>Complétez votre base en plusieurs temps</p>
            </div>
            <div className='fr-illu fr-col-12 fr-col-md-4 align-center'>
              <Image src='/images/bal-landing-page/success.svg' alt='icone succès' width={72} height={72} />
              <h4>Simple</h4>
              <p>Sans frais et sans compétence technique</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{background: 'var(--blue-france-975-75)'}}>
        <div className='fr-container fr-py-5w'>
          <div className='fr-grid-row hide-mobile'>
            <h2>Une Base Adresse Locale pour...</h2>
          </div>

          <div className='fr-grid-row'>
            <div className='fr-col-md-6'>
              <h2 className='reasons-list-title'>Vos habitants</h2>
              <p>Valorisez votre commune en mettant à jour votre <strong>Base Adresse Locale</strong>.</p>

              <ul style={{listStyleType: 'none'}}>
                <li>
                  <span className='fr-h6'>Fin des problèmes d’adressage</span>
                  <ul className='inner-list'>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Arrivée des secours accélérée</li>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Mise à jour des GPS facilitée</li>
                  </ul>
                </li>
                <li>
                  <span className='fr-h6'>Attractivité de votre territoire</span>
                  <ul className='inner-list'>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Connexion à la fibre accélérée</li>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Entreprises mieux référencées</li>
                  </ul>
                </li>
                <li>
                  <span className='fr-h6'>Promotion du patrimoine local</span>
                  <ul className='inner-list'>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Adresses en langue régionale</li>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Mise en avant des lieux d’intérêts</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className='fr-col-md-6'>
              <h2 className='reasons-list-title'>Vous</h2>
              <p>Profitez d’une <strong>Base Adresse Locale</strong> à jour pour vous faciliter la vie.</p>

              <ul style={{listStyleType: 'none'}}>
                <li>
                  <span className='fr-h6'>Listing d’adresses à jour</span>
                  <ul className='inner-list'>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Inscription dans les écoles</li>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Listes électorales</li>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Plan canicule</li>
                  </ul>
                </li>
                <li>
                  <span className='fr-h6'>Moins d’administratif</span>
                  <ul className='inner-list'>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Moins de sollicitations sur les adresses</li>
                    <li><span className='fr-icon-check-line' aria-hidden='true' />Autonomie de vos agents publics : votre commune est souveraine</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className='fr-container fr-py-5w'>
          <div className='fr-grid-row hide-mobile'>
            <p>Le programme <strong>Bases Adresses Locales</strong> permet de reprendre la main sur les données de son territoire. Il est soutenu par les maires et les territoires de France :</p>
          </div>
          <div className='fr-grid-row space-around-row hide-mobile'>
            <div className='fr-col-md-3 image-wrapper'>
              <Link href='https://www.amf.asso.fr/' passHref>
                <img className='fr-responsive-img' src='/images/bal-landing-page/AMF.png' alt='' width='100%' />
              </Link>
            </div>
            <div className='fr-col-md-3 image-wrapper'>
              <Link href='https://www.amrf.fr/' passHref>
                <img className='fr-responsive-img' src='/images/bal-landing-page/AMFR.png' alt='' width='100%' />
              </Link>
            </div>
            {/* <div className='fr-col-md-3 image-wrapper'>
              <Link href='https://www.aitf.fr/' passHref>
                <img className='fr-responsive-img' src='/images/bal-landing-page/AITF.png' alt='' width='100%' />
              </Link>
            </div> */}
          </div>
          <div className='fr-grid-row main-steps-row'>
            <div className='fr-col-md-7 main-steps-card'>
              <h2>Les grandes étapes de l&apos;adressage</h2>
              <div className='action-list'>
                <div>
                  <div className='action-number'>1.</div>
                  <div className='action'>
                    <h4>Faites l’état des lieux</h4>
                    <p>Repérez les adresses manquantes, les doublons... </p>
                    <div>
                      <Link href='https://mes-adresses.data.gouv.fr/' className='fr-link--icon-right fr-icon-arrow-right-line fr-link'>Créer une base pour ma commune</Link>
                    </div>
                  </div>
                </div>
                <div>
                  <div className='action-number'>2.</div>
                  <div className='action'>
                    <h4>Harmonisez vos adresses</h4>
                    <p>Complétez votre base, consultez la population et délibérez en Conseil municipal.</p>
                    <div>
                      <Link href='/ressources#guide-des-bonnes-pratiques' className='fr-link--icon-right fr-icon-arrow-right-line fr-link'>Découvrez les bonnes pratiques</Link>
                    </div>
                  </div>
                </div>
                <div>
                  <div className='action-number'>3.</div>
                  <div className='action'>
                    <h4>Diffusez votre base</h4>
                    <p>Publiez votre base, placez des panneaux et informez vos habitants et partenaires.</p>
                    <div>
                      <Link href='https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/publier-une-base-adresse-locale' className='fr-link--icon-right fr-icon-arrow-right-line fr-link'>Découvrez les méthodes de publication</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='fr-col-offset-1 fr-col-md-3 image-wrapper'>
              <img className='fr-responsive-img' src='/images/bal-landing-page/checkbox.png' alt='' width='100%' />
            </div>
          </div>
          <div style={{marginTop: 50}} className='fr-grid-row'>
            <h2>Déjà <strong>{stats.bal.nbCommunesCouvertes}</strong> communes ont mis jour leurs bases d’adresses</h2>
          </div>
          <div className='fr-grid-row space-between-row'>
            <div className='fr-col-md-5 verbatim-card'>
              <Image src='/images/bal-landing-page/verbatim.svg' alt='icone verbatim' width={30} height={30} />
              <p>« Je m’attendais à un outil un peu indigeste. Et il est d’une simplicité à toute épreuve. Il est facile de se connecter, de suivre un webinaire - et même, nul besoin de webinaire, car l’outil est très simple d’utilisation. S’il existait déjà une adresse au niveau national, il les remonte et on vérifie, on valide avant de passer à la suivante. Cela permet surtout d’ajouter les lieux dits, ce qui est très important. Les adresses, avec les lieux-dits, seront utilisées par tous les secours. »</p>
              <div>Judith Ardon Pernet, maire de Nogaret</div>
              <a href='https://adresse.data.gouv.fr/blog/les-bases-adresses-locales-pivot-de-la-transition-numerique-des-communes'>Consulter l&apos;article entier</a>
            </div>
            <div className='fr-col-md-5 verbatim-card'>
              <Image src='/images/bal-landing-page/verbatim.svg' alt='icone verbatim' width={30} height={30} />
              <p>« J’ai vérifié les numérotations et corrigé les fautes d’orthographe. Il est vrai qu’en Bretagne, l’orthographe est un peu particulière, pas toujours compatible avec les usages classiques de la langue française. Nous utilisons les apostrophes comme à « Kerflec’h », avec le « c’h ». C’est ainsi, c’est l’orthographe du mot, elle figure d’ailleurs sur les panneaux. Je souhaitais surtout procéder à ces corrections une seule fois, ne plus avoir à y revenir. J’ai ouvert à nouveau ma Base Adresse Locale afin de réaliser associer les adresses aux numéros de parcelles : il s’agit surtout d’une opération complémentaire. Bien entendu, nous effectuerons les mises à jour lors de nouvelles constructions. »</p>
              <div>Joël Marivain, maire de Kerfourn</div>
              <a href='https://adresse.data.gouv.fr/blog/lassociation-des-maires-du-morbihan-mobilise-les-communes-sur-leurs-adresses'>Consulter l&apos;article entier</a>
            </div>
          </div>
        </div>
      </section>

      <section style={{background: 'var(--blue-france-975-75)'}}>
        <div className='fr-container fr-py-5w'>
          <div className='fr-grid-row'>
            <h2>Créer sa Base Adresse Locale</h2>
            <div className='fr-grid-row space-between-row'>
              <div className='fr-col-md-5 cta-card'>
                <h3>En autonomie</h3>
                <p>Notre outil <strong>Mes Adresses</strong> vous permet de vous lancer, gratuitement et sans compétences techniques.</p>
                <Button onClick={() => navigateTo('https://mes-adresses.data.gouv.fr/')} type='button' style={{color: 'white'}}>Créer la base de ma commune</Button>
                <p style={{marginTop: '1.5rem'}}>Vous disposez déjà d&apos;un SIG? Rendez-vous sur :<br /><Link href='/gerer-mes-adresses' className='fr-link--icon-right fr-icon-arrow-right-line fr-link'>Gérer mes adresses</Link></p>
              </div>
              <div className='fr-col-md-5 cta-card'>
                <h3>Avec accompagnement</h3>
                <p>Nos partenaires labellisés Charte de la Base Adresse Locale  vous proposent un accompagnement ou des outils adaptés à votre territoire.</p>
                <Link href='/bases-locales/charte#recherche-partenaires' className='fr-link--icon-right fr-icon-arrow-right-line fr-link'>Trouver un partenaire dans mon département</Link>
                <p style={{marginTop: '1em'}}>Différents types <strong>d&apos;organismes à but non lucratif</strong> peuvent vous accompagner dans la confection de votre Base Adresse Locale, découvrez les via une <strong>carte interactive</strong>.</p>
                <Link target='_blank' href='https://umap.openstreetmap.fr/en/map/partenaires-publics-de-la-charte-de-la-base-adress_953281#6/47.354/9.229' className='fr-link--icon-right fr-icon-arrow-right-line fr-link'>Découvrir nos partenaires</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .improve-quality-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .action-list > div {
          display: flex;
          align-items: center;
          margin: 20px 0;
        }

        .action-number {
          font-size: 60px;
          font-weight: bold;
          color: var(--blue-france-main-525);
          padding: 0 10px;
          flex-basis: 70px;
        }

        .action {
          margin-left: 20px;
        }

        .action > h4 {
          margin-bottom: 0;
        }

        .action > p {
          margin-bottom: 5px;
        }

        .image-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .image-wrapper img {
          object-fit: contain;
          max-height: 400px;
        }

        .main-steps-row {
          margin-top: 100px;
          align-items: center;
        }

        .space-between-row {
          justify-content: space-between;
          align-items: center;
        }

        .space-around-row {
          justify-content: space-around;
          align-items: center;
        }

        .align-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .inner-list {
          list-style-type: none;
          margin-left: 0;
          padding-left: 0;
        }

        .inner-list > li {
          margin-bottom: 5px;
        }

        .inner-list > li > .fr-icon-check-line {
          margin-right: 10px;
          color: var(--blue-france-sun-113-625);
        }

        .main-steps-card {
          padding: 30px 20px;
          background-color: var(--blue-france-975-75);
        }

        .cta-card {
          background: white;
          border: 1px solid #DDDDDD;
          padding: 30px;
        }

        .verbatim-card {
          border-left: 1px solid #DDDDDD;
          padding: 10px 30px;
        }

        .verbatim-card > p {
          font-size: 16px;
          font-weight: bold;
        }

        .verbatim-card > div {
          font-size: 12px;
          font-weight: bold;
        }

        .verbatim-card > a {
          font-size: 12px !important;
        }

        @media screen and (max-width: ${theme.breakPoints.laptop}) {
          .hide-mobile {
            display: none;
          }

          .main-steps-card {
          padding: 0;
          background-color: white;
        }

          .main-steps-row {
            margin-top: 20px;
          }

          .verbatim-card:first-of-type {
            margin-bottom: 20px;
          }

          .cta-card:first-of-type {
            margin-bottom: 20px;
          }

          .reasons-list-title {
            text-transform: lowercase;
          }

          .reasons-list-title::before {
            content: 'Pour ';
            text-transform: capitalize;
          }
        }
      `}</style>
    </Page>
  )
}

export async function getServerSideProps() {
  const stats = await getStats()

  return {
    props: {
      stats,
    }
  }
}

ProgrammeBAL.propTypes = {
  stats: PropTypes.object.isRequired,
}

export default ProgrammeBAL

