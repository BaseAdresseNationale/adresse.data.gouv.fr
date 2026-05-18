import { env } from 'next-runtime-env'
import { customFetch } from '@/lib/fetch'
import { getRootPath } from './path'
import path from 'path'

const END_DATE_SAFETY_MARGIN_MS = 5 * 60 * 1000

export async function downloadLastNewsletters() {
  const { access, mkdir, rm, writeFile } = await import(/* webpackIgnore: true */ 'fs/promises')

  // Keep a small safety margin to avoid providers rejecting a date seen as "in the future".
  const to = Date.now() - END_DATE_SAFETY_MARGIN_MS
  const from = new Date(to - 1000 * 60 * 60 * 24 * 30 * 12) // Last 12 months
  let count = 0
  let offset = 0

  const rootPath = getRootPath()
  const directoryPath = path.join(rootPath, 'data', 'newsletters')

  const hasDirectory = await access(directoryPath).then(() => true).catch(() => false)
  if (hasDirectory) {
    console.log('Cleaning newsletters directory...')
    await rm(directoryPath, { recursive: true, force: true })
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
        // Directory may have been deleted just above; ensure it exists before writing.
        const fileName = `${index}__${campaign.name}.html`
        const filePath = path.join(directoryPath, fileName)
        newsletters[index] = { ...campaign, filePath }
      })

    await mkdir(directoryPath, { recursive: true })
    await Promise.all(
      newsletters.map(({ filePath, htmlContent }) => writeFile(filePath, htmlContent))
    )

    console.log('Newsletters downloaded')
  }
  catch (error) {
    console.error('Error downloading campaigns:', error)
  }
}
