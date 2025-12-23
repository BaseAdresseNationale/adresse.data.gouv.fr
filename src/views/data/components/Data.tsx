import { useMemo } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import { dateFormatOptions } from '../config'
import DataEntry from './DataEntry'
import {
  ItemList,
  Item,
  ParentDirName,
} from './Data.styled'

interface DataProps {
  // root: {
  //   href: string
  //   label: string
  // }
  path: string[]
  data: any[]
  config: {
    groups?: {
      name: string
      rule: string
      description: string
    }[]
  }
}

interface DataEntry {
  name: string
  isDirectory: boolean
  fileInfo: {
    date: string
    size: number
  }
}

const sortDirectory = (a: DataEntry, b: DataEntry) => {
  if (a.isDirectory === b.isDirectory) {
    return a.name.localeCompare(b.name)
  }
  return a.isDirectory ? -1 : 1
}

function Data({ path = [], data: dataRaw = [], config = {} }: DataProps) {
// function Data({ root, path: _path = [], data: dataRaw = [], config = {} }: DataProps) {
  // const path = ['data', ..._path]
  // const currentDir = [...path].slice(-1)
  // const parentsDir = [...path].slice(0, -1)
  // const currentDir = ['data', ...path].slice(-1)
  const parentsDir = ['data', ...path].slice(0, -1)
  const parentDir = parentsDir.slice(-1)[0]
  const sectionsConfig = useMemo(() => Object.fromEntries((config.groups || []).map(group => [group.name, group])), [config.groups])
  const { __: dataDefault, ...dateSections } = useMemo<Record<'__' | string, DataEntry[]>>(() => {
    const sections = Object.fromEntries((config.groups || []).map(group => [group.name, []]))

    const dataSections = dataRaw.reduce((acc, entry) => {
      const fileDate = entry.fileInfo?.date && new Date(entry.fileInfo.date)
      const { year, month, day } = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(entry.name)?.groups || {}
      const humanDateDirName = year && month && day && (
        new Date(+year, (+month - 1), +day)
      ).toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsLongDate)

      const finalEntry = {
        ...entry,
        humanDirName: humanDateDirName,
        fileDate,
      }

      const section = config.groups?.find(({ rule }: { rule: string }) => rule && (new RegExp(rule)).test(entry.name))
      acc[section ? section.name : '__'].push(finalEntry)

      return acc
    }, (sections.__ ? sections : { __: [], ...sections }))
    return dataSections
  }, [dataRaw, config.groups])

  // console.log('path >>>', path)
  // console.log('parentDir >>>', parentDir)

  return (
    <div>
      {/* <Breadcrumb
        // currentPageLabel={title}
        // currentPageLabel={root.label}
        currentPageLabel={currentDir}
        segments={[
          {
            // label: 'Télécharger les données',
            // linkProps: { href: '/outils/telechargement' },
            label: root.label,
            linkProps: { href: root.href },
          },
          ...[...path.slice(0, path.length - 1)].map((dir, index) => ({
            label: dir,
            linkProps: { href: `/data/${path.slice(0, index).join('/')}` },
          })),
        ]}
      /> */}

      {/* Breadcrumb : */}
      {/* <div>
        {root
          ? <span><Link href={root.href}>{root.label}</Link>{' '}</span>
          : null}
        {path.length > 0 && (
          parentsDir.map((dir, index) => (
            <span key={parentsDir.slice(0, index + 1).join('/')}>&gt; <Link href={`/${parentsDir.slice(0, index + 1).join('/')}`}>{dir}</Link>{' '}</span>
          ))
        )}
        <span>&gt; {currentDir}{' '}</span>
      </div> */}

      {parentDir && <div><Link className="fr-link fr-link--icon-left fr-icon-arrow-go-back-fill" href={`/${parentsDir.join('/')}`}>Précédent (<ParentDirName>{parentDir}</ParentDirName>)</Link></div>}

      {(!dataDefault || dataDefault.length === 0) && (!dateSections || Object.keys(dateSections).length === 0) && (
        <div>Ce répertoire est vide</div>
      )}

      <div>
        {dataDefault?.length > 0 && (
          <ItemList>
            {
              dataDefault.sort(sortDirectory).map(entry => (
                <Item key={entry.name}><DataEntry entry={entry} path={path} /></Item>
              ))
            }
          </ItemList>
        )}

        {dateSections && Object.entries(dateSections).map(([sectionName, sectionEntries]) => {
          const { description } = sectionsConfig[sectionName] || {}
          return (
            <div key={sectionName}>
              <hr />
              <h3>{sectionName}</h3>
              {description && <p>{description}</p>}
              <ItemList>
                {
                  sectionEntries.sort(sortDirectory).map(entry => (
                    <Item key={entry.name}><DataEntry entry={entry} path={path} /></Item>
                  ))
                }
              </ItemList>
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
