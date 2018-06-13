import PropTypes from 'prop-types'
import FaCheckSquareO from 'react-icons/lib/fa/check-square-o'

import Section from '../section'
import ButtonLink from '../button-link'

import BaseAdresseLocale from '../../components/bases-locales/bases-adresse-locales/base-adresse-locale'

const BasesLocales = ({datasets}) => (
  <div>
    <Section background='white'>
      <div className='intro'>
        <p>La <b>création des voies et des adresses</b> en France est du ressort des <b>communes</b>, via le conseil municipal.<br />
        Cette compétence est <b>régulièrement déléguée à un EPCI</b>.</p>
        <p>Une <b>base Adresse locale</b> est donc l’expression de cette compétence, et regroupe tout ou partie des adresses d’une collectivité.<br />
        Elle est <b>publiée sous sa responsabilité</b>.</p>
        <p>Ces bases de données ont vocation à <b>alimenter les bases nationales</b>, et en particulier la Base Adresse Nationale.</p>
      </div>
    </Section>

    <Section background='grey'>
      <h4>Qu’est-ce que le format BAL ?</h4>
      <div className=''>
        <p>L’<a href='http://www.aitf.fr/'>Association des Ingénieurs Territoriaux de France</a> (AITF) a créé en avril 2015 un groupe de travail portant sur la Base Adresse Nationale.</p>
        <p>Les <a href='https://cms.geobretagne.fr/content/travaux-gt-ban-aitf'>travaux de ce groupe</a> ont abouti à la <a href='https://cms.geobretagne.fr/sites/default/files/documents/aitf-sig-topo-adresse-fichier-echange-simplifie-v_1.1_0.pdf'>spécification d’un format d’échange</a>, aujourd’hui en version 1.1.</p>
        <p>Le format <b>BAL 1.1</b> est aujourd’hui le format d’échange à privilégier pour les données Adresse produites localement.</p>
      </div>
      <div className='action'>
        <ButtonLink href='/bases-locales/validateur'>Valider vos données au format BAL <FaCheckSquareO /></ButtonLink>
      </div>
    </Section>

    <Section title='Quelques bases locales déjà publiées' background='white'>
      {datasets.slice(0, 3).map(dataset => (
        <BaseAdresseLocale key={dataset.id} {...dataset} />
      ))}
      <div className='centered'>
        <ButtonLink href='/bases-locales/jeux-de-donnees'>
          Voir toutes les bases locales
        </ButtonLink>
      </div>
    </Section>
    <style jsx>{`
      .intro {
        text-align: left;
      }

      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        width: 100%;
      }

      .row .column {
        margin: 0 2em;
        max-width: 50em;
      }

      .row .column + .column {
        margin-left: 2em;
      }

      @media (max-width: 749px) {
        .row {
          flex-direction: column;
        }

        .row .column:not(:last-child) {
          margin-bottom: 2em;
        }

        .row p + p {
          text-align: center;
          margin-top: 1em;
        }
      }

      .action {
        display: flex;
        margin-top: 3em;
      }

      .centered {
        display: flex;
        justify-content: center;
      }

      a {
        text-align: center;
        text-decoration: underline;
      }
      `}</style>
  </div>
)

BasesLocales.propTypes = {
  datasets: PropTypes.array.isRequired
}

export default BasesLocales
