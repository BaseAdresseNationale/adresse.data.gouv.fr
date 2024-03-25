import {useMemo} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import DataEntry from './data-entry'
import dateFormatOptions from './date-format-options'

function Data({root, path = [], data: dataRaw = []}) {
  const currentDir = ['data', ...path].slice(-1)
  const parentsDir = ['data', ...path].slice(0, -1)

  const {dataPath, dateDir} = useMemo(() => {
    // eslint-disable-next-line unicorn/no-array-reduce
    const {dataPath, dateDirRaw} = dataRaw.reduce((acc, entry) => {
      const {isDirectory} = entry
      const fileDate = entry.fileInfo?.date && new Date(entry.fileInfo.date)
      const {year, month, day} = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(entry.name)?.groups || {}
      const humanDateDirName = year && month && day && (new Date(year, month, day)).toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsLongDate)

      const finalEntry = {
        ...entry,
        humanDirName: humanDateDirName,
        fileDate,
      }

      if (isDirectory && humanDateDirName) {
        acc.dateDirRaw?.push(finalEntry)
      } else {
        acc.dataPath?.push(finalEntry)
      }

      return acc
    }, {dateDirRaw: [], dataPath: []})

    return {
      dataPath,
      dateDir: dateDirRaw.reverse()
    }
  }, [dataRaw])

  return (
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
        {dataPath?.length > 0 && (
          <ul>
            {
              dataPath.map(entry => (
                <DataEntry key={entry.name} entry={entry} path={path} />
              ))
            }
          </ul>
        )}

        {dateDir?.length > 0 && (
          <>
            <hr />
            <h3>Données archivées</h3>
            <ul>
              {
                dateDir.map(entry => (
                  <DataEntry key={entry.name} entry={entry} path={path} />
                ))
              }
            </ul>
          </>
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
