import { env } from 'next-runtime-env'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { customFetch } from '@/lib/fetch'
import { getRootPath } from './path'
import path from 'path'

const END_DATE_SAFETY_MARGIN_MS = 5 * 60 * 1000

export async function downloadLastNewsletters() {
  // Keep a small safety margin to avoid providers rejecting a date seen as "in the future".
  const to = Date.now() - END_DATE_SAFETY_MARGIN_MS
  const from = new Date(to - 1000 * 60 * 60 * 24 * 30 * 12) // Last 12 months
  let count = 0
  let offset = 0

  const rootPath = getRootPath()
  const directoryPath = path.join(rootPath, 'data', 'newsletters')

  if (existsSync(directoryPath)) {
    console.log('Cleaning newsletters directory...')
    rmSync(directoryPath, { recursive: true })
  }

  console.log('Downloading newsletters...')

  const newsletters: any[] = []

  try {
    do {
      const { campaigns, count: _count } = await customFetch(
          `${env('NEXT_PUBLIC_BREVO_API_URL')}/emailCampaigns?status=sent&limit=30&offset=${offset}&startDate=${from.toISOString()}&endDate=${new Date(
            to
          ).toISOString()}`,
          {
            headers: {
              'accept': 'application/json',
              'content-type': 'application/json',
              'api-key': env('BREVO_API_KEY'),
            } as RequestInit['headers'],
            cache: 'force-cache',
          }
      )

      count = _count
      offset += campaigns.length

      const filteredCampaigns = campaigns
        .filter((campaign: any) => campaign.name.includes('adresse.data.gouv.fr'))

      newsletters.push(...filteredCampaigns)
    } while (offset < count)

    newsletters
      .map((campaign: any) => ({
        name: campaign.name,
        htmlContent: campaign.htmlContent
          .replace('Voir la version en ligne', '')
          .replace('Se désinscrire', ''),
      })
      )
      .forEach((campaign: any, index: number) => {
        if (!existsSync(directoryPath)) {
          mkdirSync(directoryPath, { recursive: true })
        }
        const fileName = `${index}__${campaign.name}.html`
        writeFileSync(path.join(directoryPath, fileName), campaign.htmlContent)
      })

    console.log('Newsletters downloaded')
  }
  catch (error) {
    console.error('Error downloading campaigns:', error)
  }
}
