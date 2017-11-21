import Papa from 'papaparse'

const DELIMITER = ';'
const GENERATED_FILE_NAME = 'generated.csv'

export default async function geocodeMany(inputFile, encoding, columns) {
  const parsedInput = await parse(inputFile, {header: true, encoding, skipEmptyLines: true})

  const field2cMap = {}
  const c2fieldMap = {}

  // Build column name substitution mapping
  parsedInput.meta.fields.forEach((fieldName, i) => {
    const c = `c_${i}`
    c2fieldMap[c] = fieldName
    field2cMap[fieldName] = c
  })

  // Substitute column name
  const preparedData = parsedInput.data.map(row => {
    const obj = {}
    Object.keys(row).forEach(fieldName => {
      obj[field2cMap[fieldName]] = row[fieldName]
    })
    return obj
  })

  // Build CSV request
  const csvRequest = Papa.unparse(preparedData, {header: Object.keys(c2fieldMap), delimiter: DELIMITER})

  // Build request
  const requestBody = new FormData()
  columns.forEach(c => requestBody.append('columns', field2cMap[c]))
  requestBody.append('delimiter', DELIMITER)
  requestBody.append('data', new Blob([csvRequest], {type: 'text/csv; charset=utf-8'}), GENERATED_FILE_NAME)

  // Request + handle response
  const response = await fetch('https://api-adresse.data.gouv.fr/search/csv/', {method: 'POST', body: requestBody})
  const responseText = await response.text()
  const parsedResponse = await parse(responseText, {header: true, skipEmptyLines: true})

  // Unsusbstitute column name
  const processedResponse = parsedResponse.data.map(row => {
    const obj = {}
    parsedResponse.meta.fields.forEach(colName => {
      if (colName in c2fieldMap) {
        obj[c2fieldMap[colName]] = row[colName]
      } else {
        obj[colName] = row[colName]
      }
    })
    return obj
  })

  return new Blob([Papa.unparse(processedResponse, {delimiter: DELIMITER})])
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
