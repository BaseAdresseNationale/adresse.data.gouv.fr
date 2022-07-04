import {List, Target} from 'react-feather'

import theme from '@/styles/theme'

import SectionText from '../section-text'
import KnowMoreSection from '../know-more-section'

const knowMoreLinks = [
  {
    title: 'Découvrez le service public de la donnée',
    href: 'https://www.data.gouv.fr/fr/reference'
  },
  {
    title: 'Explorez le site de la Direction Interministérielle du Numérique (DINUM)',
    href: 'https://www.numerique.gouv.fr/dinum/'
  },
  {
    title: 'Lire la décision du Premier ministre sur le pilotage de Base Adresse Nationale',
    href: 'https://www.ccomptes.fr/sites/default/files/2019-03/20190311-refere-S2018-3287-valorisation-donnees-IGN-Meteo-France-Cerema-rep-PM.pdf',
    isFile: true,
  }
]

function Intro() {
  return (
    <div className='section-container'>
      <div className='ban'>
        <SectionText>
          <p>
            La <b>Base Adresse Nationale</b> est l’une des neuf bases de données du service public des données de référence. Elle est la seule base de données d’adresses <b>officiellement reconnue par l’administration</b>.
          </p>

          <p><b>Service numérique d’usage partagé</b> et <b>infrastructure socle</b> sur laquelle sont adossées de nombreuses politiques publiques, elle fait partie du <b>système d’information et de communication de l’État</b> et est à ce titre placée sous la <b>responsabilité du Premier ministre</b>.</p>

          <p>Son <b>pilotage</b> est assuré par la Direction Interministérielle du Numérique (DINUM), qui est chargée d’en définir les modalités de gouvernance et de fonctionnement (à la suite d’une décision du Premier ministre).</p>

          <p>
            Sa <b>construction</b> est assurée grâce à de nombreux partenaires, et en premier lieu par les communes, <b>seules autorités compétentes en terme d’adressage</b>.
          </p>

          <p>
            La <b>Base Adresse Nationale</b> est accessible sous forme de <b>fichiers</b> et d’<b>API</b>.
          </p>
        </SectionText>
      </div>

      <div className='characteristics'>
        <div>
          <h6><List style={{verticalAlign: 'bottom', marginRight: '5px'}} color={theme.primary} alt /> Caractéristiques</h6>
          <ul>
            <li>Producteur : <strong>Etalab</strong></li>
            <li>Licence : <a href='https://www.etalab.gouv.fr/licence-ouverte-open-licence'>Licence Ouverte</a></li>
            <li>Fréquence de mise à jour : <strong>quotidienne</strong></li>
            <li>Couverture : <b>France entière (y compris les collectivités d’outremer)</b></li>
          </ul>
        </div >
        <div>
          <h6> <Target style={{verticalAlign: 'bottom', marginRight: '5px'}} color={theme.primary} alt /> Chiffres clés</h6>
          <ul>
            <li>250 000 lieux-dits (<span className='new'>beta</span>)</li>
            <li>25 millions d’adresses</li>
          </ul>
        </div>
      </div>

      <KnowMoreSection links={knowMoreLinks} />

      <style jsx>{`
        .section-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          align-items: center;
          gap: 4em;
        }

        .ban {
          padding-left: 1em;
          flex: 2;
          min-width: 270px;
        }

        .characteristics {
          background: ${theme.colors.white};
          border: 1px solid whitesmoke;
          flex: 1;
          min-width: 270px;
          padding: 1.5em;
          height: fit-content;
          box-shadow: 0 1px 4px ${theme.boxShadow};
          border-radius: ${theme.borderRadius};
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        h6 {
          margin-bottom: 1em;
        }
      `}</style>
    </div>
  )
}

export default Intro
