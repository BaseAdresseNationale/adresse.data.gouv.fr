import React from 'react'
import theme from '@/styles/theme'

function IncendieOvh() {
  return (
    <div>
      <div className='incendie-ovh-alt'>
        <div className='intro'>
          <h4>Incident en cours</h4>
          <div>
            <b>Plusieurs de nos outils et services sont actuellement injoignables en raison d’un incendie majeur chez notre hébergeur.
              Nous travaillons à rétablir nos services par ordre de priorité.</b>
          </div>
        </div>
        <ul>
          <li>
            <b>Mise à jour 10/03/2021 à 8h50 :</b> Actuellement nous pouvons dire que #MesAdresses et le service de fonds de carte sont touchés.
          </li>
          <li>
            <b>Mise à jour 10/03/2021 à 9h06 :</b> L’API Adresse (géocodage) et l’API Géo Découpage administratif n’ont pas été impactées.
          </li>
        </ul>

        <div className='tweeter'>
          Suivre la résolution de l’incident : <a href='https://twitter.com/AdresseDataGouv'>https://twitter.com/AdresseDataGouv</a>
        </div>
      </div>

      <style jsx>{`
      .incendie-ovh {
        color: ${theme.colors.almostBlack};
        font-size: 19px;
        padding: 1em;
        border: 1px solid ${theme.colors.orange};
        background-color: ${theme.colors.lightOrange};
        color: ${theme.colors.orange};
      }

      .incendie-ovh-alt {
        font-size: 19px;
        padding: 1em;
        color: ${theme.colors.almostBlack};
        background-color: ${theme.colors.lighterBlue};
      }

      ul {
        margin: 2em 0;
        font-size: medium;
      }

      .intro {
        text-align: center;
      }

      .tweeter {
        margin-top: 1em;
        font-size: medium;
      }
    `}</style>
    </div>
  )
}

export default IncendieOvh
