import Link from 'next/link'
import PropTypes from 'prop-types'
import {filesize} from 'filesize'

import theme from '@/styles/theme'

import dateFormatOptions from './date-format-options'

const translatedName = {
  latest: 'Dernière(s) version(s) en date',
}

const translatedQuarter = {
  T1: '1er trimestre',
  T2: '2ème trimestre',
  T3: '3ème trimestre',
  T4: '4ème trimestre',
}

function DataEntry({entry: {name, isDirectory, fileInfo}, path}) {
  const fileDate = fileInfo?.date && new Date(fileInfo.date)
  const dateSearchRegExp = /^(?<year>\d{4})-(((?<month>\d{2})-(?<day>\d{2}))|(?<quarter>T[1-4]))$/
  const {year, quarter, month, day} = dateSearchRegExp.exec(name)?.groups || {}
  const humanDateDirName = year && month && day ? (new Date(year, month, day)).toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsLongDate) :
    year && quarter && `${translatedQuarter[quarter]} ${year}`
  const humanDirName = humanDateDirName ? `export du ${humanDateDirName}` : translatedName[name]

  return (
    <li key={name}>
      <Link
        legacyBehavior
        href={encodeURI('./' + [...path, name].join('/'))}
      >
        <a
          target={isDirectory ? '_self' : `file-${name}`}
          rel='noreferrer'
          className='explorer-link'
        >
          <span className='explorer-link-label'>
            <span className='explorer-link-label-wrapper'>
              <span className={humanDirName ? 'explorer-link-label-text-date' : 'explorer-link-label-text'}>{name}</span>
              {humanDirName && <span className='explorer-link-label-human'>{humanDirName}</span>}
            </span>

            <span className='explorer-link-label-size'>{fileInfo?.size && filesize(fileInfo.size, {base: 8})}</span>
          </span>
          {fileDate && (
            <span className='explorer-link-datetime'>
              <span className='explorer-link-date'>{fileDate?.toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsDate)}</span>
              <span className='explorer-link-time'>{fileDate?.toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsTime)}</span>
            </span>
          )}
        </a>
      </Link>

      <style jsx>{`
        .explorer-link {
          display: flex;
          text-decoration: none;
          flex-direction: column;
        }
        .explorer-link-label {
          display: flex;
          flex-wrap: nowrap;
          flex: 1;
        }
        .explorer-link-label-wrapper {
          display: flex;
          flex-direction: column;
        }
        .explorer-link-label-human {
          padding-right: .5em;
          color: #777;
        }
        .explorer-link-label-human:first-letter {
          text-transform: uppercase;
        }
        .explorer-link-label-text-date {
          padding-right: .5em;
          text-decoration: underline;
          display: inline-block;
          width: 7em;
        }
        .explorer-link-label-text {
          padding-right: .5em;
          text-decoration: underline;
        }
        .explorer-link-label-size {
          display: flex;
          flex-wrap: nowrap;
          white-space: nowrap;
          align-items: end;
          line-height: 1em;
          padding-bottom: 0.2em;
          font-size: 0.8em;
          font-style: italic;
          color: #777;
        }
        .explorer-link-datetime {
          display: flex;
          min-width: 5em;
          align-items: end;
          line-height: 1em;
          padding-bottom: 0.2em;
          font-size: 0.8em;
          color: #777;
          white-space: nowrap;
          gap: 0.5em;
        }
        .explorer-link-date {
        }
        .explorer-link-time {
          min-width: 4.2em;
        }
        @media (min-width: ${theme.breakPoints.desktop}) {
          .explorer-link {
            max-width: 35em;
            flex-direction: row;
          }
          .explorer-link-label {
            display: flex;
            flex-wrap: nowrap;
            flex: 1;
          }
          .explorer-link-label-wrapper {
            flex-direction: row;
          }
          .explorer-link-label-human {
            padding-left: .5em;
          }
      }
      `}</style>

    </li>
  )
}

DataEntry.propTypes = {
  entry: PropTypes.shape(
    {
      name: PropTypes.string.isRequired,
      isDirectory: PropTypes.bool.isRequired,
      fileInfo: PropTypes.shape(
        {
          translatedName: PropTypes.string,
          date: PropTypes.string,
          hash: PropTypes.string,
          size: PropTypes.number,
        }
      ),
    }
  ).isRequired,
  path: PropTypes.array.isRequired,
}

export default DataEntry
