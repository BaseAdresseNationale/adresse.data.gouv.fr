const express = require('express')
const next = require('next')
const compression = require('compression')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (!dev) {
    server.use(compression())
  }

  server.get('/nous-contacter', (req, res) => {
    app.render(req, res, '/contact')
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
