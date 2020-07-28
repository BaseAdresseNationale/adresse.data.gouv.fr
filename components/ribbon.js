import React from 'react'
import theme from '../styles/theme'

const Ribbon = () => (
  <div>
    <div className='ribbon'>
      Le <a href='https://adresse.data.gouv.fr/data/docs/guide-bal-v1.0.pdf' target='_blank' rel='noopener noreferrer' >Guide de la Base Adresse Locale</a> est désormais disponible.
    </div>
    <style jsx>{`
      .ribbon {
        text-align: center;
        background-color: rgb(180,225,250);
        color: ${theme.colors.almostBlack};
        font-size: 19px;
        padding: 1em;
      }

      @media (max-width: 700px) {
        img {
          display: none;
        }
      }
    `}</style>
  </div>
)

export default Ribbon
