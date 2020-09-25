const express = require('express')
const next = require('next')
const compression = require('compression')

const {check} = require('express-validator')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const morgan = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const {User} = require('./lib/api-user/models')
const {
  login,
  createUser,
  emailVerification,
  tokenRenewal,
  renewPasswordToken,
  passwordRenewal,
  userEdition,
  showUser,
  logout,
  w
} = require('./lib/api-user/user-functions')

mongoose.connect('mongodb://localhost:27017/api-user', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
async (email, password, cb) => {
  try {
    const user = await User.findOne({email})

    if (!user) {
      return cb(null, false, {msg: 'Cet email n’existe pas'})
    }

    if (await bcrypt.compare(password, user.password)) {
      cb(null, user)
    } else {
      cb(null, false, {msg: 'Le mot de passe est incorrect'})
    }
  } catch (error) {
    cb(error)
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    cb(err, user)
  })
})

app.prepare().then(() => {
  const server = express()

  if (!dev) {
    server.use(compression())
  }

  server.use(express.json())
  server.use(morgan('dev'))

  server.use(
    session({
      secret: 'Ceci n’est pas une phrase secrète...',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({mongooseConnection: mongoose.connection})
    })
  )

  server.use(passport.initialize())
  server.use(passport.session())

  // - - - - - || Api-user : || - - - - - //

  server.get('/api-users/me', showUser)

  server.post('/api-users/login',
    [
      check('email', 'Problème dans l’adresse électronique').isEmail(),
      check('password', 'Problème dans le mote de passe').not().isEmpty()
    ],
    passport.authenticate('local'),
    login
  )

  server.post('/api-users/logout', logout)

  server.post('/api-users/create-user',
    [
      check('name').not().isEmpty().withMessage('Le nom est nécessaire'),
      check('email', 'Une adresse électronique valide est nécessaire').isEmail(),
      check('password', 'Un mot de passe de cinq caractères ou plus est nécessaire').isLength({min: 5})
    ],
    w(createUser)
  )

  server.get('/api-users/confirmation/:token', w(emailVerification))

  // - - - - - || End Api-user || - - - - - //

  server.get('/nous-contacter', (req, res) => {
    app.render(req, res, '/contact')
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
