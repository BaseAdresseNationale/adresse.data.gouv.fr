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
  return new Intl.DateTimeFormat('fr', dateFormatOptions)
    .format(date)
    .replace(/,/g, '\'')
    .replace(/ /g, ' ')
}

export const autorizedPathS3 = path => {
  const isPathIsVisibleFile = !path.startsWith('.')

  return {
    path,
    auth: isPathIsVisibleFile
  }
}

export const asyncSendS3 = clientS3 => (req, res, {params, fileName, metadata}) => new Promise(
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
export const listObjectsRecursively = (clientS3, bucketName) => (
  async function listObjects(prefix, continuationToken) {
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
      // Const nextList = (data.IsTruncated) ? await listObjectsRecursively(bucketName, prefix, data.NextContinuationToken) : []
      const nextList = (data.IsTruncated) ? await listObjects(prefix, data.NextContinuationToken) : []
      return [...filesList, ...dirsList, ...nextList]
    } catch (err) {
      console.error('Erreur lors de la récupération de la liste des objets :', err)
    }
  }
)

const aliasAction = {
  getLatestFromRegExp: (s3Objects, regExpString) => s3Objects
    .filter(({name}) => ((new RegExp(regExpString)).test(name)))
    .sort((a, b) => new Date(b.name) - new Date(a.name))[0]
}

export const getAlias = (clientS3, bucketName) => async (rootDir, aliasesRaw, currentPath) => {
  const aliases = aliasesRaw && (
    [...aliasesRaw]
      .sort((a, b) => `${b.parent}${b.name}`.localeCompare(`${a.parent}${a.name}`))
      .reverse()
  )
  const alias = aliases?.find(({parent}) => (new RegExp(`^${parent}(/|$)`)).test(currentPath)) || null

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
    const s3data = s3Objects ? [
      ...(s3Objects || [])
        .filter(({name}) => autorizedPathS3(name).auth),
    ] : []

    const targetAlias = aliasAction[alias.target.action](s3data, ...(alias.target?.params || []))

    return {
      ...alias,
      target: targetAlias.name,
    }
  }

  throw new Error('Alias target should be a string, or an object with an action key')
}
