const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: {type: String, required: 'Ce champ est obligatoire'},
  email: {type: String, unique: true, required: 'Ce Champs est obligatoire'},
  password: {type: String, required: 'Le mot de passe est obligatoire'},
  createdAt: {type: Date},
  updatedAt: {type: Date},
  lastLogin: {type: Date},
  isVerified: {type: Boolean, default: false},
  isAdmin: {type: Boolean, default: false},
  isDeleted: {type: Boolean, default: false},
  bals: {type: Array}
})

const Bal = mongoose.model('Bal', new mongoose.Schema({
  balId: {type: String, unique: true}
}))

const Token = mongoose.model('Token', new mongoose.Schema({
  userId: {type: mongoose.ObjectId, required: true, ref: 'User'},
  token: {type: String, required: true},
  createdAt: {type: Date, required: true, expires: 43200, default: Date.now}
}))

module.exports = {
  User,
  Token,
  Bal
}
