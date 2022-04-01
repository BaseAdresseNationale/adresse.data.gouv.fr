import {Mail} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import SearchCommuneContact from '@/components/search-commune-contact'
import Question from '@/components/question'
import ButtonLink from '@/components/button-link'

const title = 'Nous contacter'
const description = 'Contactez l’équipe de adresse.data.gouv.fr'

function Contact() {
  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Mail size={56} />} />
      <Section>
        <div className='sub-section'>
          <Question question='Je suis un particulier ou une entreprise et j’ai constaté une adresse manquante ou incorrecte.' isBold>
            <div>
              <p>La gestion des adresses est une compétence des communes. Vous devez vous adresser à votre mairie, et le cas échéant lui indiquer l’existence de ce site.</p>
              <SearchCommuneContact />
            </div>
          </Question>
        </div>

        <div className='sub-section'>
          <Question question='Je suis une commune ou un EPCI et je veux gérer les adresses de mon territoire pour améliorer la qualité des services apportés à mes administrés.' isBold>
            <div>
              <p>
                La gestion des adresses est la compétence des communes, mais elle est quelque fois exercée avec le soutien technique d’un EPCI.
              </p>
              <p>
                Cette gestion est simplifiée par l’existence d’outils officiels et gratuits, tels que <a target='_blank' rel='noreferrer' href='https://mes-adresses.data.gouv.fr/'>Mes Adresses</a>.
              </p>
              <p>
                Vous pouvez en quelques clics créer la Base Adresse Locale de votre commune, y apporter des modifications, et publier les changements pour que ceux-ci soient pris en compte par un maximum d’acteurs.
                La prise en main est très simple, et ne nécessite pas de compétences informatiques particulières.
              </p>
              <ButtonLink href='/gerer-mes-adresses'>Gérer mes adresses</ButtonLink>
            </div>
          </Question>
        </div>

        <div className='sub-section'>
          <Question question='Pour toute autre demande ou pour plus d’informations.' isBold>
            <div>
              <p>
                Si vous ne trouvez pas les réponses à vos questions sur ce site ou dans la <a href='https://doc.adresse.data.gouv.fr/'>documentation</a> ou la <a href='https://adresse-data-gouv-fr.gitbook.io/faq/'>FAQ</a>, vous pouvez nous contacter à l’adresse suivante : <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>.
              </p>
              <p>
                Notre équipe fera le nécessaire pour vous répondre dans les plus brefs délais, dans la limite de sa disponibilité.
              </p>
              <ButtonLink href='mailto:adresse@data.gouv.fr' isExternal>Nous contacter</ButtonLink>
            </div>
          </Question>
        </div>
      </Section>

      <style jsx>{`
      .sub-section {
        margin: 1em 0;
      }
      `}</style>
    </Page>
  )
}

export default Contact
