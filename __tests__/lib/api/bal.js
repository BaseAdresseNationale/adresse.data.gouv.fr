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
      const commune = await bal.getCommune(1)

      expect(commune).toBe(TREE.communes[1])
    })

    test('should return null when commune do not exist', async () => {
      const bal = new BAL(TREE)
      const commune = await bal.getCommune(42)

      expect(commune).toBeNull()
    })
  })

  describe('getVoie', () => {
    test('should return voie', async () => {
      const bal = new BAL(TREE)
      const voie = await bal.getVoie('1-1')

      expect(voie).toBe(TREE.communes[1].voies[1])
    })

    test('should return null when voie do not exist', async () => {
      const bal = new BAL(TREE)
      const voie = await bal.getVoie('1-42')

      expect(voie).toBeNull()
    })
  })

  describe('getNumero', () => {
    test('should return numero', async () => {
      const bal = new BAL(TREE)
      const numero = await bal.getNumero('1-1-1')

      expect(numero).toBe(TREE.communes[1].voies[1].numeros[1])
    })

    test('should return null when numero do not exist', async () => {
      const bal = new BAL(TREE)
      const numero = await bal.getNumero('1-1-42')

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
      const voie = {idVoie: '1-2', codeVoie: '2'}
      const newVoie = {
        ...voie,
        created: true,
        dateMAJ: null,
        source: [],
        numeros: {}
      }

      expect(await bal.createVoie('1', voie)).toEqual(newVoie)
      expect(await bal.getVoie('1-2')).toEqual(newVoie)
    })

    test('should throw an error when commune do not exist', async () => {
      const bal = new BAL(TREE)
      const voie = {idVoie: '42-2', codeVoie: '2'}

      await expect(bal.createVoie('42', voie)).rejects.toThrow('La commune n’existe pas.')
    })

    test('should throw an error when voie already exist', async () => {
      const bal = new BAL(TREE)
      const voie = {idVoie: '1-1', codeVoie: '1'}

      await expect(bal.createVoie('1', voie)).rejects.toThrow('La voie existe déjà.')
    })
  })

  describe('createNumero', () => {
    test('should create a new numero and add it to BAL', async () => {
      const bal = new BAL(TREE)
      const numero = {id: '1-1-2', numeroComplet: '2'}
      const newNumero = {
        ...numero,
        created: true,
        source: [],
        dateMAJ: null
      }

      expect(await bal.createNumero('1-1', numero)).toEqual(newNumero)
      expect(await bal.getNumero('1-1-2')).toEqual(newNumero)
    })

    test('should throw an error when voie do not exist', async () => {
      const bal = new BAL(TREE)
      const numero = {id: '1-1-2', numeroComplet: '2'}

      await expect(bal.createNumero('1-42', numero)).rejects.toThrow('La voie n’existe pas.')
    })

    test('should throw an error when numero already exist', async () => {
      const bal = new BAL(TREE)
      const numero = {id: '1-1-1', numeroComplet: '1'}

      await expect(bal.createNumero('1-1', numero)).rejects.toThrow('Le numéro existe déjà.')
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

      expect(await bal.deleteVoie('1-1')).toEqual({
        ...TREE.communes[1].voies[1],
        deleted: true
      })
    })

    test('should remove voie from BAL when "created" is true', async () => {
      const bal = new BAL(TREE)
      const voie = {idVoie: '1-2', codeVoie: '2'}
      await bal.createVoie('1', voie)

      expect(await bal.deleteVoie('1-2')).toBeTruthy()
      expect(await bal.getVoie('1-2')).toBeNull()
    })

    test('should throw an error when commune do not exist', async () => {
      const bal = new BAL(TREE)

      await expect(bal.deleteVoie('1-42')).rejects.toThrow('La voie n’existe pas.')
    })
  })

  describe('deleteNumero', () => {
    test('should turn "delete" attribute to true', async () => {
      const bal = new BAL(TREE)

      expect(await bal.deleteNumero('1-1-1')).toEqual({
        ...TREE.communes[1].voies[1].numeros[1],
        deleted: true
      })
    })

    test('should remove numero from BAL when "created" is true', async () => {
      const bal = new BAL(TREE)
      const numero = {id: '1-1-2', numeroComplet: '2'}
      await bal.createNumero('1-1', numero)

      expect(await bal.deleteNumero('1-1-2')).toBeTruthy()
      expect(await bal.getNumero('1-1-2')).toBeNull()
    })

    test('should throw an error when numero do not exist', async () => {
      const bal = new BAL(TREE)

      await expect(bal.deleteNumero('1-1-42')).rejects.toThrow('Le numéro n’existe pas.')
    })
  })

  describe('updateVoie', () => {
    test('should set changes to voie', async () => {
      const bal = new BAL(TREE)
      const changes = {type: 'rename', value: 'new name'}

      expect(await bal.updateVoie('1-1', changes)).toEqual({
        ...TREE.communes[1].voies[1],
        changes
      })
    })

    test('should throw an error when voie do not exist', async () => {
      const bal = new BAL(TREE)

      await expect(bal.updateVoie('1-2', {})).rejects.toThrow('La voie n’existe pas.')
    })
  })

  describe('updateNumero', () => {
    test('should set changes to numero', async () => {
      const bal = new BAL(TREE)
      const changes = {type: 'rename', value: 'new name'}

      expect(await bal.updateNumero('1-1-1', changes)).toEqual({
        ...TREE.communes[1].voies[1].numeros[1],
        changes
      })
    })

    test('should throw an error when numero do not exist', async () => {
      const bal = new BAL(TREE)

      await expect(bal.updateNumero('1-1-2', {})).rejects.toThrow('Le numéro n’existe pas.')
    })
  })
})
