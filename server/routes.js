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

  router.get('/bases-locales/validateur', (req, res) => {
    app.render(req, res, '/bases-locales/validator', {
      ...req.query
    })
  })

  router.get('/bases-locales/jeux-de-donnees', (req, res) => {
    app.render(req, res, '/bases-locales/datasets', {
      ...req.query
    })
  })

  router.get('/bases-locales/jeux-de-donnees/:id', (req, res) => {
    app.render(req, res, '/bases-locales/datasets/dataset', {
      ...req.query,
      id: req.params.id
    })
  })

  router.get('/bases-locales/jeux-de-donnees/:id/rapport', (req, res) => {
    app.render(req, res, '/bases-locales/datasets/dataset/report', {
      ...req.query,
      id: req.params.id
    })
  })

  router.get('/bases-locales/jeux-de-donnees/:id/:codeCommune', (req, res) => {
    app.render(req, res, '/bases-locales/datasets/dataset/commune', {
      ...req.query,
      id: req.params.id,
      codeCommune: req.params.codeCommune
    })
  })

  router.get('/bases-locales/jeux-de-donnees/:id/:codeCommune/:codeVoie', (req, res) => {
    app.render(req, res, '/bases-locales/datasets/dataset/commune/voie', {
      ...req.query,
      id: req.params.id,
      codeCommune: req.params.codeCommune,
      codeVoie: req.params.codeVoie
    })
  })

  // DO NOT REMOVE
  router.get('/download', (req, res) => {
    res.redirect('/donnees-nationales')
  })

  // DO NOT REMOVE
  router.get('/contrib', (req, res) => {
    res.redirect('/contribuer')
  })

  router.get('*', (req, res) => {
    app.render(req, res, req.params[0], req.query)
  })

  return router
}
