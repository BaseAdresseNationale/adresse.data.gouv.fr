import React from 'react'
import Image from 'next/image'

import PropTypes from 'prop-types'

function Temoignage({temoignage}) {
  const localDate = new Date(temoignage.date).toLocaleDateString('fr-FR')

  return (
    <div className='temoignage-container'>
      <h4 className='temoignage-title'>{temoignage.title}</h4>
      <div className='temoignage-image-container'>
        <Image src={temoignage.picture} alt={temoignage.alt} layout='fill' className='temoignage-image' />
      </div>
      <div className='date-container'>
        <p>Le {localDate}</p>
        <div className='separator' />
      </div>
      <p className='preview'>{temoignage.preview}</p>
      <div className='blog-link-container'>
        <a href={temoignage.article_url} target='_blank' rel='noreferrer'>Lire le témoignage</a>
      </div>

      <style global jsx>{` // Issue en cours sur GH NextJS : impossible de passer la classe d'un composant Image en dehors d'une balise style jsx globale ===> https://github.com/vercel/next.js/issues/18585
          .temoignage-image {
            border-radius: 4px;
            object-fit: cover;
          }
      `}</style>

      <style jsx>{`
          .temoignage-container {
            display: grid;
            grid-template-rows: 1fr 150px 15% 1fr 5%;
            text-align: left;
            margin-top: 1.5em;
          }

          .temoignage-title {
            font-size: 1.2em;
            margin-bottom: 0.5em;
            display: flex;
            align-items: flex-end;
          }

          .temoignage-image-container {
            position: relative;
            box-shadow: 38px 24px 50px -21px rgba(119,117,117,0.30);
          }

         .date-container {
            display: flex;
            flex-direction: column;
            text-align: right;
          }

          .date-container p {
              margin: 0;
              font-size: 0.8em;
              font-style: italic;
          }

          .separator {
            border: 1px solid #2053B3;
            width: 100%;
          }

          .preview {
              margin: 0;
              text-align: left;
          }

         .blog-link-container {
              margin-top: 0.6em;
          }
        `}</style>
    </div>
  )
}

Temoignage.propTypes = {
  temoignage: PropTypes.object.isRequired
}

export default Temoignage
