import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import {ExternalLink} from 'react-feather'

import theme from '@/styles/theme'
import ButtonLink from '@/components/button-link'

function Commune({name, codeCommune, picture, height, width, signatureDate, charteURL}) {
  const date = new Date(signatureDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})

  return (
    <div className='commune-container' onClick={event => event.stopPropagation()}>
      <div className='commune-infos'>
        <Image src={picture} height={height / 2} width={width / 2} alt aria-hidden='true' />
        <Link href={`/commune/${codeCommune}`} aria-label={`Aller sur la page commune de ${name}`}>{`${name} - ${codeCommune}`}</Link>
      </div>
      <div className='signature-date'>Partenaire depuis le <b>{date}</b></div>
      {charteURL && (
        <ButtonLink href={charteURL} isExternal target='_blank' label={`Voir la charte de ${name}`}>
          Voir la charte <ExternalLink size={20} style={{verticalAlign: 'sub'}} alt='Lien externe' />
        </ButtonLink>
      )}

      <style jsx>{`
        .commune-container {
          display: flex;
          justify-content: space-between;
          flex-flow: wrap;
          gap: 1em;
          align-items: center;
          background: ${theme.colors.white};
          padding: .5em 1em;
          border-radius: ${theme.borderRadius};
          margin: .5em 0;
          color: ${theme.darkText};
          text-align:center
        }

        .commune-infos {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: .5em;
          font-size: large;
          font-weight: bold;
          justify-self: flex-start;
        }

        .signature-date {
          font-style: italic;
          justify-self: flex-end;
        }
      `}</style>
    </div>
  )
}

Commune.propTypes = {
  name: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  signatureDate: PropTypes.string.isRequired,
  charteURL: PropTypes.string
}

export default Commune
