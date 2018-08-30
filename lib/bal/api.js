export default class BAL {
  constructor(tree) {
    this.communes = tree && tree.communes ? tree.communes : null
  }

  // GETTER
  // COMMUNE
  async getCommunes() {
    return this.communes
  }

  async getCommune(codeCommune) {
    return this.communes[codeCommune] || null
  }

  // VOIE
  async getVoie(idVoie) {
    const codes = idVoie.split('-')
    const codeCommune = codes[0]
    const codeVoie = codes[1]

    return this.communes[codeCommune].voies[codeVoie] || null
  }

  // NUMERO
  async getNumero(idNumero) {
    const codes = idNumero.split('-')
    const codeCommune = codes[0]
    const codeVoie = codes[1]
    const codeNumero = codes[2]

    return this.communes[codeCommune].voies[codeVoie].numeros[codeNumero] || null
  }

  // SETTER

  // CREATE
  async createCommune(code, commune) {
    if (await this.getCommune(code)) {
      throw new Error('La commune existe déjà.')
    }

    const newCommune = {
      ...commune,
      voies: {},
      source: [],
      dateMAJ: null,
      created: true
    }

    this.communes[code] = newCommune

    return newCommune
  }

  async createVoie(codeCommune, voie) {
    const commune = await this.getCommune(codeCommune)

    if (!commune) {
      throw new Error('La commune n’existe pas.')
    }

    if (await this.getVoie(voie.idVoie)) {
      throw new Error('La voie existe déjà.')
    }

    const newVoie = {
      ...voie,
      numeros: {},
      source: [],
      dateMAJ: null,
      created: true
    }

    commune.voies[newVoie.codeVoie] = newVoie

    return newVoie
  }

  async createNumero(idVoie, numero) {
    const voie = await this.getVoie(idVoie)

    if (!voie) {
      throw new Error('La voie n’existe pas.')
    }

    if (await this.getNumero(numero.id)) {
      throw new Error('Le numéro existe déjà.')
    }

    const newNumero = {
      ...numero,
      source: [],
      dateMAJ: null,
      created: true
    }

    voie.numeros[newNumero.numeroComplet] = newNumero

    return newNumero
  }

  // UPDATE
  async updateVoie(idVoie, changes) {
    const voie = await this.getVoie(idVoie)

    if (!voie) {
      throw new Error('La voie n’existe pas.')
    }

    voie.changes = changes

    return voie
  }

  async updateNumero(idNumero, changes) {
    const numero = await this.getNumero(idNumero)

    if (!numero) {
      throw new Error('Le numéro n’existe pas.')
    }

    numero.changes = changes

    return numero
  }

  // DELETE
  async deleteCommune(code) {
    const commune = await this.getCommune(code)

    if (!commune) {
      throw new Error('La commune n’existe pas.')
    }

    if (!commune.created) {
      commune.deleted = true
      return commune
    }

    return delete this.communes[code]
  }

  async deleteVoie(idVoie) {
    const voie = await this.getVoie(idVoie)

    if (!voie) {
      throw new Error('La voie n’existe pas.')
    }

    if (!voie.created) {
      voie.deleted = true
      return voie
    }

    const codes = idVoie.split('-')
    const codeCommune = codes[0]
    const codeVoie = codes[1]

    return delete this.communes[codeCommune].voies[codeVoie]
  }

  async deleteNumero(idNumero) {
    const numero = await this.getNumero(idNumero)

    if (!numero) {
      throw new Error('Le numéro n’existe pas.')
    }

    if (!numero.created) {
      numero.deleted = true
      return numero
    }

    const codes = idNumero.split('-')
    const codeCommune = codes[0]
    const codeVoie = codes[1]
    const codeNumero = codes[2]

    return delete this.communes[codeCommune].voies[codeVoie].numeros[codeNumero]
  }
}

