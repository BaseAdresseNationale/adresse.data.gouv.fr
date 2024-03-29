/* eslint-disable operator-linebreak */
import PropTypes from 'prop-types'
import {Download} from 'react-feather'
import {S3} from '@aws-sdk/client-s3'
import {fr} from '@codegouvfr/react-dsfr'

import Head from '@/components/head'
import Section from '@/components/section'
import Page from '@/layouts/main'
import Data from '@/views/data'
import sendToTracker, {getDownloadToEventTracker} from '@/lib/util/analytics-tracker'

import ErrorPage from '../_error'

const {
  S3_CONFIG_ACCESS_KEY_ID,
  S3_CONFIG_SECRET_ACCESS_KEY,
  S3_CONFIG_REGION,
  S3_CONFIG_ENDPOINT,
} = process.env

const rootLink = {
  href: '/donnees-nationales',
  label: 'Données nationales',
}

const bucketName = 'prd-ign-mut-ban'
const rootDir = ['adresse-data']
const clientS3 = new S3({
  credentials: {
    accessKeyId: S3_CONFIG_ACCESS_KEY_ID,
    secretAccessKey: S3_CONFIG_SECRET_ACCESS_KEY,
  },
  region: S3_CONFIG_REGION,
  endpoint: S3_CONFIG_ENDPOINT,
})

const getFormatedDate = () => {
  const date = new Date()
  const dateFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  return new Intl.DateTimeFormat('fr', dateFormatOptions)
    .format(date)
    .replace(/,/g, '\'')
    .replace(/ /g, ' ')
}

const autorizedPathS3 = path => {
  const isPathIsVisibleFile = !path.startsWith('.')

  return {
    path,
    auth: isPathIsVisibleFile
  }
}

