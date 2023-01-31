import PropTypes from 'prop-types'
import {ArrowLeft, Check} from 'react-feather'

import theme from '@/styles/theme'
import ButtonLink from '@/components/button-link'

function Published({codeCommune}) {
  return (
    <div>
      <div className='published'>
        <div className='header'>
          <div className='valid'><Check size={45} alt='' aria-hidden='true' /></div>
          <h1>Votre Base Adresse Locale a bien été publiée !</h1>
        </div>

        <div className='message-container'>
          <section>
            <h4>✨ Un réel bénéfice pour votre commune</h4>
            <p>
              Les adresses de votre commune sont <b>maintenant à jour</b> et viennent alimenter <b>les référentiels nationaux</b>.<br />{}
              Il est désormais plus simple pour vos administrés d’être&nbsp;:
            </p>
            <ul>
              <li><span>⚡️</span>Déclarés auprès des fournisseurs d’eau et d’énergies</li>
              <li><span>🖥</span>Éligibles à la fibre</li>
              <li><span>📦</span>Livrés</li>
              <li><span>🚑</span>Ou même secourus</li>
            </ul>
          </section>

          <section>
            <h4>🔍 Où consulter vos adresses ?</h4>
            <div className='consult-adresses'>
              <div>
                <p>
                  Vos adresses seront intégrées à la <b>Base Adresse Nationale</b> et disponibles d’ici <b>quelques heures</b>.<br />
                  Elles seront consultables directement depuis notre <b>carte interactive</b>.
                </p>
                <ButtonLink href={`/base-adresse-nationale/${codeCommune}`}>Consulter la Base Adresse Nationale</ButtonLink>
              </div>

              <div>
                <p>Vous pourrez suivre <b>l’état de vos adresses</b> sur la page d’information par la commune et télécharger la <b>Base Adresse Nationale</b> de votre commune</p>
                <ButtonLink href={`/commune/${codeCommune}`}>Consulter la page commune</ButtonLink>
              </div>
            </div>
          </section>

          <section>
            <h4>🚀 Continuez l’édition de cette Base Adresse Locale</h4>
            <p>
              Pour <b>mettre à jour</b> vos adresses, il vous suffit de déposer un nouveau fichier .csv dans le formulaire. Il remplacera le précédent et sera transmis à la <b>Base Adresse Nationale</b>.
            </p>
          </section>

          <section>
            <h4>🇫🇷 Vous n’êtes pas seul</h4>
            <p>
              <b>Tous les jours</b> de nouvelles Bases Adresse Locales viennent alimenter la Base Adresse Nationale comme vous venez de le faire.<br />
              Découvrez l’état du <b>déploiement des Bases Adresse Locales</b> à l’échelle nationale.
            </p>
            <ButtonLink href='/deploiement-bal'>Carte de couverture des BAL</ButtonLink>
          </section>
        </div>
      </div>

      <ButtonLink style={{marginTop: '1em'}} href='/bases-locales/publication'>
        <ArrowLeft style={{verticalAlign: 'top'}} alt='' aria-hidden='true' /> Publier une autre Base Adresse Locale
      </ButtonLink>

      <style jsx>{`
        section {
          margin: 2em 0;
          padding: 0 1em;
          text-align: center;
        }

        h4 {
          margin: 0;
        }

        ul {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          list-style-type: none;
          gap: 10px;
        }

        li {
          display: flex;
          gap: 10px;
          text-align: left;
        }

        .published {
          background: ${theme.successBg};
          padding: 2em;
        }

        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;
          color: ${theme.successPublish};
        }

        .valid {
          border-radius: 100%;
          background: ${theme.successPublish};
          color: #fff;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: xx-large;
        }

        .consult-adresses div {
          margin: 1.5em 0;
        }

        .message-container {
          background-color: #fff;
          margin: 1em 0;
          padding: 1em;
        }

        .centered {
          display: flex;
          justify-content: center;
        }

        .message-container section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
    </div>
  )
}

Published.propTypes = {
  codeCommune: PropTypes.string.isRequired
}

export default Published
