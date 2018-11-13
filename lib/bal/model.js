import {find, max} from 'lodash'
import {exportAsCsv} from './export-csv'

export function today() {
  return (new Date()).toISOString().substr(0, 10)
}

function resetItem(item) {
  item.modified = null
  item.edited = false
  item.deleted = false
}

function findVoieNameInCommune(commune, name) {
  return find(commune.voies, voie => voie.nomVoie === name)
}

export default class BAL {
  constructor(tree) {
    this._id = Math.random().toString(36).substr(2, 9)
    this.communes = tree && tree.communes ? tree.communes : {}
    this._codesVoieGenerationSeq = {}
  }

  // GETTER
  // COMMUNE
  getCommunes() {
    return this.communes
  }

  getCommune(codeCommune) {
    return this.communes[codeCommune]
  }

  // VOIE
  getVoie(codeCommune, codeVoie) {
    const commune = this.communes[codeCommune]

    if (commune) {
      return commune.voies[codeVoie]
    }
  }

  // NUMERO
  getNumero(codeCommune, codeVoie, numeroComplet) {
    const commune = this.communes[codeCommune]

    if (commune) {
      const voie = commune.voies[codeVoie]

      if (voie) {
        return voie.numeros ? voie.numeros[numeroComplet] : null
      }
    }
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

    if (findVoieNameInCommune(commune, voie.nomVoie)) {
      throw new Error(`Une voie se nomme déjà ${voie.nomVoie}.`)
    }

    if (!voie.codeVoie) {
      voie.codeVoie = this.generateCodeVoie(codeCommune)
    } else if (await this.getVoie(codeCommune, voie.codeVoie)) {
      throw new Error('La voie existe déjà.')
    }

    const newVoie = {
      ...voie,
      source: [],
      dateMAJ: today(),
      created: true
    }

    if (!newVoie.position) {
      newVoie.numeros = {}
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
      dateMAJ: today(),
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

    if (findVoieNameInCommune(commune, newName)) {
      throw new Error(`Une voie se nomme déjà ${newName}.`)
    }

    voie.edited = true
    voie.modified = {
      nomVoie: newName,
      dateMAJ: today()
    }

    return voie
  }

  async repositionVoie(codeCommune, codeVoie, position) {
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
      position,
      dateMAJ: today()
    }

    return voie
  }

  async updateNumero(codeCommune, codeVoie, numeroComplet, modified) {
    const numero = await this.getNumero(codeCommune, codeVoie, numeroComplet)

    if (!numero) {
      throw new Error('Le numéro n’existe pas.')
    }

    numero.edited = true
    numero.modified = {...modified, dateMAJ: today()}

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

    commune.deleted = false

    return commune
  }

  async cancelVoieChange(codeCommune, codeVoie) {
    const voie = await this.getVoie(codeCommune, codeVoie)

    resetItem(voie)

    return voie
  }

  async cancelNumeroChange(codeCommune, codeVoie, numeroComplet) {
    const numero = await this.getNumero(codeCommune, codeVoie, numeroComplet)

    resetItem(numero)

    return numero
  }

  generateCodeVoie(codeCommune) {
    if (!(codeCommune in this.communes)) {
      throw new Error('Commune non présente dans le fichier')
    }
    if (!(codeCommune in this._codesVoieGenerationSeq)) {
      const {voies} = this.communes[codeCommune]
      const codesVoiesTemp = Object.keys(voies)
        .filter(codeVoie => codeVoie.startsWith('Z'))
      if (codesVoiesTemp.length === 0) {
        this._codesVoieGenerationSeq[codeCommune] = 0
      } else {
        this._codesVoieGenerationSeq[codeCommune] = max(
          codesVoiesTemp.map(codeVoie => Number.parseInt(codeVoie.substr(1), 10))
        )
      }
    }
    return `Z${(++this._codesVoieGenerationSeq[codeCommune]).toString().padStart(3, '0')}`
  }

  exportAsCsv() {
    return exportAsCsv({communes: this.communes})
  }
}
