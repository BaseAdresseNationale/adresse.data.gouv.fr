import React from 'react'
import theme from '@/styles/theme'

function IncendieOvh() {
  return (
    <div>
      <div className='incendie-ovh'>
        <div className='intro'>
          <h4>Incident en cours</h4>
          <div>
            <p>
              En raison d’un incendie majeur ayant affecté le centre de données hébergeant une partie de notre infrastructure, <b>l’outil “Mes Adresses” est actuellement inaccessible</b>.
            </p>
            <p>Il sera rétabli en <b>début de semaine prochaine</b>. Merci de votre compréhension.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
      .incendie-ovh {
        font-size: 19px;
        padding: 1em;
        color: ${theme.colors.almostBlack};
        background-color: ${theme.colors.lighterBlue};
      }

      .bold {
        font-weight: 600;
        font-size: smaller;
      }

      ul {
        font-size: medium;
      }

      .intro {
        text-align: center;
      }

      .tweeter {
        margin-top: 2em;
        font-size: medium;
      }
    `}</style>
    </div>
  )
}

export default IncendieOvh
