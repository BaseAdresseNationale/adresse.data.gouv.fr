'use client'
import { useEffect, useState } from 'react'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import Loader from '@/components/Loader'

interface Newsletter {
  id: number
  name: string
  htmlContent: string
}

export default function LastCampaigns() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const response = await fetch('/api/brevo-newsletters') // Assuming this is the route
        if (!response.ok) {
          throw new Error('Newsletters indisponible')
        }
        const data = await response.json()
        setNewsletters(data.newsletters)
      }
      catch (error: any) {
        setError(error.message)
      }
      finally {
        setLoading(false)
      }
    }
    fetchNewsletters()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '400px', alignItems: 'center' }}>
        <Loader size={50} />
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

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
