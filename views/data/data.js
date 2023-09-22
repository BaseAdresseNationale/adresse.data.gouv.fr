import Link from 'next/link'
import PropTypes from 'prop-types'
import {filesize} from 'filesize'

function Data({root, path = [], data = []}) {
  const currentDir = ['data', ...path].slice(-1)
  const parentsDir = ['data', ...path].slice(0, -1)

  return (
    <div>
      <div>
        {root ? <span><Link href={root.href}>{root.label}</Link>{' '}</span> :
          null}
        {path.length > 0 && (
          parentsDir.map((dir, index) => (
            <span key={dir}>&gt; <Link href={`/${parentsDir.slice(0, index + 1).join('/')}`}>{dir}</Link>{' '}</span>
          ))
        )}
        <span>&gt; {currentDir}{' '}</span>
      </div>

      <div>
        {data ? (
          <ul>
            {
              data
                .map(entry => (
                  <li key={entry.name}>
                    <Link
                      legacyBehavior
                      href={'./' + [...path, entry.name].join('/')}
                    >
                      <a
                        target={entry.isDirectory ? '_self' : '_blank'}
                        rel='noreferrer'
                      >
                        {entry.name}
                        {entry.fileInfo && `(${filesize(entry.fileInfo?.size)} - ${(new Date(entry.fileInfo.date)).toLocaleString()})`}
                      </a>
                    </Link>

                  </li>
                ))
            }
          </ul>
        ) : (
          'Chargement...'
        )}
      </div>
    </div>
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
