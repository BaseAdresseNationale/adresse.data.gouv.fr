import { parse } from 'csv-parse'

export const parseCSV = (csv: string) => {
  return new Promise((resolve, reject) => {
    const parser = parse({
      delimiter: ';',
    })

    const records: string[] = []

    parser.on('readable', function () {
      let record
      while ((record = parser.read()) !== null) {
        records.push(record)
      }
    })

    parser.on('end', function () {
      resolve(records)
    })

    parser.on('error', function (err) {
      reject(err)
    })

    parser.write(csv)
    parser.end()
  })
}
