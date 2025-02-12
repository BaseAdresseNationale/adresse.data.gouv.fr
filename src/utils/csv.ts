import Papa from 'papaparse'

export const parseCSV = async (csv: string) => {
  return new Promise(async (resolve, reject) => {
    Papa.parse(csv, {
      skipEmptyLines: true,
      delimiter: ';',
      complete: (res: Record<string, any>) => {
        resolve(res)
      },
      error: () => {
        reject(Error('Impossible de parser ce fichier.'))
      },
    })
  })
}
