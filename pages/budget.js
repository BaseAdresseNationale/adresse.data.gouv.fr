import {Fragment} from 'react'
import Link from 'next/link'

import Page from '@/layouts/main'
import Section from '@/components/section'
import WipSection from '@/components/wip-section'

const budgetFormatter = value => {
  return Number.isNaN(value) ?
    value :
    `${value.toLocaleString(
      undefined, {minimumFractionDigits: 0}
    ).replace(/000$/g, 'K')}`
}

const keyLegend = {
  BAN: 'Base Adresses Nationale (BAN)',
  BAL: 'Base Adresses Locales (BAL)',
}

const dataBudget = {
  2023: {
    BAN: {
      info: 'En 2023 le budget de l’équipe est évalué à 1 192 000 €. L’IGN et la DINUM partagent le financement de cette équipe dédiée à la construction de la Base Adresse Nationale.',
      values: {
        Développement: [0, 0],
        Déploiement: [0, 0],
        'Logiciel hébergement': [0, 0],
        'Total HT': [0, 0],
        'Total TTC': [0, 0],
      },
    },
    BAL: {
      info: 'En 2023 le budget de l’équipe est évalué à XXX €. L’ANCT et la DINUM partagent le financement de cette équipe dédiée au projet Base Adresse Local.',
      values: {
        Développement: [0, 0],
        Déploiement: [0, 0],
        'Logiciel hébergement': [0, 0],
        'Total HT': [0, 0],
        'Total TTC': [0, 0],
      },
    }
  }
}

