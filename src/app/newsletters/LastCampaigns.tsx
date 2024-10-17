import { customFetch } from '@/lib/fetch'
import Accordion from '@codegouvfr/react-dsfr/Accordion'

interface Newsletter {
  id: number
  name: string
  htmlContent: string
}

export default async function LastCampaigns() {
  const to = Date.now()
  const from = new Date(to - 1000 * 60 * 60 * 24 * 30 * 6)
  const newsletters = []
  const allCampaigns = []
  let count = 0
  let offset = 0
  do {
    const { campaigns, count: _count } = await customFetch(`${process.env.NEXT_PUBLIC_BREVO_API_URL}/emailCampaigns?status=sent&limit=30&offset=${offset}&startDate=${from.toISOString()}&endDate=${new Date(to).toISOString()}`, {
      headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': process.env.BREVO_API_KEY } as RequestInit['headers'],
    })
    count = _count
    offset += campaigns.length
    allCampaigns.push(...campaigns)
    newsletters.push(...campaigns.filter((campaign: Newsletter) => campaign.name.includes('adresse.data.gouv.fr')))
  } while (offset < count)

  return (
    <div style={{ marginTop: '2rem' }}>
      {newsletters.map((newsletter: Newsletter) => (
        <Accordion key={newsletter.id} label={newsletter.name}>
          <iframe width="100%" height="600px" srcDoc={newsletter.htmlContent} />
        </Accordion>
      ))}
    </div>
  )
}
