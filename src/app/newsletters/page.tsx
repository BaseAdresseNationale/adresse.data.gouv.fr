import Loader from '@/components/Loader'
import Section from '@/components/Section'
import { Suspense } from 'react'
import LastCampaigns from './LastCampaigns'

export default async function NewslettersPage() {
  return (
    <Section title="Nos dernières newsletters">
      <Suspense fallback={<div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '400px', alignItems: 'center' }}><Loader size={50} /></div>}>
        <LastCampaigns />
      </Suspense>
    </Section>
  )
}
