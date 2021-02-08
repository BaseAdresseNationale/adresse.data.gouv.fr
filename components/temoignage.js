import React from 'react'
import Image from 'next/image'

import PropTypes from 'prop-types'

function Temoignage({temoignage}) {
  return (
    <div className='temoignage-container'>
      <h4 className='temoignage-title'>{temoignage.title}</h4>
      <div className='temoignage-image-container'>
        <Image src={temoignage.picture} alt={temoignage.alt} layout='fill' className='temoignage-image' />
      </div>
      <div className='date-container'>
        <p>{temoignage.date}</p>
        <div className='separator' />
      </div>
      <p className='preview'>{temoignage.preview}</p>
      <div>
        <a href={temoignage.article_url} target='_blank' rel='noreferrer'>Lire le témoignage</a>
      </div>

      {/* Issue en cours sur GH NextJS : impossible de passer la classe d'un composant Image en dehors d'une balise style jsx globale ===> https://github.com/vercel/next.js/issues/18585 */}
      <style global jsx>{`
          .temoignage-image{
            border-radius: 4px;
          }
      `}</style>
      {/* ------------------------------------------ */}

      <style jsx>{`
          .temoignage-container{
            display: grid;
            grid-template-rows: 1fr 150px 15% 1fr 5%;
          }

          .temoignage-title{
            font-size: 1.2em;
            margin-bottom: 0.5em;
            display: flex;
            align-items: flex-end;
            justify-content: center;
          }

          .temoignage-image-container{
            position: relative;
          }

         .date-container{
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .date-container p {
              margin: 0;
              font-size: 0.8em;
              font-style: italic;
          }

          .separator{
            border: 1px solid #2053B3;
            width: 80%;
          }

          .preview{
              margin: 0;
              text-align: left;
          }

          a{
              margin: 0;
          }
        `}</style>
    </div>
  )
}

Temoignage.propTypes = {
  temoignage: PropTypes.object.isRequired
}

export default Temoignage
