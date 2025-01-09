import { S3 } from '@aws-sdk/client-s3'
import { GetServerSidePropsContext } from 'next'
import sendToTracker, { getDownloadToEventTracker } from '@/lib/analytics-tracker'
import { dataConfig } from '@/views/data/config'
import {
  getAlias,
  getFormatedDate,
  asyncSendS3,
  listObjectsRecursively,
  autorizedPathS3,
} from '@/views/data/utils'
import { env } from 'next-runtime-env'

const S3_CONFIG_ACCESS_KEY_ID = env('S3_CONFIG_ACCESS_KEY_ID')
const S3_CONFIG_SECRET_ACCESS_KEY = env('S3_CONFIG_SECRET_ACCESS_KEY')
const S3_CONFIG_REGION = env('S3_CONFIG_REGION')
const S3_CONFIG_ENDPOINT = env('S3_CONFIG_ENDPOINT')

export const bucketName = 'prd-ign-mut-ban'
export const rootDir = ['adresse-data']

const clientS3 = new S3({
  credentials: {
    accessKeyId: S3_CONFIG_ACCESS_KEY_ID || 'default-access-key-id',
    secretAccessKey: S3_CONFIG_SECRET_ACCESS_KEY || 'default-secret-key',
  },
  region: S3_CONFIG_REGION || 'default-region',
  endpoint: S3_CONFIG_ENDPOINT || '',
})

interface Context extends GetServerSidePropsContext {
  params: {
    path: string[]
  }
}

export async function handleS3Data(context: Context) {
  const { params, res, req } = context
  const { path: paramPathRaw = [] } = params
  const config = dataConfig?.directory.find(({ path }) => path === paramPathRaw.join('/')) || {}
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

    try {
      sendToTracker(getDownloadToEventTracker({
        downloadDataType: `${paramPath[0]}${req?.headers?.range ? ' (Partial)' : ''}`,
        downloadFileName: dirPath,
        nbDownload: 1,
      }))
      await asyncSendS3(clientS3)((req as unknown as Request), res, {
        params: {
          ...(req?.headers?.range ? { Range: req.headers.range } : {}),
          Bucket: bucketName,
          Key: s3ObjectPath,
        },
        fileName: paramPath[paramPath.length - 1],
        metadata: s3Head,
      })
    }
    catch (err) {
      console.warn(`[${formattedDate} - ERROR]`, 'File access error:', err)
      return {
        props: {
          errorCode: 502,
          errorMessage: 'Une erreur est survenue lors de la génération du téléchargement.',
        },
      }
    }
  }
  catch {
    const s3DirPath = `${s3ObjectPath}/`
    const s3Objects = await listObjectsRecursively(clientS3, bucketName)(s3DirPath)
    if (s3Objects) {
      const s3data = [
        ...(s3Objects || [])
          .filter(({ name }) => autorizedPathS3(name).auth)
          .map(({ name, path, isDirectory, fileInfo, ...rest }) => ({
            name,
            path: alias && alias.parent !== dirPath
              ? path.replace(
                (new RegExp(`^${rootDir.join('/')}/${alias.parent}/${alias.target}`)),
                `${rootDir.join('/')}/${alias.parent}/${alias.name}`
              )
              : path,
            isDirectory,
            ...(fileInfo ? { fileInfo } : {}),
            ...rest,
          })),
      ]
      const s3contentDir = [
        ...s3data,
        ...(alias && alias.parent === dirPath
          /* eslint-disable @stylistic/indent */
          ? [{
            ...alias,
            ...(s3data.find(({ name }) => name === alias.target) || {}),
            name: alias.name,
            path: `${s3ObjectPath}/${alias.name}`,
          }]
          /* eslint-enable @stylistic/indent */
          : []),
      ].sort(
        (a, b) => (
          a.name.localeCompare(b.name)
          || Number(a.isDirectory) - Number(b.isDirectory)
        )
      )

      return {
        props: {
          title: ['data', ...paramPath].join('/') || '',
          path: paramPathRaw || [],
          data: s3contentDir || [],
          config,
        },
      }
    }

    console.warn(`[${formattedDate} - ERROR]`, 'S3 Object - Try access to unknown object:', s3DirPath)
    res.statusCode = 404
    return {
      props: { errorCode: 404 },
    }
  }

  return { props: {} }
}
