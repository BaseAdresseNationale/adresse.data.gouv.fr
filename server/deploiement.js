const {promisify} = require('util')
const zlib = require('zlib')
const express = require('express')
const app = new express.Router()
const vtpbf = require('vt-pbf')
const geojsonVt = require('geojson-vt')

const {computeStats, fetchStatsData} = require('../lib/util/compute')
const {useCache} = require('../lib/util/cache')

const gzip = promisify(zlib.gzip)

app.use(express.json())

app.route('/couverture-stats')
  .get(async (req, res) => {
    const {codesCommune} = req.query
    const codesCommuneArr = codesCommune?.split(',') || []
    try {
      const statsData = await useCache('stats-data', 300, fetchStatsData)
      const featureCollection = computeStats(statsData, codesCommuneArr)
      res.send(featureCollection)
    } catch (err) {
      return res.status(500).send({code: 500, message: err})
    }
  })

app.route('/couverture-tiles/:z/:x/:y.pbf')
  .get(async (req, res) => {
    const y = Number.parseInt(req.params.y, 10)
    const x = Number.parseInt(req.params.x, 10)
    const z = Number.parseInt(req.params.z, 10)

    if (z > 14) {
      return res.status(204).send()
    }

    try {
      const tileIndex = await useCache('couverture-bal-tiles', 300, async () => {
        const statsData = await useCache('stats-data', 300, fetchStatsData)
        const featureCollection = computeStats(statsData)

        return geojsonVt(featureCollection, {indexMaxZoom: 9})
      })

      const tile = tileIndex.getTile(z, x, y)

      if (!tile) {
        return res.status(204).send()
      }

      const pbf = vtpbf.fromGeojsonVt({communes: tile})

      res.set({
        'Content-Type': 'application/x-protobuf',
        'Content-Encoding': 'gzip'
      })

      res.send(await gzip(Buffer.from(pbf)))
    } catch (err) {
      return res.status(404).send({code: 404, message: err})
    }
  })

module.exports = app
