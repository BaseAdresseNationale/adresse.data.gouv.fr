import { customFetch } from '@/lib/fetch'
import { NextRequest, NextResponse } from 'next/server'
import { env } from 'next-runtime-env'

export async function GET(request: NextRequest, { params }: { params: { codeCommune: string } }) {
  try {
    const url = new URL(`${env('NEXT_PUBLIC_API_GEO_URL')}/communes/${params.codeCommune}`)
    url.searchParams.append('fields', 'bbox')
    const communeWithBBox = await customFetch(url)
    const rawBbox = communeWithBBox.bbox.coordinates[0]

    const bbox = [rawBbox[0][0], rawBbox[0][1], rawBbox[2][0], rawBbox[2][1]]

    const jobResponse = await fetch('https://api.get-map.org/apis/jobs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Carte de ${communeWithBBox.nom}`,
        bbox_top: bbox[3],
        bbox_left: bbox[0],
        bbox_bottom: bbox[1],
        bbox_right: bbox[2],
        language: 'fr_FR.UTF-8',
      }),
    })

    const response = await jobResponse.json()
    const jobId = response.id

    let jobStatusResponseJSON
    let maxAttempts = 50

    do {
      const jobStatusResponse = await fetch(`https://api.get-map.org/apis/jobs/${jobId}`)
      jobStatusResponseJSON = await jobStatusResponse.json()
      await new Promise(resolve => setTimeout(resolve, 2000))
      maxAttempts--
    } while (jobStatusResponseJSON.status !== 2 && maxAttempts > 0)

    if (jobStatusResponseJSON.status !== 2 || maxAttempts === 0) {
      throw new Error('Error generating printable map')
    }

    return NextResponse.json({ mapUrl: jobStatusResponseJSON.files.pdf })
  }
  catch (error) {
    console.error(`Error generating printable map ${params.codeCommune} :`, error)
    return NextResponse.json({ error: 'Error generating printable map' }, { status: 500 })
  }
}
