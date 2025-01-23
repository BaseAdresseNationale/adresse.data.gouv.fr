import type AWS from '@aws-sdk/client-s3'

interface S3ObjectItem {
  Key: string
  LastModified: Date
  ETag: string
  Size: number
}

interface S3ObjectResponse {
  Contents: S3ObjectItem[]
  CommonPrefixes: { Prefix: string }[]
  IsTruncated: boolean
  NextContinuationToken: string
  KeyCount: number
}

interface DirItem {
  name: string
  path: string
  isDirectory: boolean
}
interface ObjectItem extends DirItem {
  fileInfo?: {
    date: string
    hash: string
    size: number
  }
}

interface AsyncSendS3Params {
  Bucket: string
  Key: string
}

interface AsyncSendS3Options {
  params: AsyncSendS3Params
  fileName: string
  metadata?: AWS.HeadObjectCommandOutput
}

interface AliasAction {
  [key: string]: (s3Objects: ObjectItem[], ...regExpStringAndRest: string[]) => ObjectItem | undefined
}
interface Aliase {
  parent: string
  name: string
  target?: string | {
    action: string
    params: string[]
  }
}

export const getFormatedDate = () => {
  const date = new Date()
  const dateFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  return new Intl
    .DateTimeFormat('fr', (dateFormatOptions as Intl.DateTimeFormatOptions))
    .format(date)
    .replace(/,/g, '\'')
    .replace(/ /g, ' ')
}

export const autorizedPathS3 = (path: string) => {
  const isPathIsVisibleFile = !path.startsWith('.')

  return {
    path,
    auth: isPathIsVisibleFile,
  }
}

export const asyncSendS3 = (clientS3: AWS.S3) =>
  (req: Request, res: any, options: AsyncSendS3Options) =>
    new Promise<void>(
      (resolve, reject) => {
        res.setHeader('Content-Length', options.metadata?.ContentLength)
        res.setHeader('Content-Disposition', `attachment; filename="${options.fileName}"`)

        clientS3.getObject(options.params)
          .then(({ Body, AcceptRanges, ContentRange, ContentLength }) => {
            if (AcceptRanges && ContentRange) {
              res.setHeader('Accept-Ranges', AcceptRanges)
              res.setHeader('Content-Range', ContentRange)
              res.setHeader('Content-Length', ContentLength)
              res.statusCode = 206
            }
            (Body as NodeJS.ReadableStream)
              ?.on('error', (err: Error) => {
                const formattedDate = getFormatedDate()
                console.warn(`[${formattedDate} - ERROR]`, 'File access error:', err)
                reject(err)
              })
              ?.on('end', () => {
                resolve()
              })
              .pipe(res)
          })
          .catch((err: Error) => {
            console.error(err)
            reject(err)
          })
      }
    )

// Reccursivly GET S3 Objects
export const listObjectsRecursively = (
  clientS3: AWS.S3,
  bucketName: string
) =>
  async function listObjects(prefix: string, continuationToken?: string): Promise<(ObjectItem)[] | undefined> {
    const params = {
      Bucket: bucketName,
      Prefix: prefix || undefined,
      Delimiter: '/',
      ContinuationToken: continuationToken,
    }

    try {
      const data = (await clientS3.listObjectsV2(params)) as S3ObjectResponse

      if (data.KeyCount <= 0) {
        return undefined
      }

      const filesList: ObjectItem[] = (data.Contents || []).map(({ Key, LastModified, ETag, Size }) => ({
        name: Key.replace(new RegExp(`^${prefix}`), ''),
        path: Key,
        fileInfo: {
          date: LastModified.toString(),
          hash: ETag,
          size: Size,
        },
        isDirectory: false,
      }))
      const dirsList = (data.CommonPrefixes || []).map(({ Prefix }) => ({
        name: Prefix.replace(new RegExp(`^${prefix}`), '').replace(/\/$/, ''),
        path: Prefix,
        isDirectory: true,
      }))
      const nextList: ObjectItem[] = ((data.IsTruncated) && await listObjects(prefix, data.NextContinuationToken)) || []
      return [...filesList, ...dirsList, ...nextList]
    }
    catch (err) {
      console.error('Erreur lors de la récupération de la liste des objets :', err)
    }
  }

const aliasAction: AliasAction = {
  getLatestFromRegExp: (s3Objects, regExpString) => s3Objects
    .filter(({ name }) => ((new RegExp(regExpString)).test(name)))
    .sort((a, b) => new Date(b.name).getTime() - new Date(a.name).getTime())[0],
}

export const getAlias = (clientS3: AWS.S3, bucketName: string) => async (rootDir: string[], aliasesRaw: Aliase[], currentPath: string) => {
  const aliases = aliasesRaw && (
    [...aliasesRaw]
      .sort((a, b) => `${b.parent}${b.name}`.localeCompare(`${a.parent}${a.name}`))
      .reverse()
  )
  const alias = aliases?.find(({ parent }) => (new RegExp(`^${parent}(/|$)`)).test(currentPath)) || null

  if (!alias) {
    return null
  }

  if (typeof alias.target === 'string') {
    return alias
  }

  if (typeof alias.target === 'object' && alias.target.action) {
    const s3ObjectPath = [...rootDir, ...alias.parent.replace(/\/$/, '').split('/')].join('/')
    const s3DirPath = `${s3ObjectPath}/`
    const s3Objects = await listObjectsRecursively(clientS3, bucketName)(s3DirPath)
    const s3data = s3Objects
      ? [...(s3Objects || []).filter(({ name }) => autorizedPathS3(name).auth)]
      : []

    const paraXXX = alias.target?.params
    const targetAlias = aliasAction[alias.target.action](s3data, ...((alias.target?.params) || []))

    return ({
      ...alias,
      target: targetAlias?.name,
    } as Aliase)
  }

  throw new Error('Alias target should be a string, or an object with an action key')
}
