import Section from '@/components/Section'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Nous contacter - adresse.data.gouv.fr',
  description: 'Contactez l\'équipe de la Base Adresse Nationale pour toute question sur la BAN ou les Bases Adresses Locales.',
  openGraph: {
    title: 'Nous contacter - adresse.data.gouv.fr',
    description: 'Contactez l\'équipe de la Base Adresse Nationale',
  },
}

export default function ContactPage() {
  return (
    <Section pageTitle="Nous contacter">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-lg-10">
            <p className="fr-text--lead fr-mb-4w">
              Une question sur la Base Adresse Nationale ou les Bases Adresses Locales ?
              Contactez-nous via ce formulaire.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  )
}
