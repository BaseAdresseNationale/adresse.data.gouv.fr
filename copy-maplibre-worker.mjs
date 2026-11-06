import { copyFile } from 'node:fs/promises'

await copyFile(
  'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs',
  'public/maplibre-gl-worker.mjs',
)
