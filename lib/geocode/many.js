import Papa from 'papaparse'

import {csv} from '../api-adresse'

const DELIMITER = ';'
const GENERATED_FILE_NAME = 'generated.csv'

export default async function geocodeMany(inputFile, encoding, filters, columns) {
  const parsedInput = await parse(inputFile, {header: true, encoding, skipEmptyLines: true})

  const columnName2columnId = {}
  const columnId2columnName = {}

  // Build column name substitution mapping
  parsedInput.meta.fields.forEach((columnName, i) => {
    const columnId = `c_${i}`
    columnId2columnName[columnId] = columnName
    columnName2columnId[columnName] = columnId
  })

  // Substitute column name
  const preparedData = parsedInput.data.map(row => {
    const obj = {}
    Object.keys(row).forEach(columnName => {
      obj[columnName2columnId[columnName]] = row[columnName]
    })
    return obj
  })

  // Build CSV request
  const csvRequest = Papa.unparse(preparedData, {header: Object.keys(columnId2columnName), delimiter: DELIMITER})

  // Build request
  const requestBody = new FormData()
  columns.forEach(c => requestBody.append('columns', columnName2columnId[c]))
  filters.forEach(f => requestBody.append(f.name, columnName2columnId[f.value]))
  requestBody.append('delimiter', DELIMITER)
  requestBody.append('data', new Blob([csvRequest], {type: 'text/csv; charset=utf-8'}), GENERATED_FILE_NAME)

  // Execute request + handle response
  const response = await csv(requestBody)
  const responseText = await response.text()
  const parsedResponse = await parse(responseText, {header: true, skipEmptyLines: true})

  // Unsubstitute column name
  const processedResponse = parsedResponse.data.map(row => {
    const obj = {}
    parsedResponse.meta.fields.forEach(columnName => {
      if (columnName in columnId2columnName) {
        obj[columnId2columnName[columnName]] = row[columnName]
      } else {
        obj[columnName] = row[columnName]
      }
    })
    return obj
  })

  return new Blob([
    Papa.unparse(processedResponse, {delimiter: DELIMITER})
  ], {type: 'text/csv; charset=utf-8'})
}

function parse(str, options) {
  return new Promise((resolve, reject) => {
    Papa.parse(str, {
      ...options,
      complete: res => resolve(res),
      error: err => reject(err)
    })
  })
}
