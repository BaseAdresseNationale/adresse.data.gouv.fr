import PropTypes from 'prop-types'
import Link from 'next/link'
import {ArrowLeft, Check} from 'react-feather'

import theme from '@/styles/theme'
import Button from '@/components/button'
import router from 'next/router'

function Published({codeCommune}) {
  return (
    <div>
      <div className='published'>
        <div className='header'>
          <div className='valid'><Check size={45} /></div>
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
            <p>
              Vos adresses seront intégrées à la Base Adresse Nationale et disponibles dans un délai de <b>24 heures</b>.<br />{}
              Elles seront consultables directement depuis notre <Link href={`/base-adresse-nationale/${codeCommune}`}><a>carte interactive</a></Link>.
            </p>
          </section>

          <section>
            <h4>🚀 Ne vous arrêtez pas en si bon chemin !</h4>
            <p>
              Si vous souhaitez <b>mettre à jour</b> vos adresses ou effecter des <b>corrections</b>, continuer simplement l‘édition de cette Base Adresse Locale.<br />{}
              Les changements seront <b>enregistrés automatiquement</b> et transmis à la Base Adresse Nationale.
            </p>
          </section>

          <section>
            <h4>🇫🇷 Vous n’êtes pas seul</h4>
            <p>
              <b>Tous les jours</b> de nouvelles Bases Adresse Locales viennent alimenter la Base Adresse Nationale comme vous venez de le faire.<br />{}
              Découvrez l’état du <Link href='/bases-locales'><a>déploiement des Bases Adresse Locales</a></Link> à l’échelle nationale.
            </p>
          </section>
        </div>
      </div>

      <Button style={{marginTop: '1em'}} onClick={() => router.push('/bases-locales/publication')}>
        <ArrowLeft style={{verticalAlign: 'top'}} /> Publier une autre Base Adresse Locale
      </Button>

      <style jsx>{`
        section {
          margin: 3em 0;
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
