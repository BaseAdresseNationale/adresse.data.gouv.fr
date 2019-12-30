import React from 'react'
import theme from '../styles/theme'

const OpenLicenceRibbon = () => (
  <div>
    <div className='ribbon'>
      <div>La Base Adresse Nationale est désormais disponible sous <a href='https://www.etalab.gouv.fr/licence-ouverte-open-licence'>Licence Ouverte</a></div>
      <img src='/images/logos/logo-licence-ouverte.svg' title='Logo Licence Ouverte' alt='Logo Licence Ouverte' />
    </div>
    <style jsx>{`

      .ribbon img{
        width: 30px;
        margin-left: 0.5em;
        align-content: center;
      }

      .ribbon{
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(180,225,250);
        min-height: 80px;
        color: ${theme.colors.almostBlack};
        font-size: 19px;
        padding: 1em;
      }

      .ribbon-content{
        text-align: center;
      }

      @media (max-width: 700px) {
        img {
          display: none;
        }
      }
    `}</style>
  </div>
)

export default OpenLicenceRibbon
