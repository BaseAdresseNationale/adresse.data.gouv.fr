import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

import theme from '@/styles/theme'

function Commune({name, codeCommune, picture, alt, signatureDate}) {
  const date = new Date(signatureDate).toLocaleDateString('fr-FR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})

  return (
    <div className='commune-container'>
      <div className='commune-infos'>
        <Image src={picture} height={70} width={56} alt={alt} />
        <Link href={`/commune/${codeCommune}`}>{`${name} - ${codeCommune}`}</Link>
      </div>
      <div className='signature-date'>Partenaire depuis le <b>{date}</b></div>

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
  alt: PropTypes.string.isRequired,
  signatureDate: PropTypes.string.isRequired
}

export default Commune
