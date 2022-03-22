/* eslint-disable camelcase */
import {useEffect} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'
import {ArrowLeftCircle} from 'react-feather'

import colors from '@/styles/colors'

import Section from '@/components/section'

function Post({title, published_at, feature_image, html, backLink}) {
  useEffect(() => {
    const audioPlayers = [...document.querySelectorAll('audio')]
    const videoPlayers = [...document.querySelectorAll('video')]
    const dropdownDivs = [...document.querySelectorAll('div.kg-card.kg-toggle-card')]

    function toggleDiv(d) {
      if (d.attributes['data-kg-toggle-state'].value === 'close') {
        d.dataset.kgToggleState = 'open'
        d.children[0].lastChild.lastChild.classList.add('toggled')
      } else {
        d.dataset.kgToggleState = 'close'
        d.children[0].lastChild.lastChild.classList.remove('toggled')
      }
    }

    // Add controls to Vidéo player
    if (videoPlayers.length > 0) {
      videoPlayers.forEach(v => {
        v.setAttribute('controls', true)
      })
    }

    // Add controls to Audio player
    if (audioPlayers.length > 0) {
      audioPlayers.forEach(a => {
        a.setAttribute('controls', true)
      })
    }

    // Add onClick event on Toggle
    if (dropdownDivs.length > 0) {
      dropdownDivs.forEach(d => {
        d.addEventListener('click', () => toggleDiv(d))
      })
    }

    return () => {
      if (dropdownDivs.length > 0) {
        dropdownDivs.forEach(d => {
          d.removeEventListener('click', () => toggleDiv(d))
        })
      }
    }
  }, [html])

  return (
    <Section>
      <Link href={backLink}>
        <a className='blog-back-button'><ArrowLeftCircle size={25} style={{verticalAlign: 'middle', marginRight: '.5em'}} /> Retour</a>
      </Link>

      <div className='blog'>
        <h2>{title}</h2>
        <p><i>Publié le {new Date(published_at).toLocaleDateString('fr-FR')}</i></p>
        {feature_image && (
          <div className='blog-feature-image-container'>
            <Image src={feature_image} layout='fill' objectFit='cover' className='blog-feature-image' />
          </div>
        )}
        <div className='blog-separator' />
        <div dangerouslySetInnerHTML={{__html: html}} /* eslint-disable-line react/no-danger */ />
        <div className='blog-separator' />
      </div>

      <Link href={backLink}>
        <a className='blog-back-button'><ArrowLeftCircle size={25} style={{verticalAlign: 'middle', marginRight: '.5em'}} /> Retour</a>
      </Link>

      <style jsx global>{`
        .blog {
          max-width: 1000px;
          margin: 1em auto;
        }

        .blog-feature-image-container {
          position: relative;
          height: 500px;
          box-shadow: 38px 24px 50px -21px lightGrey;
        }

        .kg-image-card img,
        .kg-product-card img {
          width: auto;
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em auto;
          box-shadow: 38px 24px 50px -21px #C9D3DF;
        }

        .blog-image,
        .blog-feature-image {
          border-radius: 4px;
        }

        .blog-separator {
          border-bottom: 2px solid #0053B3;
        }

        .blog-back-button {
          vertical-align: middle;
          padding: .5em 1em;
        }

        .blog figcaption {
          font-style: italic;
        }

        .blog figure.kg-card {
          text-align: center;
        }

      {/***** Callout Block *****/}

        .kg-callout-card {
          width: 100%;
          display: flex;
          background-color: ${colors.lighterBlue};
          padding: 1.2em;
          border-radius: 3px;
          font-size: 1.3rem;
          margin: 1em auto;
        }

        .kg-callout-emoji {
          margin-right: .5em;
        }

      {/***** Bookmark Block *****/}

        .kg-bookmark-card {
          position: relative;
          width: 100%;
          margin: 1em auto;
        }

        .kg-bookmark-card a.kg-bookmark-container {
          display: flex;
          text-decoration: none;
          border-radius: 3px;
          border: 1px solid rgb(124 139 154/25%);
          overflow: hidden;
          color: inherit;
          text-align: left;
        }

        .kg-bookmark-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          flex-basis: 100%;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 20px;
          overflow: hidden;
        }

        .kg-bookmark-thumbnail {
          position: relative;
          flex-grow: 1;
          min-width: 33%;
        }

        .kg-bookmark-description {
          margin-top: 3px;
          font-size: 14px;
          max-height: 55px;
          overflow-y: hidden;
          opacity: .7;
        }

        .kg-bookmark-metadata {
          display: flex;
          align-items: center;
          margin-top: 22px;
          width: 100%;
          font-weight: 500;
          white-space: nowrap;
        }

        .kg-bookmark-icon {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }

        .kg-bookmark-author {
          padding-right: .5em;
        }

        .kg-bookmark-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 0 2px 2px 0;
        }

      {/***** Gallery Block *****/}

        .kg-gallery-row {
          contain: content;
          display: grid;
          grid-gap: .5em;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        .kg-gallery-image img {
          width: auto;
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: auto;
        }

      {/***** Button Block *****/}

        .kg-align-center {
          text-align: center;
        }

        .kg-button-card a {
          color: white;
          background-color: ${colors.blue};
          border-radius: 5px;
          font-weight: 1em;
          padding: .5em 1.2em;
          height: 2.4em;
          line-height: 1em;
          margin: auto;
          text-decoration: none;
          transition: all .2s ease;
        }

      {/***** Toggle Block *****/}

        .kg-toggle-card {
          background: 0 0;
          box-shadow: inset 0 0 0 1px rgba(124,139,154,.25);
          border-radius: 4px;
          padding: 1.2em;
          margin-bottom: .5em;
        }

        .kg-toggle-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .kg-toggle-heading h4 {
          margin-bottom: 0;
        }

        button.kg-toggle-card-icon {
          background-color: white;
          border: none;
        }

        .toggled {
          transform: rotate(180deg);
        }

        .kg-toggle-content {
          height: auto;
          opacity: 1;
          transition: opacity 1s ease,top .35s ease;
          top: 0;
          position: relative;
        }

        .kg-toggle-card[data-kg-toggle-state="close"] .kg-toggle-content {
          height: 0;
          overflow: hidden;
          transition: opacity .5s ease,top .35s ease;
          opacity: 0;
          top: -.5em;
          position: relative;
        }

      {/***** Video Block *****/}

        .kg-video-container video {
          width: 100%;
          height: 100%;
        }

      {/***** Audio Block *****/}

        .kg-audio-card {
          display: flex;
          width: 100%;
          padding: .5em;
          margin-bottom: 1em;
          min-height: 96px;
          border-radius: 3px;
          box-shadow: inset 0 0 0 1px rgba(124,139,154,.25);
        }

        .kg-audio-player-container {
          display: flex;
          flex-direction: column-reverse;
          width: 100%;
        }

        .kg-audio-player-container audio {
          width: 100%;
          border-radius: 5px;
        }

      {/***** File Block *****/}

        .kg-file-card-container {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          padding: 6px;
          border: 1px solid rgb(124 139 154/25%);
          border-radius: 3px;
          transition: all ease-in-out .35s;
          text-decoration: none;
          width: 100%;
          margin-bottom: 1em;
        }

        .kg-file-card-contents {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin: 4px 8px;
          width: 100%;
        }

        .kg-file-card-metadata {
          display: flex;
          margin-top: 2px;
          padding: 0 0 .5em .5em;
          font-style: italic;
        }

        .kg-file-card-filesize {
          margin-left: 1em;
        }

        .kg-file-card-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          min-width: 80px;
          background-color: ${colors.lighterGrey}
        }

      {/***** Header Block *****/}

        .kg-header-card {
          padding: 4em;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          background-color: black;
          color: white;
          margin-bottom: 1em;
        }

      {/***** Product Block *****/}

        .kg-product-card {
          display: flex;
          align-items: center;
          flex-direction: column;
          width: 100%;
        }

        .kg-product-card-container {
          align-items: center;
          background: 0 0;
          max-width: 550px;
          padding: 20px;
          border-radius: 5px;
          box-shadow: inset 0 0 0 1px rgb(124 139 154/25%);
          margin-bottom: 1em;
        }

      {/***** Card Titles *****/}

        .kg-bookmark-title,
        .kg-audio-title,
        .kg-file-card-title {
          color: #111;
          font-size: 1.3em;
          line-height: 1.1em;
          font-weight: 600;
          padding: .5em;
        }

      {/***** Hidden Elements *****/}

        .kg-audio-player,
        .kg-audio-thumbnail,
        .kg-video-overlay,
        .kg-video-large-play-icon,
        .kg-video-player,
        .kg-video-player-container,
        .kg-video-play-icon svg {
          display: none;
        }

      {/***** Icons *****/}

        .kg-toggle-card-icon svg,
        .kg-file-card-icon svg {
          height: 24px;
          width: 24px;
        }
      `}</style>
    </Section>
  )
}

Post.defaultProps = {
  feature_image: null
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  published_at: PropTypes.string.isRequired,
  feature_image: PropTypes.string,
  html: PropTypes.string.isRequired,
  backLink: PropTypes.string.isRequired
}

export default Post
