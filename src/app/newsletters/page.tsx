import Section from '@/components/Section'
import { getRootPath } from '@/utils/path'
import { readdir, readFile } from 'fs/promises'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import path from 'path'

const getNewsletterName = (newsletter: string) => {
  return newsletter
    .replace('.html', '')
    .split('__')[1]
}

export default async function NewslettersPage() {
  const newslettersDirectory = path.join(getRootPath(), 'data', 'newsletters')
  const newsletters = await readdir(newslettersDirectory)

  const newslettersWithContent = await Promise.all(newsletters.map(async (newsletter) => {
    return {
      name: getNewsletterName(newsletter),
      htmlContent: await readFile(path.join(newslettersDirectory, newsletter), 'utf-8'),
    }
  }))

  return (
    <Section title="Nos dernières newsletters">
      <div style={{ marginTop: '2rem' }}>
        {newslettersWithContent.map(({ name, htmlContent }, index) => (
          <Accordion key={index} label={name}>
            <iframe width="100%" height="600px" srcDoc={htmlContent} />
          </Accordion>
        ))}
      </div>
    </Section>
  )
}
