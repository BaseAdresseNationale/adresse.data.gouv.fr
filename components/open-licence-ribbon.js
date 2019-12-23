import React from 'react'
import theme from '../styles/theme'

const OpenLicenceRibbon = () => (
  <div className='ribbon'>
    <p className='ribbon-content'>La Base Adresse Nationale est désormais disponible sous licence ouverte</p>
    <style jsx>{`
      .ribbon{
        display: flex;
        background-color: rgb(0,59,128);
        border-radius: 5px;
        margin: 1em auto;
        min-height: 50px;
        max-width: 600px;
        border: 1px solid ${theme.borderActive};
        box-shadow: 1px 2px 5px ${theme.primary};
      }
      
      .ribbon-content{
        margin: auto;
        text-align: center; 
        color: ${theme.colors.white};
      }
    `}</style>
  </div>
)

export default OpenLicenceRibbon
