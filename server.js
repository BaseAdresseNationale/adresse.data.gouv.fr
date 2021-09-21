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

  server.get('/bases-locales/validateur', (request, res) => {
    app.render(request, res, '/bases-locales/validator', {
      ...request.query
    })
  })
  server.get('/base-adresse-nationale/:id', (request, res) => {
    app.render(request, res, '/base-adresse-nationale', {
      ...request.query,
      id: request.params.id
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

  server.get('/bases-locales/jeux-de-donnees/:id/:codeCommune', (req, res) => {
    res.redirect(`/base-adresse-nationale/${req.params.codeCommune}`)
  })

  // DO NOT REMOVE
  server.get('/api', (request, res) => {
    res.redirect('api-doc')
  })

  // DO NOT REMOVE
  server.get('/download', (request, res) => {
    res.redirect('/donnees-nationales')
  })

  // DO NOT REMOVE
  server.get('/contrib', (request, res) => {
    res.redirect('/contribuer')
  })

  server.get('/map', (request, res) => {
    res.redirect('/base-adresse-nationale')
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
