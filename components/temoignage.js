import Image from 'next/image'
import PropTypes from 'prop-types'

import colors from '@/styles/colors'

function Temoignage({testimony}) {
  const {title, picture, alt, preview, articleUrl, date} = testimony
  const localDate = new Date(date).toLocaleDateString('fr-FR')

  return (
    <div className='temoignage-container'>
      <h4 className='temoignage-title'>{title}</h4>
      <div className='temoignage-image-container'>
        <Image src={picture} alt={alt} layout='fill' className='temoignage-image' />
      </div>
      <div className='date-container'>
        <p>Le {localDate}</p>
        <div className='separator' />
      </div>
      <p className='preview'>{preview}</p>
      <div className='blog-link-container'>
        <a href={articleUrl} target='_blank' rel='noreferrer'>Lire le témoignage</a>
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
            grid-template-rows: 50px 150px 35px 1fr 0.5fr;
            text-align: left;
            margin-top: 3em;
          }

          .temoignage-title {
            font-size: 1.2em;
            margin-bottom: 0.5em;
            display: flex;
            align-items: flex-end;
          }

          .temoignage-image-container {
            position: relative;
            box-shadow: 38px 24px 50px -21px ${colors.lightGrey};
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
              border-bottom: 2px solid ${colors.blue};
          }

          .preview {
              margin: 0;
              text-align: left;
              font-style: italic;
          }

         .blog-link-container {
              margin-top: 0.6em;
          }
        `}</style>
    </div>
  )
}

Temoignage.propTypes = {
  testimony: PropTypes.shape({
    title: PropTypes.string,
    picture: PropTypes.string,
    alt: PropTypes.string,
    preview: PropTypes.string,
    articleUrl: PropTypes.string,
    date: PropTypes.string
  }).isRequired
}

export default Temoignage
