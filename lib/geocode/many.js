import Papa from 'papaparse'

const DELIMITER = ';'
const GENERATED_FILE_NAME = 'generated.csv'

export default async function geocodeMany(inputFile, encoding, columns) {
  const parsedInputFile = await parse(inputFile, {encoding, skipEmptyLines: true})

  // Build CSV request
  const csvRequest = Papa.unparse(parsedInputFile, {delimiter: DELIMITER})

  // Build request
  const requestBody = new FormData()
  columns.forEach(c => requestBody.append('columns', c))
  requestBody.append('delimiter', DELIMITER)
  requestBody.append('data', new Blob([csvRequest], {type: 'text/csv; charset=utf-8'}), GENERATED_FILE_NAME)

  // Request + handle response
  const response = await fetch('https://api-adresse.data.gouv.fr/search/csv/', {method: 'POST', body: requestBody})
  return response.blob()
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
