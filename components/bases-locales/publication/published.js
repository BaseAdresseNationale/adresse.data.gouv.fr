import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '@/styles/theme'

const Published = React.memo(({commune}) => {
  return (
    <div className='published'>
      <div className='header'>
        <h1>Votre Base Adresse Locale a bien été publiée !</h1>
        <div className='valid'>✓</div>
      </div>

      <div className='message-container'>
        <section>
          <h4>✨ Un réel bénéfice pour votre commune</h4>
          <p>
            Les adresses de votre commune sont <b>maintenant à jour</b> et viennent alimenter <b>les référentiels nationaux</b>.<br />{}
            Il est désormais plus simple pour vos administrés d’être&nbsp;:
            <ul>
              <li>⚡️ déclarés auprès des fournisseurs d’eau et d’énergies</li>
              <li>🖥 éligibles à la fibre</li>
              <li>📦 livrés</li>
              <li>🚑 ou même secourus</li>
            </ul>
          </p>
        </section>

        <section>
          <h4>🔍 Où consulter vos adresses ?</h4>
          <p>
            Vos adresses seront intégrées à la Base Adresse Nationale et disponibles dans un délai de <b>24 heures</b>.<br />{}
            Elles seront consultables directement depuis notre <Link href={`/base-adresse-nationale/${commune.code}`}><a>carte interactive</a></Link>.
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
          justify-content: center;
          list-style-type: none;
        }

        .published {
          background: ${theme.successBg};
          padding: 2em;
        }

        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: ${theme.successBorder};
        }

        .valid {
          border-radius: 100%;
          background: ${theme.successBorder};
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
      `}</style>
    </div>
  )
})

Published.propTypes = {
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired
  }).isRequired
}

export default Published
