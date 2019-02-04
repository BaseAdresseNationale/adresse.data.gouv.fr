/* eslint camelcase: off */
import {filter, pick, flatten, uniq, maxBy} from 'lodash'
import {unparse} from 'papaparse'
import proj from '@etalab/project-legal'

function filterActiveItems(items) {
  return filter(items, item => !item.deleted)
}

const COMMUNE_PROPERTIES = ['code', 'nom']
const VOIE_PROPERTIES = ['idVoie', 'codeVoie', 'nomVoie', 'source', 'dateMAJ']
const NUMERO_PROPERTIES = ['id', 'numeroComplet', 'numero', 'suffixe', 'source', 'dateMAJ']
const POSITION_PROPERTIES = ['type', 'coords', 'dateMAJ', 'source']

function computeProperties(item, keys) {
  const initialProperties = pick(item, keys)
  return item.modified ? {...initialProperties, ...item.modified} : initialProperties
}

function applyChanges(tree) {
  const communes = filterActiveItems(tree.communes || [])
    .map(commune => {
      const voies = filterActiveItems(commune.voies || [])
        .map(voie => {
          const numeros = filterActiveItems(voie.numeros || [])
            .map(numero => {
              const positions = filterActiveItems(numero.positions || [])
                .map(position => computeProperties(position, POSITION_PROPERTIES))
              return {...computeProperties(numero, NUMERO_PROPERTIES), positions}
            })
          const position = voie.position ? computeProperties(voie.position, POSITION_PROPERTIES) : {}
          return {...computeProperties(voie, VOIE_PROPERTIES), numeros, position}
        })
      return {...computeProperties(commune, COMMUNE_PROPERTIES), voies}
    })
  return {communes}
}

function splitNumeroComplet(numeroComplet) {
  if (!numeroComplet) {
    return {numero: '', suffixe: ''}
  }

  const result = numeroComplet.match(/^(\d+)/g)
  if (!result) {
    throw new Error('Numero complet non valide : ' + numeroComplet)
  }

  const [numero] = result
  const suffixe = numero.length < numeroComplet.length ? numeroComplet.substr(numero.length) : ''
  return {numero, suffixe}
}

function roundCoordinate(coordinate, precision) {
  return parseFloat(coordinate.toFixed(precision))
}

function formatCleInterop(codeCommune, codeVoie, numero, suffixe) {
  const str = `${codeCommune}_${codeVoie}_${numero.padStart(5, '0')}`
  if (!suffixe) {
    return str.toLowerCase()
  }

  return (str + '_' + suffixe).toLowerCase()
}

function createRow(obj) {
  const {numero, suffixe} = splitNumeroComplet(obj.numeroComplet)
  const row = {
    cle_interop: formatCleInterop(obj.codeCommune, obj.codeVoie, numero, suffixe),
    uid_adresse: '',
    voie_nom: obj.nomVoie,
    numero,
    suffixe,
    commune_nom: obj.nomCommune,
    position: '',
    long: '',
    lat: '',
    x: '',
    y: '',
    source: obj.source.join(','),
    date_der_maj: obj.dateMAJ
  }
  if (obj.position && obj.position.coords) {
    const {coords, type} = obj.position
    const projectedCoords = proj(coords)
    row.position = type
    row.long = roundCoordinate(coords[0], 6)
    row.lat = roundCoordinate(coords[1], 6)
    if (projectedCoords) {
      row.x = projectedCoords[0]
      row.y = projectedCoords[1]
    }
  }

  return row
}

function mergeSources(...sources) {
  return uniq(flatten(sources))
}

function mergeDatesMAJ(...datesMAJ) {
  return maxBy(datesMAJ, dateMAJ => new Date(dateMAJ))
}

function serializeCompactTree(tree) {
  const rows = []
  tree.communes.forEach(commune => {
    const communeCtx = {codeCommune: commune.code, nomCommune: commune.nom}
    commune.voies.forEach(voie => {
      const voieCtx = {
        ...communeCtx,
        idVoie: voie.idVoie,
        nomVoie: voie.nomVoie,
        codeVoie: voie.codeVoie,
        source: voie.source,
        dateMAJ: voie.dateMAJ // TODO: Merge
      }
      if (voie.numeros.length > 0) {
        voie.numeros.forEach(numero => {
          const numeroCtx = {
            ...voieCtx,
            numeroComplet: numero.numeroComplet,
            source: mergeSources(numero.source, voie.source),
            dateMAJ: mergeDatesMAJ(numero.dateMAJ, voie.dateMAJ)
          }
          if (numero.positions.length > 0) {
            numero.positions.forEach(position => {
              rows.push(createRow({
                ...numeroCtx,
                position,
                source: mergeSources(voie.source, numero.source, position.source),
                dateMAJ: mergeDatesMAJ(numero.dateMAJ, voie.dateMAJ, position.dateMAJ)
              }))
            })
          } else {
            rows.push(createRow({
              ...numeroCtx,
              source: mergeSources(voie.source, numero.source)
            }))
          }
        })
      } else if (voie.position) {
        rows.push(createRow({
          ...voieCtx,
          numeroComplet: '99999',
          position: voie.position
        }))
      } else {
        rows.push(createRow({
          ...voieCtx,
          numeroComplet: '99999'
        }))
      }
    })
  })
  return rows
}

export function exportAsCsv(data) {
  const unparseOptions = {
    delimiter: ';',
    header: true,
    newline: '\r\n'
  }
  return unparse(serializeCompactTree(applyChanges(data)), unparseOptions)
}
