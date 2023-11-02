import fs from 'node:fs'
import path from 'node:path'
import send from 'send'
import PropTypes from 'prop-types'
import {Download} from 'react-feather'

import Head from '@/components/head'
import Section from '@/components/section'
import Page from '@/layouts/main'
import Data from '@/views/data'
import sendToTracker, {getDownloadTrackEvent} from '@/lib/util/analytics-tracker'

import ErrorPage from '../_error'

const PATH = process.env.PATH_STATIC_FILE
const rootLink = {
  href: '/donnees-nationales',
  label: 'Données nationales',
}

const autorizedPath = (_path, rootPath = PATH) => {
  let realPath
  try {
    realPath = fs.realpathSync(_path)
  } catch (err) {
    console.warn('[WARNING]', 'File access error:', err)
    return {
      path: _path,
      auth: false
    }
  }

  const isRealPathIsInRoot = realPath.startsWith(rootPath)
  const isRealPathIsVisibleFile = !path.basename(realPath).startsWith('.')
  const isPathIsVisibleFile = !path.basename(_path).startsWith('.')

  return {
    path: realPath,
    auth: (
      isRealPathIsInRoot &&
      isRealPathIsVisibleFile &&
      isPathIsVisibleFile
    )
  }
}

const getDirectories = _path => (
  fs
    .readdirSync(_path, {withFileTypes: true})
    .filter(entry => autorizedPath(path.join(_path, entry.name)).auth)
    .map(entry => {
      const isSymbolicLink = entry.isSymbolicLink()
      const computedPath = isSymbolicLink ? path.resolve(
        _path,
        fs.readlinkSync(path.join(_path, entry.name))
      ) : path.join(_path, entry.name)
      const target = isSymbolicLink ? fs.lstatSync(computedPath) : fs.lstatSync(path.resolve(_path, entry.name))
      const isDirectory = target.isDirectory()
      const targetName = isSymbolicLink ? path.basename(computedPath) : entry.name
      const {size = 0, mtime = null} = target

      return ({
        name: entry.name,
        targetName,
        isDirectory,
        isSymbolicLink,
        fileInfo: isDirectory ? null : {
          size,
          date: mtime.toUTCString()
        }
      })
    })
)

const getFormatedDate = () => {
  const date = new Date()
  return new Intl.DateTimeFormat('fr', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date).replace(/,/g, '\'').replace(/ /g, ' ')
}

const asyncSend = (req, res, filePath) => new Promise((resolve, reject) => {
  const targetFileName = path.basename(filePath)
  function headers(res) {
    res.setHeader('Content-Disposition', `attachment; filename="${targetFileName}"`)
  }

  send(req, encodeURI(filePath), {index: false})
    .on('headers', headers)
    .on('error', err => {
      const formattedDate = getFormatedDate()
      console.warn(`[${formattedDate} - ERROR]`, 'File access error:', err)
      reject(err)
    })
    .on('end', () => {
      resolve()
    })
    .pipe(res)
})

export async function getServerSideProps(context) {
  let stat
  let realPath

  const {params, res, req} = context
  const {path: paramPath = []} = params
  const fileName = `${paramPath.join('/')}`
  const filePath = path.resolve(PATH, fileName)
  const formattedDate = getFormatedDate()

  try {
    const authPath = autorizedPath(filePath)

    if (!authPath.auth) {
      console.warn(`[${formattedDate} - WARNING]`, `Attempted illegal access to ${authPath.path}`)
      res.statusCode = 404
      return {
        props: {errorCode: 404},
      }
    }

    realPath = authPath.path
    stat = fs.lstatSync(realPath)
  } catch (err) {
    console.warn(`[${formattedDate} - ERROR]`, 'File access error:', err)
    res.statusCode = 404
    return {
      props: {errorCode: 404},
    }
  }

  if (stat.isDirectory()) {
    return {
      props: {
        title: ['data', ...paramPath].join('/') || '',
        path: paramPath || [],
        data: getDirectories(filePath) || [],
      }
    }
  }

  try {
    sendToTracker(getDownloadTrackEvent({
      downloadDataType: `${path.dirname(fileName).split('/')[0]}${req?.headers?.range ? ' (Partial)' : ''}`,
      downloadFileName: fileName,
      nbDownload: 1
    }))
    await asyncSend(req, res, realPath)
  } catch (err) {
    console.warn(`[${formattedDate} - ERROR]`, 'File access error:', err)
    return {
      props: {
        errorCode: 502,
        errorMessage: 'Une erreur est survenue lors de la génération du téléchargement.',
      },
    }
  }

  return {props: {}}
}

export default function DataPage({title, path, data, errorCode, errorMessage}) {
  return errorCode && errorCode !== 200 ?
    (<ErrorPage code={errorCode} message={errorMessage} />) :
    (path ? (
      <Page title={`BAN OpenData : ${title}`}>
        <Head
          title='Téléchargez les données de la BAN'
          icon={<Download size={56} alt='' aria-hidden='true' />}
        />
        <Section>
          <Data {...{root: rootLink, path, data}} />
        </Section>
      </Page>
    ) : null)
}

DataPage.propTypes = {
  title: PropTypes.string,
  path: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
  errorCode: PropTypes.number,
  errorMessage: PropTypes.string,
}
