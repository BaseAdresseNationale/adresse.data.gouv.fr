/* eslint-disable operator-linebreak */
import PropTypes from 'prop-types'
import {Download} from 'react-feather'
import {S3} from '@aws-sdk/client-s3'
import {fr} from '@codegouvfr/react-dsfr'

import Head from '@/components/head'
import Section from '@/components/section'
import Page from '@/layouts/main'
import sendToTracker, {getDownloadToEventTracker} from '@/lib/util/analytics-tracker'
import Data, {
  config as dataConfig,
  getAlias,
  getFormatedDate,
  asyncSendS3,
  listObjectsRecursively,
  autorizedPathS3,
} from '@/views/data'

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

export async function getServerSideProps(context) {
  const {params, res, req} = context
  const {path: paramPathRaw = []} = params
  const config = dataConfig?.directory.find(({path}) => path === paramPathRaw.join('/')) || {}
  const alias = await getAlias(clientS3, bucketName)(rootDir, dataConfig?.alias, paramPathRaw.join('/') || '')

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
      await asyncSendS3(clientS3)(req, res, {
        params: {
          ...(req?.headers?.range ? {Range: req.headers.range} : {}),
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
    const s3Objects = await listObjectsRecursively(clientS3, bucketName)(s3DirPath)
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
          config,
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

export default function DataPage({title, path, data, config, errorCode, errorMessage}) {
  const {hero} = config
  return errorCode && errorCode !== 200 ?
    (<ErrorPage code={errorCode} message={errorMessage} />) :
    (path ? (
      <Page title={`BAN OpenData : ${title}`}>
        <Head
          title='Téléchargez les données de la BAN'
          icon={<Download size={56} alt='' aria-hidden='true' />}
        />
        <Section>
          {hero && (
            <p>
              {hero.type === 'warning' && <i className={fr.cx('fr-icon-warning-fill', 'warn-icon')} />}
              {hero.value}
            </p>
          )}
          <Data {...{root: rootLink, path, data, config}} />
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
  config: PropTypes.shape({
    hero: PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.string,
    }),
  }),
  errorCode: PropTypes.number,
  errorMessage: PropTypes.string,
}

DataPage.defaultProps = {
  config: {}
}