const asyncSendS3 = (req, res, {params, fileName, metadata}) => new Promise(
  (resolve, reject) => {
    res.attachment(params.key)
    res.setHeader('Content-Length', metadata.ContentLength)
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

    /* eslint-disable promise/prefer-await-to-then */
    clientS3.getObject(params)
      .then(({Body}) => {
        Body
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
      .catch(err => console.error(err))
  /* eslint-enable promise/prefer-await-to-then */
  }
)

// Reccursivly GET S3 Objects
async function listObjectsRecursively(prefix, continuationToken) {
  const params = {
    Bucket: bucketName,
    Prefix: prefix || undefined,
    Delimiter: '/',
    ContinuationToken: continuationToken,
  }

  try {
    const data = await clientS3.listObjectsV2(params)

    if (data.KeyCount <= 0) {
      return undefined
    }

    const filesList = (data.Contents || []).map(({Key, LastModified, ETag, Size}) => ({
      name: Key.replace(new RegExp(`^${prefix}`), ''),
      path: Key,
      fileInfo: {
        date: LastModified.toString(),
        hash: ETag,
        size: Size,
      },
      isDirectory: false,
    }))
    const dirsList = (data.CommonPrefixes || []).map(({Prefix}) => ({
      name: Prefix.replace(new RegExp(`^${prefix}`), '').replace(/\/$/, ''),
      path: Prefix,
      isDirectory: true,
    }))
    const nextList = (data.IsTruncated) ? await listObjectsRecursively(prefix, data.NextContinuationToken) : []
    return [...filesList, ...dirsList, ...nextList]
  } catch (err) {
    console.error('Erreur lors de la récupération de la liste des objets :', err)
  }
}

const config = {
  alias: [
    {
      parent: 'adresses-cadastre',
      name: 'latest',
      target: '2023',
    },
    {
      parent: 'adresses-ftth',
      name: 'latest',
      target: '2023-T2',
    },
    {
      parent: 'ban',
      name: 'adresses-odbl',
      target: 'adresses',
      comment: 'Ce repertoire est obsolète et redirige vers le répertoire adresses',
    },
    {
      parent: 'ban/adresses',
      name: 'weekly',
      target: '2024-03-20',
    },
    {
      parent: 'ban/export-api-gestion', // OBSOLETE ?
      name: 'latest',
      target: '2023-04-28',
    },
    {
      parent: 'contours-administratifs',
      name: 'latest',
      target: '2023',
    },
    {
      parent: 'fantoir',
      name: 'latest',
      target: 'fantoir-2023-04.gz',
    },
  ]
}

export async function getServerSideProps(context) {
  const {params, res, req} = context
  const {path: paramPathRaw = []} = params

  const aliases = config?.alias && (
    [...config.alias]
      .sort((a, b) => `${b.parent}${b.name}`.localeCompare(`${a.parent}${a.name}`))
      .reverse()
  )
  const alias = aliases?.find(({parent}) => (new RegExp(`^${parent}(/|$)`)).test(paramPathRaw.join('/'))) || null
  const paramPath = alias && (new RegExp(`^${alias.parent}/${alias.name}`)).test(paramPathRaw.join('/'))
    ? paramPathRaw.join('/').replace(new RegExp(`^${alias.parent}/${alias.name}`), `${alias.parent}/${alias.target}`).split('/')
    : paramPathRaw
  const dirPath = `${paramPath.join('/')}`
  const formattedDate = getFormatedDate()
  const s3ObjectPath = [...rootDir, ...paramPath].join('/')

  try {
    const s3Head = await clientS3.headObject({
      Bucket: bucketName,
      Key: s3ObjectPath,
    })

    // NO ERROR > PATH IS A FILE
    try {
      sendToTracker(getDownloadToEventTracker({
        downloadDataType: `${paramPath[0]}${req?.headers?.range ? ' (Partial)' : ''}`,
        downloadFileName: dirPath,
        nbDownload: 1
      }))
      await asyncSendS3(req, res, {
        params: {
          Bucket: bucketName,
          Key: s3ObjectPath,
        },
        fileName: paramPath[paramPath.length - 1],
        metadata: s3Head,
      })
    } catch (err) {
      console.warn(`[${formattedDate} - ERROR]`, 'File access error:', err)
      return {
        props: {
          errorCode: 502,
          errorMessage: 'Une erreur est survenue lors de la génération du téléchargement.',
        },
      }
    }
  } catch {
    // ERROR > PATH SHOULD BE DIRECTORY
    const s3DirPath = `${s3ObjectPath}/`
    const s3Objects = await listObjectsRecursively(s3DirPath)
    if (s3Objects) {
      const s3data = [
        ...(s3Objects || [])
          .filter(({name}) => autorizedPathS3(name).auth)
          .map(({name, path, isDirectory, fileInfo, ...rest}) => ({
            name,
            path: alias && alias.parent !== dirPath
              ? path.replace(
                (new RegExp(`^${rootDir.join('/')}/${alias.parent}/${alias.target}`)),
                `${rootDir.join('/')}/${alias.parent}/${alias.name}`
              )
              : path,
            isDirectory,
            ...(fileInfo ? {fileInfo} : {}),
            ...rest,
          }))
      ]
      const s3contentDir = [
        ...s3data,
        ...(alias && alias.parent === dirPath ? [{
          ...alias,
          ...(s3data.find(({name}) => name === alias.target) || {}),
          name: alias.name,
          path: `${s3ObjectPath}/${alias.name}`,
        }] : []),
      ].sort((a, b) => a.name.localeCompare(b.name) || a.isDirectory - b.isDirectory)

      return {
        props: {
          title: ['data', ...paramPath].join('/') || '',
          path: paramPathRaw || [],
          data: s3contentDir || [],
          pageInfoText: alias && alias.parent !== dirPath && alias.comment ? {
            type: 'warning',
            value: alias.comment,
          } : null,
        }
      }
    }

    // OBJECT DO NOT EXIST > IS UNKNOWN PATH
    console.warn(`[${formattedDate} - ERROR]`, 'S3 Object - Try access to unknown object:', s3DirPath)
    res.statusCode = 404
    return {
      props: {errorCode: 404},
    }
  }

  return {props: {}}
}

export default function DataPage({title, path, data, pageInfoText, errorCode, errorMessage}) {
  return errorCode && errorCode !== 200 ?
    (<ErrorPage code={errorCode} message={errorMessage} />) :
    (path ? (
      <Page title={`BAN OpenData : ${title}`}>
        <Head
          title='Téléchargez les données de la BAN'
          icon={<Download size={56} alt='' aria-hidden='true' />}
        />
        <Section>
          {pageInfoText && (
            <p>
              {pageInfoText.type === 'warning' && <i className={fr.cx('fr-icon-warning-fill', 'warn-icon')} />}
              {pageInfoText.value}
            </p>
          )}
          <Data {...{root: rootLink, path, data}} />
        </Section>

        <style jsx>{`
          .warn-icon {
            color: #f60700;
            float: left;
            margin: 0 0.5em 0 0;
          }
        `}</style>
      </Page>
    ) : null)
}

DataPage.propTypes = {
  title: PropTypes.string,
  path: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
  pageInfoText: PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.string,
  }),
  errorCode: PropTypes.number,
  errorMessage: PropTypes.string,
}
