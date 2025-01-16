import { getCurrentRevisionDownloadUrl } from '@/lib/api-depot'
import { parseCSV } from '@/utils/csv'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { codeCommune: string } }) {
  try {
    const response = await fetch(getCurrentRevisionDownloadUrl(params.codeCommune), {
      headers: {
        'Content-Type': 'text/csv',
      },
    })
    const csvFile = await response.text()

    const parsedCSV = await parseCSV(csvFile) as string[][]

    const headers = parsedCSV[0]
    const data = parsedCSV.slice(1)

    const numeroIndex = headers.findIndex(header => header === 'numero')

    const voieIndexes = headers
      .map((cell, index) => {
        if (cell.startsWith('voie_nom')) {
          return index
        }
      })
      .filter(index => index !== undefined) as number[]

    const result = data
      .reduce((acc: Record<string, any>, row: string[]) => {
        if (!acc[row[voieIndexes[0]]] && row[numeroIndex] !== '99999') {
          acc[row[voieIndexes[0]]] = voieIndexes.reduce((voieAcc: Record<string, string>, voieIndex) => {
            voieAcc[headers[voieIndex]] = row[voieIndex]

            return voieAcc
          }, {})
        }

        return acc
      }, {})

    const resultHeaders = voieIndexes.map(index => headers[index])

    const resultData = Object.values(result)
      .map(voies => resultHeaders.map(header => voies[header] || '').join(';'))
      .sort((a, b) => a.localeCompare(b))

    return new NextResponse([resultHeaders.join(';'), ...resultData].join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="liste-voies-${params.codeCommune}.csv"`,
      },
    })
  }
  catch (error) {
    console.error(`Error generating number list for commune ${params.codeCommune} :`, error)
    return NextResponse.json({ error: 'Error generating number list' }, { status: 500 })
  }
}
