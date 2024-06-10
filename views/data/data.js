import {useMemo} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import DataEntry from './data-entry'
import dateFormatOptions from './date-format-options'

function Data({root, path = [], data: dataRaw = [], config = {}}) {
  const currentDir = ['data', ...path].slice(-1)
  const parentsDir = ['data', ...path].slice(0, -1)
  const sectionsConfig = useMemo(() => Object.fromEntries((config.groups || []).map(group => [group.name, group])), [config.groups])
  const {__: dataDefault, ...dateSections} = useMemo(() => {
    const sections = Object.fromEntries((config.groups || []).map(group => [group.name, []]))

    // eslint-disable-next-line unicorn/no-array-reduce
    const dataSections = dataRaw.reduce((acc, entry) => {
      const fileDate = entry.fileInfo?.date && new Date(entry.fileInfo.date)
      const {year, month, day} = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(entry.name)?.groups || {}
      const humanDateDirName = year && month && day && (new Date(year, (month - 1), day)).toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsLongDate)

      const finalEntry = {
        ...entry,
        humanDirName: humanDateDirName,
        fileDate,
      }

      const section = config.groups?.find(({rule}) => rule && (new RegExp(rule)).test(entry.name))
      acc[section ? section.name : '__'].push(finalEntry)

      return acc
    }, (sections.__ ? sections : {__: [], ...sections}))
    return dataSections
  }, [dataRaw, config.groups])

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
        {dataDefault?.length > 0 && (
          <ul>
            {
              dataDefault.map(entry => (
                <li key={entry.name}><DataEntry entry={entry} path={path} /></li>
              ))
            }
          </ul>
        )}

        {dateSections && Object.entries(dateSections).map(([sectionName, sectionEntries]) => {
          const {description} = sectionsConfig[sectionName] || {}
          return (
            <div key={sectionName}>
              <hr />
              <h3>{sectionName}</h3>
              {description && <p>{description}</p>}
              <ul>
                {
                  sectionEntries.map(entry => (
                    <li key={entry.name}><DataEntry entry={entry} path={path} /></li>
                  ))
                }
              </ul>
            </div>
          )
        }
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
  config: PropTypes.object,
}

export default Data
