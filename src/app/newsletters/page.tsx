import Section from '@/components/Section'
import { getRootPath } from '@/utils/path'
import { readdir } from 'fs/promises'
import Accordion from '@codegouvfr/react-dsfr/Accordion'

const getNewsletterName = (newsletter: string) => {
  return newsletter
    .replace('.html', '')
    .split('__')[1]
}

export default async function NewslettersPage() {
  const newsletters = await readdir(getRootPath() + '/public/newsletters')

  return (
    <Section title="Nos dernières newsletters">
      <div style={{ marginTop: '2rem' }}>
        {newsletters.map((newsletter: string, index) => (
          <Accordion key={index} label={getNewsletterName(newsletter)}>
            <iframe width="100%" height="600px" src={`/newsletters/${newsletter}`} />
          </Accordion>
        ))}
      </div>
    </Section>
  )
}
