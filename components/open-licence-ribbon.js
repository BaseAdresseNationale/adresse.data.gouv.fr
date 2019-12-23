import React from 'react'

const OpenLicenceRibbon = () => (
  <div>
    <div className='ribbon'>
      <p className='ribbon-content'>La Base Adresse Nationale est désormais disponible sous Licence Ouverte</p>
    </div>
    <style jsx>{`

      .ribbon-img{
        width: 70px;
      }

      .ribbon{
        display: flex;
        background-color: rgb(180,225,250);
        min-height: 50px;
      }

      .ribbon-content{
        margin: auto;
        text-align: center;
      }
    `}</style>
  </div>
)

export default OpenLicenceRibbon
