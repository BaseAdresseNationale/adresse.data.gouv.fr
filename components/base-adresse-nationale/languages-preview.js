import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/legacy/image'
import {HelpCircle} from 'react-feather'

import Tooltip from '@/components/base-adresse-nationale/tooltip'

import availableFlags from '../../available-flags.json'

const isFlagExist = codeISO => {
  return availableFlags.includes(codeISO)
}

function LanguagesPreview({nomAlt}) {
  const altNames = Object.keys(nomAlt)

  if (altNames.length === 0) {
    return null
  }

  return (
    <>
      {altNames.length > 1 ? (
        <div className='multiple-languages'>
          <Tooltip
            direction='right'
            message={
              <ul>
                {altNames.map(codeISO => (
                  <li color='white' key={codeISO}>
                    <Image
                      src={isFlagExist(codeISO) ? `/images/icons/flags/${codeISO}.svg` : '/images/icons/flags/ntr.svg'}
                      height={20}
                      width={20}
                      aria-hidden='true'
                    />
                    {nomAlt[codeISO]}
                  </li>
                ))}
              </ul>
            }
          >
            <div className='label'>
              <HelpCircle size={12} /> Afficher les alternatives régionales
            </div>
          </Tooltip>
        </div>
      ) : (
        <div className='language-with-icon'>
          <Image
            src={isFlagExist(altNames[0]) ? `/images/icons/flags/${altNames[0]}.svg` : '/images/icons/flags/ntr.svg'}
            height={22}
            width={22}
            aria-hidden='true'
          />
          <div className='alt-name'>{nomAlt[altNames]}</div>
        </div>
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

        li {
          list-style-type: none;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
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
  nomAlt: PropTypes.object.isRequired
}

export default React.memo(LanguagesPreview)
