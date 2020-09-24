const {User, Token} = require('./models')
const {validationResult} = require('express-validator')
const {v4: uuidv4} = require('uuid')
const {sendMail} = require('./sendMail')
const bcrypt = require('bcrypt')

// Async
function w(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

// Login
function connexion(req, res) {
  const errors = validationResult(req).array()
  if (errors && errors.length > 0) {
    return res.send(errors)
  }

  if (req.user.isDeleted) {
    return res.status(500).send({msg: 'Cet utilisateur a été supprimé'})
  }

  const updateLogin = async () => {
    await User.findOneAndUpdate({email: req.user.email}, {lastLogin: new Date()})
  }

  try {
    updateLogin()
    res.send({
      authenticated: Boolean(req.user),
      user: req.user
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({msg: 'Connexion impossible'})
  }
}

// Logout
function logout(req, res) {
  if (!req.user) {
    return res.sendStatus(401)
  }

  req.logout()
  res.sendStatus(200)
}

// Afficher l’utilisateur
function showUser(req, res) {
  if (req.user && !req.user.isDeleted) {
    res.send(req.user)
  } else {
    res.sendStatus(401)
  }
}

// Creation d’un utilisateur
async function createUser(req, res) {
  const errors = validationResult(req).array()

  if (errors && errors.length > 0) {
    return res.status(400).send(errors[0])
  }

  if (await User.findOne({email: req.body.email})) {
    return res.status(409).send({msg: 'Cette adresse est déjà utilisée'})
  }

  const user = new User(req.body)
  user.password = await bcrypt.hash(user.password, 10)
  user.createdAt = new Date()
  const uuid = uuidv4()
  const token = new Token({userId: user._id, token: uuid})
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Validation Email',
    text: `Bonjour ${user.firstName}, merci de valider votre adresse : ${process.env.SITE_URL}/api-users/confirmation/${token.token}`
  }

  await token.save()
  await user.save()
  await sendMail(mailOptions, user.email)
  res.status(200).send({msg: 'Le mail a été envoyé à ' + user.email})
}

// Vérification de l’adresse mail
async function emailVerification(req, res) {
  const token = req.params.token
  const user = req.user

  if (!user) {
    return res.status(500).send('<h4>Merci de vous connecter avant de vérifier votre email</h4>')
  }

  const userToken = await Token.findOne({userId: user._id})

  if (userToken && userToken.token === token) {
    try {
      await User.findOneAndUpdate({_id: user._id}, {isVerified: true}, {new: true})
      await Token.findOneAndRemove({userId: user._id})
      res.redirect('/')
    } catch (error) {
      console.log(error)
    }
  } else {
    res.send('<h4>Le jeton n’est pas valide</h4>')
  }
}

// Renouvellement du jeton de validation email
async function tokenRenewal(req, res) {
  if (Token.findOne({userId: req.user._id})) {
    await Token.remove({userId: req.user._id})
  }

  const user = req.user
  const uuid = uuidv4()
  const token = new Token({userId: user._id, token: uuid})
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: 'Validation Email',
    text: `Bonjour ${user.firstName}, merci de valider votre adresse : ${process.env.SITE_URL}/api-users/confirmation/${token.token}`
  }

  if (user.isVerified) {
    return res.status(400).send({msg: 'Cet email a déjà été vérifié'})
  }

  await token.save()
  await sendMail(mailOptions, user.email)
  res.status(200).send({msg: 'Le mail a été envoyé à ' + user.email})
}

// Renouvellemenent du jeton de modification de mot de passe
async function renewPasswordToken(req, res) {
  const errors = validationResult(req).array()

  if (errors && errors.length > 0) {
    return res.send(errors[0])
  }

  const email = req.body.email
  const user = await User.findOne({email})

  if (user && !user.isDeleted) {
    if (Token.findOne({userId: user._id})) {
      await Token.findOneAndRemove({userId: user._id})
    }

    const uuid = uuidv4()
    const token = new Token({userId: user._id, token: uuid})
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Bonjour ${user.firstName}, pour modifier votre mot de passe, merci de cliquer sur ce lien : ${process.env.SITE_URL}/new-password?token=${token.token}`
    }

    console.log(mailOptions)
    await token.save()
    await sendMail(mailOptions, email)
    res.status(200).send({msg: 'Un email a été envoyé à ' + email})
  } else {
    res.send({msg: 'Email introuvable'})
  }
}

// Renouvellement du mot de passe
async function passwordRenewal(req, res) {
  const errors = validationResult(req).array()

  if (errors && errors.length > 0) {
    return res.send(errors[0])
  }

  const token = req.body.token
  const password = req.body.password

  try {
    const userToken = await Token.findOne({token})
    const user = await User.findOne({_id: userToken.userId})
    user.password = await bcrypt.hash(password, 10)
    await Token.findOneAndRemove({_id: userToken._id})
    await User.findOneAndUpdate({_id: user._id}, {password: user.password, updatedAt: new Date(), lastLogin: new Date()})
    req.login(user, () => {
      res.send({msg: 'Félicitations, votre mot de passe a été mis à jour'})
    })
  } catch (error) {
    console.log(error)
    res.send({msg: 'Le jeton n’est plus valide'})
  }
}

// Edition de l’utilisateur
async function userEdition(req, res) {
  const verifEmail = await User.findOne({email: req.body.email})
  const errors = validationResult(req).array()

  if (errors && errors.length > 0) {
    return res.status(500).send(errors[0])
  }

  const _id = req.body._id
  const user = await User.findOne({_id})

  if (user.email === req.body.email) {
    try {
      await User.findOneAndUpdate({_id},
        {
          isVerified: user.isVerified,
          name: req.body.name,
          firstName: req.body.firstName,
          email: req.body.email,
          updatedAt: new Date()
        })
      res.status(200).send({msg: 'Vos informations ont bien été mises à jour'})
    } catch (error) {
      console.log(error)
    }
  } else {
    try {
      if (verifEmail) {
        return res.status(500).send({msg: 'Cet Email est déjà utilisé'})
      }

      const uuid = uuidv4()
      const token = new Token({userId: user._id, token: uuid})
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Validation Email',
        text: `Bonjour ${user.firstName}, merci de valider votre adresse : ${process.env.SITE_URL}/api-users/confirmation/${token.token}`
      }

      try {
        await token.save()
        await sendMail(mailOptions, req.body.email)
        await User.findOneAndUpdate({_id},
          {
            isVerified: false,
            name: req.body.name,
            firstName: req.body.firstName,
            email: req.body.email,
            updatedAt: new Date()
          })
        res.status(200).send({msg: 'Vos informations ont bien été mises à jour, Merci d’ouvrir le lien reçu par mail pour confirmer votre adresse'})
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = {
  connexion,
  createUser,
  emailVerification,
  tokenRenewal,
  renewPasswordToken,
  passwordRenewal,
  userEdition,
  showUser,
  logout,
  w
}
