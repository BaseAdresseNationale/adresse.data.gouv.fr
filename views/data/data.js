import Link from 'next/link'
import PropTypes from 'prop-types'
import {filesize} from 'filesize'

import theme from '@/styles/theme'

const TIME_ZONE = 'Europe/Paris'

const dateFormatOptions = {
  dateFormatOptionsDate: {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  dateFormatOptionsTime: {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
}

function Data({root, path = [], data = []}) {
  const currentDir = ['data', ...path].slice(-1)
  const parentsDir = ['data', ...path].slice(0, -1)

  return (
    <>
      <div>
        <div>
          {root ? <span><Link href={root.href}>{root.label}</Link>{' '}</span> :
            null}
          {path.length > 0 && (
            parentsDir.map((dir, index) => (
              <span key={parentsDir.slice(0, index + 1).join('/')}>&gt; <Link href={`/${parentsDir.slice(0, index + 1).join('/')}`}>{dir}</Link>{' '}</span>
            ))
          )}
          <span>&gt; {currentDir}{' '}</span>
        </div>

        <div>
          {data ? (
            <ul>
              {
                data
                  .map(entry => {
                    const fileDate = entry.fileInfo?.date && new Date(entry.fileInfo.date)
                    return (
                      <li key={entry.name}>
                        <Link
                          legacyBehavior
                          href={'./' + [...path, entry.name].join('/')}
                        >
                          <a
                            target={entry.isDirectory ? '_self' : `file-${entry.name}`}
                            rel='noreferrer'
                            className='explorer-link'
                          >
                            <span className='explorer-link-label'>
                              <span className='explorer-link-label-text'>{entry.name}</span>
                              <span className='explorer-link-label-size'>{entry.fileInfo?.size && filesize(entry.fileInfo.size, {base: 8})}</span>
                            </span>
                            <span className='explorer-link-datetime'>
                              <span className='explorer-link-date'>{fileDate?.toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsDate)}</span>
                              <span className='explorer-link-time'>{fileDate?.toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsTime)}</span>
                            </span>
                          </a>
                        </Link>

                      </li>
                    )
                  })
              }
            </ul>
          ) : (
            'Chargement...'
          )}
        </div>
      </div>
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
        }
      `}</style>
    </>
  )
}

Data.propTypes = {
  root: PropTypes.shape({
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  path: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
}

export default Data
