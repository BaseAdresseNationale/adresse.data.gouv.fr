import PropTypes from 'prop-types'
import Image from 'next/image'
import {HelpCircle} from 'react-feather'

import Tooltip from '@/components/base-adresse-nationale/tooltip'

function LanguagesPreview({nomAlt, hasIcon}) {
  return (
    <>
      {Object.keys(nomAlt).length > 1 && (
        <div className='multiple-languages'>
          <Tooltip
            direction='right'
            message={
        <ul>
          {Object.values(nomAlt).map(voieName => (
            <li color='white' key={voieName}>{voieName}</li>
          ))}
        </ul>
            }
          >
            <div className='label'>
              <HelpCircle size={12} /> Afficher les alternatives régionales
            </div>
          </Tooltip>
        </div>
      )}

      {hasIcon && Object.keys(nomAlt).length === 1 ? (
        <div className='language-with-icon'>
          <Image src={`/images/icons/flags/${Object.keys(nomAlt)[0]}.svg`} height={22} width={22} />
          <div className='alt-name'>{nomAlt[Object.keys(nomAlt)]}</div>
        </div>
      ) : (
        <div className='alt-name'>{nomAlt[Object.keys(nomAlt)]}</div>
      )}

      <style jsx>{`
      .multiple-languages, .alt-name {
            font-style: italic;
            font-size: 14px;
            font-weight: lighter;
          }

          .label {
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 5px;
            background: none;
            margin: 0;
            padding: 0;
          }

          ul {
            padding: 0 15px;
            margin: 0;
            font-style: normal;
            font-weight: bold;
            text-align: left;
          }

          .language-with-icon {
            font-style: italic;
            font-weight: lighter;
            display: flex;
            gap: 5px;
            align-items: center;
          }

          .alt-name {
            font-weight: lighter;
            font-size: 16px;
          }
      `}</style>
    </>
  )
}

LanguagesPreview.propTypes = {
  nomAlt: PropTypes.object.isRequired,
  hasIcon: PropTypes.bool
}

LanguagesPreview.defaultProps = {
  hasIcon: false
}

export default LanguagesPreview
