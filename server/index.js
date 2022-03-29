require('dotenv').config()

const express = require('express')
const next = require('next')
const compression = require('compression')
const helmet = require('helmet')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const enableHelmet = process.env.ENABLE_HELMET === '1'
const app = next({dev})
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (!dev) {
    server.use(compression())
  }

  if (enableHelmet) {
    server.use(helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'default-src': [
            '\'self\''
          ],
          'child-src': [
            '\'self\'',
            'data:',
            'blob:',
            '*.sibforms.com'
          ],
          'connect-src': [
            'api-adresse.data.gouv.fr',
            'backend.adresse.data.gouv.fr',
            'plateforme.adresse.data.gouv.fr',
            'etablissements-publics.api.gouv.fr',
            'geo.api.gouv.fr',
            'openmaptiles.geo.data.gouv.fr',
            'openmaptiles.github.io',
            'wxs.ign.fr',
            'orangemug.github.io',
            'stats.data.gouv.fr'
          ],
          'font-src': [
            '\'self\''
          ],
          'img-src': [
            '\'self\'',
            'data:',
            'blob:'
          ],
          'script-src': [
            '\'self\'',
            'stats.data.gouv.fr'
          ],
          'script-src-attr': null,
          'style-src': [
            '\'self\'',
            '\'unsafe-inline\''
          ]
        }
      },
      hsts: false,
      dnsPrefetchControl: false
    }))
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

  server.use('/proxy-api-depot', require('./proxy-api-depot'))

  // DO NOT REMOVE
  server.get('/api', (request, res) => {
    res.redirect('/api-doc')
  })

  // DO NOT REMOVE
  server.get('/download', (request, res) => {
    res.redirect('/donnees-nationales')
  })

  // DO NOT REMOVE
  server.get('/contrib', (request, res) => {
    res.redirect('/contribuer')
  })

  // DO NOT REMOVE
  server.get('/guides', (request, res) => {
    res.redirect('/ressources')
  })

  server.get('/map', (request, res) => {
    res.redirect('/base-adresse-nationale')
  })

  server.get('/validateur', (request, res) => {
    res.redirect('/bases-locales/validateur')
  })

  // DO NOT REMOVE
  server.get('/tools', (request, res) => {
    res.redirect('/outils')
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
