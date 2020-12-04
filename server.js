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

  server.get('/nous-contacter', (request, res) => {
    app.render(request, res, '/contact')
  })

  server.get('/explore/commune/:code', (request, res) => {
    app.render(request, res, '/explore/commune', {
      ...request.query,
      codeCommune: request.params.code
    })
  })

  server.get('/explore/commune/:codeCommune/voie/:idVoie', (request, res) => {
    app.render(request, res, '/explore/commune/voie', {
      ...request.query,
      codeCommune: request.params.codeCommune,
      idVoie: request.params.idVoie
    })
  })

  server.get('/explore/commune/:codeCommune/voie/:idVoie/numero/:numero', (request, res) => {
    app.render(request, res, '/explore/commune/voie', {
      ...request.query,
      codeCommune: request.params.codeCommune,
      idVoie: request.params.idVoie,
      numero: request.params.numero
    })
  })

  server.get('/base-adresse-nationale/commune/:codeCommune/voie/:idVoie/numero/:numero', (request, res) => {
    app.render(request, res, '/base-adresse-nationale', {
      ...request.query,
      codeCommune: request.params.codeCommune,
      idVoie: request.params.idVoie,
      numero: request.params.numero
    })
  })

  server.get('/bases-locales/validateur', (request, res) => {
    app.render(request, res, '/bases-locales/validator', {
      ...request.query
    })
  })

  server.get('/bases-locales/jeux-de-donnees', (request, res) => {
    app.render(request, res, '/bases-locales/datasets', {
      ...request.query
    })
  })

  server.get('/bases-locales/jeux-de-donnees/:id', (request, res) => {
    app.render(request, res, '/bases-locales/datasets/dataset', {
      ...request.query,
      id: request.params.id
    })
  })

  server.get('/bases-locales/jeux-de-donnees/:id/rapport', (request, res) => {
    app.render(request, res, '/bases-locales/datasets/dataset/report', {
      ...request.query,
      id: request.params.id
    })
  })

  server.get('/bases-locales/jeux-de-donnees/:id/:codeCommune', (request, res) => {
    app.render(request, res, '/bases-locales/datasets/dataset/commune', {
      ...request.query,
      id: request.params.id,
      codeCommune: request.params.codeCommune
    })
  })

  server.get('/bases-locales/jeux-de-donnees/:id/:codeCommune/:codeVoie', (request, res) => {
    app.render(request, res, '/bases-locales/datasets/dataset/commune/voie', {
      ...request.query,
      id: request.params.id,
      codeCommune: request.params.codeCommune,
      codeVoie: request.params.codeVoie
    })
  })

  // DO NOT REMOVE
  server.get('/api', (request, res) => {
    res.redirect('https://geo.api.gouv.fr/adresse')
  })

  // DO NOT REMOVE
  server.get('/download', (request, res) => {
    res.redirect('/donnees-nationales')
  })

  // DO NOT REMOVE
  server.get('/contrib', (request, res) => {
    res.redirect('/contribuer')
  })

  server.get('*', (request, res) => {
    return handle(request, res)
  })

  server.listen(port, err => {
    if (err) {
      throw err
    }

    console.log(`> Ready on http://localhost:${port}`)
  })
})
