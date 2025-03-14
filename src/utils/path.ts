import { fileURLToPath } from 'url'
import path from 'path'

export function getRootPath() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const root_path = path.resolve(__dirname, '../..')

  return root_path
}