function StatsPage() {
  return (
    <Page title='Budget'>
      <WipSection>
        La page que vous visitez est actuellement en cours de construction.
        Les informations qui y sont présentées sont susceptibles d’évoluer, d’être incomplètes ou erronées.
        Nous vous remercions de votre compréhension.
      </WipSection>

      <Section>
        <h1>Budget</h1>
        <p>
          La <b>Base Adresse Nationale (BAN)</b> est un service public numérique, c’est pourquoi nous sommes transparents
          sur les ressources allouées et la manière dont elles sont employées.
        </p>

        <p className='section-footer-notes'>
          <i>Ces données étant en cours de construction, elles peuvent, dans certains cas, être incomplètes. <br />
            Nous vous remercions de votre compréhension.</i>
        </p>
      </Section>

      <Section background='grey' className='key-number-section'>
        <h2>Principes</h2>
        <p>
          Nous suivons le <Link href='https://beta.gouv.fr/manifeste' target='_blank'>manifeste beta.gouv</Link> dont
          nous rappelons les principes ici :
        </p>

        <ul>
          <li>Les besoins des utilisateurs sont prioritaires sur les besoins de l’administration</li>
          <li>Le mode de gestion de l’équipe repose sur la confiance</li>
          <li>L’équipe adopte une approche itérative et d’amélioration en continu</li>
        </ul>

      </Section>

      <Section>
        <h2>Budget consommé</h2>
        <p><b>● Année : {2023}</b></p>

        <div className='table-container'>
          {
            Object.entries(dataBudget['2023']).map(([projectName, projectData]) => (
              <Fragment key={projectName}>
                <p className='info-budget'>
                  {projectData.info}
                </p>

                <table className='table table-budget'>
                  <thead>
                    <tr>
                      <th className='td-budget-headline'>{keyLegend?.[projectName] || projectName}</th>
                      <th className='td-separator' />
                      <th className='td-budget-numeric'>1er semestre</th>
                      <th className='td-budget-numeric'>2ème semestre</th>
                      <th className='td-budget-numeric'>total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      Object.entries(projectData.values)
                        .map(([label, values]) => {
                          return (
                            <tr key={label}>
                              <th className='td-budget-headline'>{label}</th>
                              <td className='td-separator' />
                              <td className='td-budget-numeric'>{budgetFormatter(values[0])}</td>
                              <td className='td-budget-numeric'>{budgetFormatter(values[1])}</td>
                              <td className='td-budget-numeric'>{budgetFormatter(values[0] + values[1])}</td>
                            </tr>
                          )
                        })
                    }
                  </tbody>
                </table>
              </Fragment>
            )
            )
          }
        </div>
      </Section>

      <Section>
        <h2>Description des catégories</h2>

        <h3>Déploiement et développement</h3>
        <p>
          Les coûts de développement représentent la grande majorité de notre budget. Nous sommes une petite équipe
          de développeurs composée d’agents publics et de freelances, pluridisciplinaires aussi bien sur les aspects techniques,
          stratégiques et métiers. Les rémunérations des intervenants en freelance suivent
          la <Link href='https://doc.incubateur.net/communaute/gerer-sa-startup-detat-ou-de-territoires-au-quotidien/decouvrir-les-differents-metiers-dune-startup-detat/recrutement/conseils-pour-le-recrutement/observatoire-revenus#la-grille-indicative-des-revenus-observes' target='_blank'>grille
            de beta.gouv</Link>.
        </p>

        <h3>Logiciel et hébergement</h3>
        <p>
          Notre modèle open-source nous permet d’accéder gratuitement à la majorité des outils que nous utilisons
          (hébergement de code, serveurs de tests, etc.). Le site est hébergé
          chez <Link href='https://www.ovhcloud.com/fr/' target='_blank'>OVH</Link>.
        </p>

        <h3>Portage</h3>
        <p>
          La marge du porteur attributaire
          du <Link href='https://doc.incubateur.net/communaute/gerer-sa-startup-detat-ou-de-territoires-au-quotidien/decouvrir-les-differents-metiers-dune-startup-detat/recrutement/marches-publics-beta.gouv.fr/marche-interministeriel-beta' target='_blank'>marché
            public de la DINUM</Link>,
          ainsi que les coûts liés à la société
          spécialement créée pour effectuer le portage des indépendants qui travaillent pour le service (administration,
          comptabilité, facturation, impôts, etc.).
        </p>

        <div className='fr-notice fr-notice--info'>
          <div className='fr-container'>
            <div className='fr-notice__body'>
              <h4>A propos de la TVA</h4>
              <p>
                Contrairement aux entreprises du secteur privé, les administrations ne peuvent pas récupérer la TVA supportée sur
                leurs achats dans le cadre de leur activité.<br />
                Le montant TTC inclut la TVA au taux de 20%.<br />
                La TVA est collectée et reversée à l’État et diminue donc le montant du budget utilisable sur le projet.
              </p>

            </div>
          </div>
        </div>
      </Section>

      <style jsx>{`
        :global(.section.section-work-in-progress) {
          font-weight: 900;
          color: #fff;
          background: #555;
        }
        :global(.section.section-work-in-progress) .warn-icon {
          color: #f60700;
          float: left;
          margin: 0 2em 0 0;
          transform: scale(1.5);
          transform-origin: top left;
        }

        .table-container {
          overflow-x: auto;
          box-sizing: border-box;
          overflow-x: auto;
          box-sizing: border-box;
          width: calc(100% + 4rem);
          position: relative;
          padding: 0 2rem;
          left: -2rem;
        }
        .info-budget {
          position: sticky;
          left: 0;
        }
        .table-budget {
          min-width: 800px;
        }
        .table-budget:not(:last-child) {
          margin: 0 0 3rem;
        }
        .table-budget thead th {
          vertical-align: top;
        }
        .table-budget .td-budget-headline {
          min-width: min(78vw, 350px);
          position: relative;
        }
        .table-budget tbody .td-budget-headline {
          border-top: 1px solid #ebeff3;
          border-top: 1px solid var(--lighter-grey);
        }
        .table-budget .td-budget-headline:after {
          content: '';
          display: block;
          width: 1px;
          background-color: #ebeff3;
          background-color: var(--lighter-grey);
          position: absolute;
          top: 1rem;
          right: 0;
          bottom: 1rem;
        }
        .table-budget .td-separator {
          width: 100%;
        }
        .table-budget .td-budget-numeric {
          width: auto;
          text-align: right;
          white-space: nowrap;
          min-width: 8em;
        }
        .table-budget td.td-budget-numeric::after {
          content: " €";
        }

        .section-footer-notes {
          font-size: 0.75em;
          line-height: 1.5;
          list-style: none;
          padding-left: 0;
        }
      `}</style>

    </Page>
  )
}

export default StatsPage
