const express = require('express')
const next = require('next')
const compression = require('compression')
const HttpProxy = require('http-proxy')

const BACKEND_PROXY_URL = process.env.BACKEND_PROXY_URL || 'https://backend.adresse.data.gouv.fr'

const proxy = new HttpProxy()

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (!dev) {
    server.use(compression())
  }

  server.use('/backend', (req, res) => {
    proxy.web(req, res, {target: BACKEND_PROXY_URL, changeOrigin: true})
  })

  server.get('/explore/commune/:code', (req, res) => {
    app.render(req, res, '/explore/commune', {
      ...req.query,
      codeCommune: req.params.code
    })
  })

  server.get('/explore/commune/:codeCommune/voie/:idVoie', (req, res) => {
    app.render(req, res, '/explore/commune/voie', {
      ...req.query,
      codeCommune: req.params.codeCommune,
      idVoie: req.params.idVoie
    })
  })

  server.get('/explore/commune/:codeCommune/voie/:idVoie/numero/:numero', (req, res) => {
    app.render(req, res, '/explore/commune/voie', {
      ...req.query,
      codeCommune: req.params.codeCommune,
      idVoie: req.params.idVoie,
      numero: req.params.numero
    })
  })

  server.get('/bases-locales/validateur', (req, res) => {
    app.render(req, res, '/bases-locales/validator', {
      ...req.query
    })
  })

  server.get('/bases-locales/jeux-de-donnees', (req, res) => {
    app.render(req, res, '/bases-locales/datasets', {
      ...req.query
    })
  })

  server.get('/bases-locales/jeux-de-donnees/:id', (req, res) => {
    app.render(req, res, '/bases-locales/datasets/dataset', {
      ...req.query,
      id: req.params.id
    })
  })

  server.get('/bases-locales/jeux-de-donnees/:id/rapport', (req, res) => {
    app.render(req, res, '/bases-locales/datasets/dataset/report', {
      ...req.query,
      id: req.params.id
    })
  })

  server.get('/bases-locales/jeux-de-donnees/:id/:codeCommune', (req, res) => {
    app.render(req, res, '/bases-locales/datasets/dataset/commune', {
      ...req.query,
      id: req.params.id,
      codeCommune: req.params.codeCommune
    })
  })

  server.get('/bases-locales/jeux-de-donnees/:id/:codeCommune/:codeVoie', (req, res) => {
    app.render(req, res, '/bases-locales/datasets/dataset/commune/voie', {
      ...req.query,
      id: req.params.id,
      codeCommune: req.params.codeCommune,
      codeVoie: req.params.codeVoie
    })
  })

  // DO NOT REMOVE
  server.get('/api', (req, res) => {
    res.redirect('https://geo.api.gouv.fr/adresse')
  })

  // DO NOT REMOVE
  server.get('/download', (req, res) => {
    res.redirect('/donnees-nationales')
  })

  // DO NOT REMOVE
  server.get('/contrib', (req, res) => {
    res.redirect('/contribuer')
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) {
      throw err
    }

    console.log(`> Ready on http://localhost:${port}`)
  })
})
