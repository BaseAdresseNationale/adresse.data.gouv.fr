const resetItem = item => {
  item.modified = null
  item.edited = false
  item.deleted = false
  item.created = false
}

export default class BAL {
  constructor(tree) {
    this.communes = tree && tree.communes ? tree.communes : {}
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
  async getVoie(codeCommune, codeVoie) {
    const commune = this.communes[codeCommune]

    if (commune) {
      return commune.voies[codeVoie] || null
    }

    return null
  }

  // NUMERO
  async getNumero(codeCommune, codeVoie, numeroComplet) {
    const commune = this.communes[codeCommune]

    if (commune) {
      const voie = commune.voies[codeVoie]

      if (voie) {
        return voie.numeros[numeroComplet] || null
      }
    }

    return null
  }

  // POSITIONS
  async getNumeroPosition(codeCommune, codeVoie, numeroComplet) {
    const numero = await this.getNumero(codeCommune, codeVoie, numeroComplet)

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
        numeroComplet: numero.numeroComplet
      }
    }
  }

  async getVoiePositions(codeCommune, codeVoie) {
    const voie = await this.getVoie(codeCommune, codeVoie)
    const positions = []

    if (!voie) {
      throw new Error('La voie n’existe pas.')
    }

    if (voie.numeros) {
      voie.numeros.forEach(async numero => {
        const position = await this.getNumero(codeCommune, codeVoie, numero.numeroComplet)
        positions.push(position)
      })
    }

    return positions
  }

  async getCommunePositions(codeCommune) {
    const commune = await this.getCommune(codeCommune)
    const positions = []

    if (!commune) {
      throw new Error('La commune n’existe pas.')
    }

    if (commune.voies) {
      commune.voies.forEach(async voie => {
        const voiePositions = await this.getPositionsFromVoie(codeCommune, voie.codeVoie)

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

    if (await this.getVoie(codeCommune, voie.codeVoie)) {
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

  async createNumero(codeCommune, codeVoie, numero) {
    const voie = await this.getVoie(codeCommune, codeVoie)

    if (!voie) {
      throw new Error('La voie n’existe pas.')
    }

    if (await this.getNumero(codeCommune, codeVoie, numero.numeroComplet)) {
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
  async renameVoie(codeCommune, codeVoie, newName) {
    const voie = await this.getVoie(codeCommune, codeVoie)
    const commune = await this.getCommune(codeCommune)

    if (!voie) {
      throw new Error('La voie n’existe pas.')
    }

    if (!commune) {
      throw new Error('La commune n’existe pas.')
    }

    voie.edited = true
    voie.modified = {
      nomVoie: newName
    }

    return voie
  }

  async updateNumero(codeCommune, codeVoie, numeroComplet, modified) {
    const numero = await this.getNumero(codeCommune, codeVoie, numeroComplet)

    if (!numero) {
      throw new Error('Le numéro n’existe pas.')
    }

    numero.edited = true
    numero.modified = {...modified}

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

  async deleteVoie(codeCommune, codeVoie) {
    const voie = await this.getVoie(codeCommune, codeVoie)

    if (!voie) {
      throw new Error('La voie n’existe pas.')
    }

    if (!voie.created) {
      voie.deleted = true
      return voie
    }

    return delete this.communes[codeCommune].voies[codeVoie]
  }

  async deleteNumero(codeCommune, codeVoie, numeroComplet) {
    const numero = await this.getNumero(codeCommune, codeVoie, numeroComplet)

    if (!numero) {
      throw new Error('Le numéro n’existe pas.')
    }

    if (!numero.created) {
      numero.deleted = true
      return numero
    }

    return delete this.communes[codeCommune].voies[codeVoie].numeros[numeroComplet]
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

  async cancelVoieChange(codeCommune, codeVoie) {
    const voie = await this.getVoie(codeCommune, codeVoie)

    if (voie.created) {
      return delete this.communes[codeCommune].voies[codeVoie]
    }

    resetItem(voie)

    return voie
  }

  async cancelNumeroChange(codeCommune, codeVoie, numeroComplet) {
    const numero = await this.getNumero(codeCommune, codeVoie, numeroComplet)

    if (numero.created) {
      return delete this.communes[codeCommune].voies[codeVoie].numeros[numeroComplet]
    }

    resetItem(numero)

    return numero
  }
}

