import BAL from '../../../lib/bal/api'

let TREE = {}

describe('BAL', () => {
  beforeEach(() => {
    TREE = {
      communes: {
        1: {
          voies: {
            1: {
              numeros: {
                1: {}
              }
            }
          }
        }
      }
    }
  })

  describe('Create new BAL', () => {
    test('should return null when create without tree', async () => {
      const bal = new BAL(null)
      const communes = await bal.getCommunes()

      expect(communes).toEqual(null)
    })

    test('should return communes when create with tree', async () => {
      const bal = new BAL(TREE)
      const communes = await bal.getCommunes()

      expect(communes).toEqual(TREE.communes)
    })
  })

  describe('getCommune', () => {
    test('should return commune', async () => {
      const bal = new BAL(TREE)
      const commune = await bal.getCommune('1')

      expect(commune).toBe(TREE.communes[1])
    })

    test('should return null when commune do not exist', async () => {
      const bal = new BAL(TREE)
      const commune = await bal.getCommune('42')

      expect(commune).toBeNull()
    })
  })

  describe('getVoie', () => {
    test('should return voie', async () => {
      const bal = new BAL(TREE)
      const voie = await bal.getVoie('1', '1')

      expect(voie).toBe(TREE.communes[1].voies[1])
    })

    test('should return null when voie do not exist', async () => {
      const bal = new BAL(TREE)
      const voie = await bal.getVoie('1', '42')

      expect(voie).toBeNull()
    })
  })

  describe('getNumero', () => {
    test('should return numero', async () => {
      const bal = new BAL(TREE)
      const numero = await bal.getNumero('1', '1', '1')

      expect(numero).toBe(TREE.communes[1].voies[1].numeros[1])
    })

    test('should return null when numero do not exist', async () => {
      const bal = new BAL(TREE)
      const numero = await bal.getNumero('1', '1', '42')

      expect(numero).toBeNull()
    })
  })

  describe('createCommune', () => {
    test('should create a new commune and add it to BAL', async () => {
      const bal = new BAL(TREE)
      const newCommune = {
        created: true,
        dateMAJ: null,
        source: [],
        voies: {}
      }

      expect(await bal.createCommune('2', {})).toEqual(newCommune)
      expect(await bal.getCommune('2')).toEqual(newCommune)
    })

    test('should throw an error when commune already exist', async () => {
      const bal = new BAL(TREE)
      await expect(bal.createCommune('1', {})).rejects.toThrow('La commune existe déjà.')
    })
  })

  describe('createVoie', () => {
    test('should create a new voie and add it to BAL', async () => {
      const bal = new BAL(TREE)
      const voie = {
        codeVoie: '2',
        created: true,
        dateMAJ: null,
        source: [],
        numeros: {}
      }

      expect(await bal.createVoie('1', {codeVoie: '2'})).toEqual(voie)
      expect(await bal.getVoie('1', '2')).toEqual(voie)
    })

    test('should throw an error when commune do not exist', async () => {
      const bal = new BAL(TREE)
      const voie = {codeVoie: '2'}

      await expect(bal.createVoie('42', voie)).rejects.toThrow('La commune n’existe pas.')
    })

    test('should throw an error when voie already exist', async () => {
      const bal = new BAL(TREE)
      const voie = {codeVoie: '1'}

      await expect(bal.createVoie('1', voie)).rejects.toThrow('La voie existe déjà.')
    })
  })

  describe('createNumero', () => {
    test('should create a new numero and add it to BAL', async () => {
      const bal = new BAL(TREE)
      const numero = {
        numeroComplet: '2',
        created: true,
        source: [],
        dateMAJ: null
      }

      expect(await bal.createNumero('1', '1', {numeroComplet: '2'})).toEqual(numero)
      expect(await bal.getNumero('1', '1', '2')).toEqual(numero)
    })

    test('should throw an error when voie do not exist', async () => {
      const bal = new BAL(TREE)
      const numero = {numeroComplet: '2'}

      await expect(bal.createNumero('1', '42', numero)).rejects.toThrow('La voie n’existe pas.')
    })

    test('should throw an error when numero already exist', async () => {
      const bal = new BAL(TREE)
      const numero = {numeroComplet: '1'}

      await expect(bal.createNumero('1', '1', numero)).rejects.toThrow('Le numéro existe déjà.')
    })
  })

  describe('deleteCommune', () => {
    test('should turn "delete" attribute to true', async () => {
      const bal = new BAL(TREE)

      expect(await bal.deleteCommune('1')).toEqual({
        ...TREE.communes[1],
        deleted: true
      })
    })

    test('should remove commune from BAL when "created" is true', async () => {
      const bal = new BAL(TREE)
      await bal.createCommune('2', {})

      expect(await bal.deleteCommune('2')).toBeTruthy()
      expect(await bal.getCommune('2')).toBeNull()
    })

    test('should throw an error when commune do not exist', async () => {
      const bal = new BAL(TREE)

      await expect(bal.deleteCommune('42')).rejects.toThrow('La commune n’existe pas.')
    })
  })

  describe('deleteVoie', () => {
    test('should turn "delete" attribute to true', async () => {
      const bal = new BAL(TREE)

      expect(await bal.deleteVoie('1', '1')).toEqual({
        ...TREE.communes[1].voies[1],
        deleted: true
      })
    })

    test('should remove voie from BAL when "created" is true', async () => {
      const bal = new BAL(TREE)
      const voie = {codeVoie: '2'}
      await bal.createVoie('1', voie)

      expect(await bal.deleteVoie('1', '2')).toBeTruthy()
      expect(await bal.getVoie('1', '2')).toBeNull()
    })

    test('should throw an error when commune do not exist', async () => {
      const bal = new BAL(TREE)

      await expect(bal.deleteVoie('1', '42')).rejects.toThrow('La voie n’existe pas.')
    })
  })

  describe('deleteNumero', () => {
    test('should turn "delete" attribute to true', async () => {
      const bal = new BAL(TREE)

      expect(await bal.deleteNumero('1', '1', '1')).toEqual({
        ...TREE.communes[1].voies[1].numeros[1],
        deleted: true
      })
    })

    test('should remove numero from BAL when "created" is true', async () => {
      const bal = new BAL(TREE)
      const numero = {numeroComplet: '2'}
      await bal.createNumero('1', '1', numero)

      expect(await bal.deleteNumero('1', '1', '2')).toBeTruthy()
      expect(await bal.getNumero('1', '1', '2')).toBeNull()
    })

    test('should throw an error when numero do not exist', async () => {
      const bal = new BAL(TREE)

      await expect(bal.deleteNumero('1', '1', '42')).rejects.toThrow('Le numéro n’existe pas.')
    })
  })

  describe('renameVoie', () => {
    test('should set changes to voie', async () => {
      const bal = new BAL(TREE)

      expect(await bal.renameVoie('1', '1', 'new name')).toEqual({
        ...TREE.communes[1].voies[1],
        edited: true,
        change: {
          type: 'rename',
          value: 'new name'
        }
      })
    })

    test('should throw an error when voie do not exist', async () => {
      const bal = new BAL(TREE)

      await expect(bal.renameVoie('1', '2', {})).rejects.toThrow('La voie n’existe pas.')
    })
  })

  describe('updateNumero', () => {
    test('should set changes to numero', async () => {
      const bal = new BAL(TREE)
      const change = {type: 'rename', value: 'new name'}

      expect(await bal.updateNumero('1', '1', '1', change)).toEqual({
        ...TREE.communes[1].voies[1].numeros[1],
        edited: true,
        change
      })
    })

    test('should throw an error when numero do not exist', async () => {
      const bal = new BAL(TREE)

      await expect(bal.updateNumero('1', '1', '2', {})).rejects.toThrow('Le numéro n’existe pas.')
    })
  })

  describe('getNumeroPosition', () => {
    test('should return numero position', async () => {
      const bal = new BAL(TREE)
      const numero = {
        id: '1-1-2',
        numero: '2',
        numeroComplet: '2',
        positions: [{coords: [0, 0]}]
      }

      await bal.createNumero('1', '1', numero)
      const position = await bal.getNumeroPosition('1', '1', numero.numeroComplet)

      expect(position).toEqual({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0]
        },
        properties: {
          id: numero.id,
          numero: numero.numeroComplet,
          numeroComplet: numero.numeroComplet
        }
      })
    })

    test('should return an error when numero do not exist', async () => {
      const bal = new BAL(TREE)
      await expect(bal.getNumeroPosition('1', '1', '42')).rejects.toThrow('Le numéro n’existe pas.')
    })
  })

  describe('getVoiePositions', () => {
    test('should return all numeros positions of voie', async () => {
      // TODO
    })

    test('should return an error when voie do not exist', async () => {
      const bal = new BAL(TREE)
      await expect(bal.getVoiePositions('1', '42')).rejects.toThrow('La voie n’existe pas.')
    })
  })

  describe('getCommunePositions', () => {
    test('should return all numeros positions of commune', async () => {
      // TODO
    })

    test('should return an error when commune do not exist', async () => {
      const bal = new BAL(TREE)
      await expect(bal.getCommunePositions('42')).rejects.toThrow('La commune n’existe pas.')
    })
  })

  describe('cancelCommuneChanges', () => {
    test('should reset all commune changes', async () => {
      const bal = new BAL(TREE)
      await bal.deleteCommune('1')

      expect(await bal.cancelCommuneChange('1')).toEqual({
        ...TREE.communes[1],
        deleted: false
      })
    })

    test('should remove commune when created by user', async () => {
      const bal = new BAL(TREE)

      await bal.createCommune('2')

      expect(await bal.cancelCommuneChange('2')).toBeTruthy()
    })
  })

  describe('cancelVoieChanges', () => {
    test('should reset all voie changes', async () => {
      const bal = new BAL(TREE)
      await bal.renameVoie('1', '1', 'test')

      expect(await bal.cancelVoieChange('1', '1')).toEqual({
        numeros: {
          1: {}
        },
        change: null,
        edited: false,
        deleted: false
      })
    })

    test('should remove voie when created by user', async () => {
      const bal = new BAL(TREE)
      const voie = {
        codeVoie: '2',
        created: true,
        dateMAJ: null,
        source: [],
        numeros: {}
      }

      await bal.createVoie('1', voie)

      expect(await bal.cancelVoieChange('1', '2')).toBeTruthy()
    })
  })

  describe('cancelNumeroChanges', () => {
    test('should reset all numero changes', async () => {
      const bal = new BAL(TREE)
      const change = {type: 'rename', value: 'new name'}

      await bal.updateNumero('1', '1', '1', change)

      expect(await bal.cancelNumeroChange('1', '1', '1')).toEqual({
        change: null,
        edited: false,
        deleted: false
      })
    })

    test('should remove numero when created by user', async () => {
      const bal = new BAL(TREE)
      const numero = {
        numero: '2',
        numeroComplet: '2',
        positions: [{coords: [0, 0]}]
      }

      await bal.createNumero('1', '1', numero)

      expect(await bal.cancelNumeroChange('1', '1', numero.numeroComplet)).toBeTruthy()
    })
  })
})
