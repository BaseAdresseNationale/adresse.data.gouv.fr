import { Fragment, ReactNode } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { filesize } from 'filesize'

// import theme from '@/styles/theme'

import dateFormatOptions from '../config/date-format-options'

import {
  ExplorerLink,
  ExplorerLinkLabel,
  ExplorerLinkLabelWrapper,
  ExplorerLinkLabelHuman,
  ExplorerLinkLabelText,
  ExplorerLinkLabelSize,
  ExplorerLinkDatetime,
  ExplorerLinkDate,
  ExplorerLinkTime,
} from './DataEntry.styled'

const theme = {
  breakPoints: {
    desktop: '1024px',
  },
}

const translatedName: { [key: string]: string } = {
  'latest': 'Dernière(s) version(s) en date',
  'weekly': 'Version(s) hebdomadaire(s)',
  'ban/adresses-odbl': 'Repertoire déprecié',
  'ban/adresses-odbl/latest': 'Dernière(s) version(s) en date',
}

const translatedQuarter: { [key: string]: string } = {
  T1: '1er trimestre',
  T2: '2ème trimestre',
  T3: '3ème trimestre',
  T4: '4ème trimestre',
}

interface DataEntryProps {
  entry: {
    name: keyof typeof translatedName
    isDirectory: boolean
    fileInfo: {
      date: string
      size: number
    }
  }
  path: string[]
}

const getFileType = (isDir: boolean, name: string) => {
  if (isDir) return 'dir'
  return name.match(/\..*$/)?.[0]?.split('.')?.pop()
}

function DataEntry({ entry: { name, isDirectory, fileInfo }, path }: DataEntryProps) {
  const fileDate = fileInfo?.date && new Date(fileInfo.date)
  const dateSearchRegExp = /^(?<year>\d{4})-(((?<month>\d{2})-(?<day>\d{2}))|(?<quarter>T[1-4]))$/
  const { year, quarter, month, day } = (dateSearchRegExp.exec(`${name}`)?.groups || {}) as {
    year?: string
    quarter?: keyof typeof translatedQuarter
    month?: string
    day?: string
  }
  const humanDateDirName = year && month && day
    // ? (new Date(+year, (+month - 1), +day)).toLocaleString('fr-FR', {
    //     timeZone: 'Europe/Paris',
    //     weekday: 'long',
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    //   })
    ? (new Date(+year, (+month - 1), +day)).toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsLongDate)
    : year && quarter && `${translatedQuarter[quarter]} ${year}`
  const humanDirName = humanDateDirName ? `export du ${humanDateDirName}` : translatedName[([...path, name].join('/'))] || translatedName[name]

  return (
    <Fragment key={name}>
      <ExplorerLink
        target={isDirectory ? '_self' : `file-${name}`}
        rel="noreferrer"
        href={encodeURI('./' + [...path, name].join('/'))}
        // {...(!isDirectory ? {download: true} : {})}
        download={isDirectory ? undefined : true}
      >
        <ExplorerLinkLabel $fileType={getFileType(isDirectory, `${name}`)}>
          <ExplorerLinkLabelWrapper>
            <ExplorerLinkLabelText $withHumanDateDirName={Boolean(humanDateDirName)}>{name}</ExplorerLinkLabelText>
            {humanDirName && <ExplorerLinkLabelHuman>{humanDirName}</ExplorerLinkLabelHuman>}
          </ExplorerLinkLabelWrapper>

          <ExplorerLinkLabelSize>{(fileInfo?.size && filesize(fileInfo.size, { base: 10 }) as ReactNode)}</ExplorerLinkLabelSize>
        </ExplorerLinkLabel>
        {fileDate && (
          <ExplorerLinkDatetime>
            <ExplorerLinkDate>{fileDate?.toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsDate)}</ExplorerLinkDate>
            <ExplorerLinkTime>{fileDate?.toLocaleString('fr-FR', dateFormatOptions.dateFormatOptionsTime)}</ExplorerLinkTime>
          </ExplorerLinkDatetime>
        )}
      </ExplorerLink>
    </Fragment>
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
