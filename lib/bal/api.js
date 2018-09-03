const hasChange = item => {
  return item.created || item.deleted || item.edited
}

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

  // POSITIONS
  async getNumeroPosition(idNumero) {
    const numero = await this.getNumero(idNumero)

    if (!numero) {
      throw new Error('Le numéro n’existe pas.')
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: numero.positions[0].coords
      },
      properties: {
        id: numero.id,
        numero: numero.numero,
        source: numero.source
      }
    }
  }

  async getVoiePositions(idVoie) {
    const voie = await this.getVoie(idVoie)
    const positions = []

    if (!voie) {
      throw new Error('La voie n’existe pas.')
    }

    if (voie.numeros) {
      voie.numeros.forEach(async numero => {
        const position = await this.getNumero(numero)
        positions.push(position)
      })
    }

    return positions
  }

  async getCommunePositions(idCommune) {
    const commune = await this.getCommune(idCommune)
    const positions = []

    if (!commune) {
      throw new Error('La commune n’existe pas.')
    }

    if (commune.voies) {
      commune.voies.forEach(async voie => {
        const voiePositions = await this.getPositionsFromVoie(voie.idVoie)

        voiePositions.forEach(feature => {
          positions.push(feature)
        })
      })
    }

    return positions
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
  async renameVoie(idVoie, newName) {
    const voie = await this.getVoie(idVoie)
    const commune = await this.getCommune(idVoie.split('-')[0])

    if (!voie) {
      throw new Error('La voie n’existe pas.')
    }

    if (!commune) {
      throw new Error('La commune n’existe pas.')
    }

    voie.edited = true
    voie.change = {type: 'rename', value: newName}

    return voie
  }

  async updateNumero(idNumero, change) {
    const numero = await this.getNumero(idNumero)

    if (!numero) {
      throw new Error('Le numéro n’existe pas.')
    }

    numero.edited = true
    numero.change = change

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

  // CANCEL
  async cancelCommuneChange(codeCommune) {
    const commune = await this.getCommune(codeCommune)

    if (!commune) {
      throw new Error('La commune n’existe pas.')
    }

    if (commune.created) {
      return delete this.communes[codeCommune]
    }

    commune.deleted = false

    return commune
  }

  async cancelVoieChange(idVoie) {
    const voie = await this.getVoie(idVoie)

    if (voie.created) {
      return delete this.communes[idVoie.split('-')[0]].voies[idVoie]
    }

    voie.change = null
    voie.edited = false
    voie.deleted = false

    return voie
  }

  async cancelNumeroChange(idNumero) {
    const numero = await this.getNumero(idNumero)

    if (numero.created) {
      const codeCommune = idNumero.split('-')[0]
      const codeVoie = idNumero.split('-')[1]
      return delete this.communes[codeCommune].voies[codeVoie].numeros[idNumero]
    }

    numero.change = null
    numero.edited = false
    numero.deleted = false

    return numero
  }
}

