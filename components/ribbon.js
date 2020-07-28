import React from 'react'
import theme from '../styles/theme'

const Ribbon = () => (
  <div>
    <div className='ribbon'>
      <div>Le guide Base Adresse Nationale est désormais disponible :</div>
      <div>
        <a href='https://adresse.data.gouv.fr/data/docs/guide-bal-v1.0.pdf' target='_blank' rel='noopener noreferrer' >Téléchargez</a>
      </div>
    </div>
    <style jsx>{`
      .ribbon{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background-color: rgb(180,225,250);
        min-height: 80px;
        color: ${theme.colors.almostBlack};
        font-size: 19px;
        padding: 1em;
      }

      .ribbon div {
        text-align: center;
        margin: .2em;
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
