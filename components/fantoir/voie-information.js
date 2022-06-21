import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronUp, ChevronDown} from 'react-feather'

import theme from '@/styles/theme'

function VoieInformation({voie}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='line-container'>
      <button
        type='button'
        aria-label={`${isOpen ? 'Masquer' : 'Afficher'} les informations concernant la voie ${voie.libelleVoieComplet}`}
        className={voie?.dateAnnulation ? 'line title canceled' : 'line title'}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='infos'>{voie.libelleVoieComplet}</div>
        <div className='infos'>{voie.typeVoie}</div>
        <div className='infos'>{voie.codeRivoli}</div>
        <div>
          {isOpen ? <ChevronUp size={35} /> : <ChevronDown size={35} />}
        </div>
      </button>
      {isOpen && (
        <div className='voie-tags'>
          <div>Code Rivoli : <span>{voie.codeRivoli}</span></div>
          <div>Clé Rivoli : <span>{voie.cleRivoli}</span></div>
          <div>Date d’ajout : <span>{voie.dateAjout}</span></div>
          {voie.natureVoie && (
            <div>Nature de la voie : <span>{voie.natureVoie}</span></div>
          )}
          <div>Voie privée : <span>{voie.voiePrivee ? 'oui' : 'non'}</span></div>
          {voie?.dateAnnulation && (
            <div className='canceled'>Date d’annulation : <span>{voie.dateAnnulation}</span></div>
          )}
        </div>
      )}
      <style jsx>{`
        .title {
          color: ${isOpen ? '#FFF' : '#000'};
          background-color: ${isOpen ? theme.primary : ''};
          display: flex;
          padding: .5em;
        }

        button {
          width: 100%;
          border: none;
          background: none;
        }

        .line {
          display: flex;
          padding: .5em;
          border-left: 1px solid ${theme.border};
          border-right: 1px solid ${theme.border};
          border-bottom: 1px solid ${theme.border};
        }

        .line:hover {
          cursor: pointer;
          color: #000;
          background-color: ${theme.colors.lighterGrey};
        }

        .infos {
          flex: 1;
          text-align: center;
          padding: .5em;
          margin: auto;
        }

        .voie-tags {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          padding: .5em;
          border-left: 1px solid ${theme.border};
          border-right: 1px solid ${theme.border};
          border-bottom: 1px solid ${theme.border};
        }

        .voie-tags div {
          display: grid;
          justify-items: center;
          padding: .5em;
          margin: .5em;
          gap: .5em;
          border: 1px solid ${theme.colors.lighterGrey};
          border-radius: .5em;
        }

        .canceled {
          color: #000;
          background-color: ${theme.errorBg};
        }

        .voie-tags .canceled {
          border-radius: .5em;
        }

        span {
          display: inline-flex;
          border-radius: 3.75em;
          background-color: ${theme.infoBg};
          color: ${theme.infoBorder};
          font-size: .75em;
          line-height: 1;
          padding: .4em 1.2em;
          margin: .1em .5em
        }
      `}</style>
    </div>
  )
}

VoieInformation.propTypes = {
  voie: PropTypes.object.isRequired
}

export default VoieInformation
