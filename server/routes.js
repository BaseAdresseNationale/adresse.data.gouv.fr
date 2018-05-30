const {Router} = require('express')

module.exports = app => {
  const router = new Router()

  router.get('/explore/commune/:code', (req, res) => {
    app.render(req, res, '/explore/commune', {
      ...req.query,
      codeCommune: req.params.code
    })
  })

  router.get('/explore/commune/:codeCommune/voie/:code', (req, res) => {
    app.render(req, res, '/explore/commune/voie', {
      ...req.query,
      codeCommune: req.params.codeCommune,
      codeVoie: req.params.code
    })
  })

  router.get('/explore/commune/:codeCommune/voie/:code/numero/:numero', (req, res) => {
    app.render(req, res, '/explore/commune/voie', {
      ...req.query,
      codeCommune: req.params.codeCommune,
      codeVoie: req.params.code,
      numero: req.params.numero
    })
  })

  router.get('/bases-locales/jeux-de-donnees/:id', (req, res) => {
    app.render(req, res, '/bases-locales/jeux-de-donnees/dataset', {
      ...req.query,
      id: req.params.id
    })
  })

  router.get('/bases-locales/jeux-de-donnees/:id/:report', (req, res) => {
    app.render(req, res, '/bases-locales/jeux-de-donnees/dataset', {
      ...req.query,
      id: req.params.id,
      report: req.params.report
    })
  })

  router.get('*', (req, res) => {
    app.render(req, res, req.params[0], req.query)
  })

  return router
}
