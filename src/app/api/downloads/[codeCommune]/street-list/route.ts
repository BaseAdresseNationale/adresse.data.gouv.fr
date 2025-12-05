import { getAdressesCsvBal } from '@/lib/api-ban'
import { getCurrentRevisionDownloadUrl } from '@/lib/api-depot'
import { parseCSV } from '@/utils/csv'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, props: { params: Promise<{ codeCommune: string }> }) {
  const params = await props.params;
  try {
    const from = request.nextUrl.searchParams.get('from') || 'ban'

    const fileToFetchUrl = from === 'ban' ? getAdressesCsvBal(params.codeCommune, '1.4') : getCurrentRevisionDownloadUrl(params.codeCommune)

    const response = await fetch(fileToFetchUrl, {
      headers: {
        'Content-Type': 'text/csv',
      },
    })
    const csvFile = await response.text()

    const { data: parsedCSV } = await parseCSV(csvFile) as { data: string[][] }
    const headers = parsedCSV[0]
    const data = parsedCSV.slice(1)

    const numeroIndex = headers.findIndex(header => header === 'numero')

    const nameIndexes = headers
      .map((cell, index) => {
        if (cell.startsWith('voie_nom')) {
          return index
        }
      })
      .filter(index => index !== undefined) as number[]

    const lieutDitComplementIndex = headers.findIndex(header => header === 'lieudit_complement_nom')

    const resultVoies = data
      .reduce((acc: Record<string, any>, row: string[]) => {
        if (!acc[row[nameIndexes[0]]] && row[numeroIndex] !== '99999') {
          acc[row[nameIndexes[0]]] = nameIndexes.reduce((voieAcc: Record<string, any>, voieIndex) => {
            voieAcc[headers[voieIndex]] = row[voieIndex]

            return voieAcc
          }, {
            type: 'voie',
            number_count: 1,
            numbers: [row[numeroIndex]],
          })
        }
        else if (row[numeroIndex] !== '99999' && !acc[row[nameIndexes[0]]].numbers.includes(row[numeroIndex])) {
          acc[row[nameIndexes[0]]].number_count++
          acc[row[nameIndexes[0]]].numbers.push(row[numeroIndex])
        }

        return acc
      }, {})

    const resultLieuxDits = data
      .reduce((acc: Record<string, any>, row: string[]) => {
        if (!acc[row[nameIndexes[0]]] && row[numeroIndex] === '99999') {
          const nomLieuDit = row[nameIndexes[0]]
          const relatedNumeros = data.filter(row => row[lieutDitComplementIndex] === nomLieuDit)
          acc[nomLieuDit] = nameIndexes.reduce((ldAcc: Record<string, any>, nameIndex) => {
            ldAcc[headers[nameIndex]] = row[nameIndex]

            return ldAcc
          }, {
            type: 'lieux-dit',
            number_count: relatedNumeros.length,
            numbers: relatedNumeros.map(row => row[numeroIndex]),
          })
        }

        return acc
      }, {})

    const resultHeaders = [...nameIndexes.map(index => headers[index]), 'type', 'number_count', 'numbers']

    const resultVoiesData = Object.values(resultVoies)
      .map(voies => resultHeaders.map(header => voies[header]).join(';'))
      .sort((a, b) => a.localeCompare(b))

    const resultLieuxDitsData = Object.values(resultLieuxDits)
      .map(lieuxDits => resultHeaders.map(header => lieuxDits[header]).join(';'))
      .sort((a, b) => a.localeCompare(b))

    const fileHeaders = resultHeaders.map(header => header.replace('voie_', '')).join(';')

    return new NextResponse([fileHeaders, ...resultVoiesData, ...resultLieuxDitsData].join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="liste-voies-et-lieux-dits-${params.codeCommune}.csv"`,
      },
    })
  }
  catch (error) {
    console.error(`Error generating number list for commune ${params.codeCommune} :`, error)
    return NextResponse.json({ error: 'Error generating number list' }, { status: 500 })
  }
}
