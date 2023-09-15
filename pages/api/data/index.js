import {readdir, readFile, lstat} from 'node:fs/promises'
import path from 'path'

const PATH = process.env.NEXT_PUBLIC_PATH_STATIC_FILE

const getDirectories = async dirPath =>
  (await readdir(dirPath, {withFileTypes: true}))
    .map(entry => ({name: entry.name, isDirectory: entry.isDirectory()}))

export default async function handler(req, res) {
  try {
    const {path: paramPath = ''} = req.query
    const absolutePath = path.join(PATH, paramPath)
    let stat
    try {
      stat = await lstat(absolutePath)
    } catch {
      res.status(404).send()
      return
    }

    if (stat.isFile()) {
      const fileContent = await readFile(absolutePath)
      res.setHeader('content-disposition', `attachment; filename="${absolutePath.split('/').pop()}"`)
      res.status(200)
      res.send(fileContent)
    } else {
      const data = await getDirectories(absolutePath)
      res.status(200).json({data})
    }
  } catch (err) {
    console.log(err)
    res.status(500).send()
  }
}
