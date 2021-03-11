import React from 'react'
import theme from '@/styles/theme'

function IncendieOvh() {
  return (
    <div>
      <div className='incendie-ovh'>
        <div className='intro'>
          <h4>Incident en cours</h4>
          <div>
            <b>
              Plusieurs de nos outils et services sont actuellement indisponibles suite à un incendie majeur chez notre hébergeur.
              Nous travaillons à les rétablir dans les meilleurs délais.
            </b>
          </div>
        </div>
        <div className='bold'>Services indisponibles :</div>
        <ul>
          <li>Éditeur de Bases Adresses Locales mes-adresses.data.gouv.fr</li>
          <li>Moissonnage et consolidation automatique des Bases Adresses Locales</li>
          <li>Mise à jour en continu de la Base Adresse Nationale</li>
        </ul>

        <div className='bold'>
          L’API Adresse (géocodage) et l’API Découpage administratif n’ont pas été impactées.
          Les fonds de carte, indisponibles une partie de la journée du 10 mars, ont été rétablis.
        </div>

        <div className='tweeter'>
          Suivre la résolution de l’incident : <a href='https://twitter.com/AdresseDataGouv'>https://twitter.com/AdresseDataGouv</a>
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
