import Link from 'next/link'
import {MapPin, Book, Edit2, HelpCircle} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import ButtonLink from '@/components/button-link'
import Notification from '@/components/notification'
import PartnersSearchbar from '@/components/bases-locales/charte/partners-searchbar'
import theme from '@/styles/theme'

function GererMesAdresses() {
  return (
    <Page>
      <Head title='Gérer mes adresses' icon={<MapPin size={56} />} />

      <Section title='Pourquoi et comment gérer les adresses de ma commune ?' subtitle='Un véritable enjeu de souveraineté pour la France et ses territoires'>
        <div className='description'>
          <p>
            La <b>création des voies et des adresses</b> en France est du <b>ressort des communes</b>, via le conseil municipal.
          </p>

          <p>
            Pour qu’elles puissent exprimer pleinement cette compétence, il est proposé aux communes de mettre en place un <b>fichier répertoriant l’intégralité des voies et des adresses</b> présentes sur leur territoire, une <Link href='/bases-locales'><a><b>Base Adresse Locale</b></a></Link>.
          </p>

          <p>
            Des outils, dont certains sont <b>libres, gratuits et ne nécessitant aucune compétence technique</b>, vous permettent de créer et administrer <b>vous-même</b> votre <Link href='/bases-locales'><a><b>Base Adresse Locale</b></a></Link>, que vous soyez élu ou agent municipal habilité.
          </p>

          <p>
            Ces adresses sont celles que l’on retrouvera dans la <b>Base Adresse Nationale</b>, <a href='https://www.data.gouv.fr/fr/reference'>base de données de référence</a> pour les adresses en France.<br />{}
            Elles seront conformes aux besoins des <b>différents acteurs</b>, comme par exemple <b>les secours</b> ou les opérateurs en charge du <b>déploiement de la fibre optique</b>.
          </p>
        </div>
      </Section>

      <Section title='Utiliser l’outil national' subtitle='Facile, gratuit et rapide !' background='grey'>
        <div className='easy-step'>
          <div className='subtitled-img'>
            <div>1</div>
            <p> Créer votre Base Adresse Locale</p>
          </div>
          <div className='subtitled-img'>
            <div>2</div>
            <p> Gérer vos adresses directement en ligne</p>
          </div>
          <div className='subtitled-img'>
            <div>3</div>
            <p>Partager vos adresses dans la Base Adresse Nationale</p>
          </div>
        </div>

        <div className='action-links'>
          <ButtonLink
            isExternal
            size='large'
            target='_blank'
            rel='noreferrer'
            href='https://mes-adresses.data.gouv.fr/new'
          >
            Créer votre Base Adresse Locale <Edit2 style={{verticalAlign: 'bottom', marginLeft: '3px'}} />
          </ButtonLink>

          <div className='already-done'>
            <div>Vous avez déjà créé une Base Adresse Locale ?</div>
            <a target='_blank' rel='noreferrer' href='https://mes-adresses.data.gouv.fr'>Retrouvez-la ici</a>
          </div>
        </div>

        <Notification isFullWidth>
          <div>
            <HelpCircle style={{verticalAlign: 'bottom', marginRight: '4px'}} />
            Des <Link href='/guides'>guides</Link> sont à votre disposition afin de bien débuter, ainsi que le <a href='https://mes-adresses.data.gouv.fr/new?test=1' target='_blank' rel='noopener noreferrer'>mode démonstration</a> de Mes Adresses qui vous permet de le découvrir en toute liberté.
          </div>
        </Notification>

      </Section>

      <Section title='Outils disponibles sur votre territoire' subtitle='De nombreux partenaires de la Charte de la Base Adresse Locale proposent un accompagnement et/ou des outils adaptés à votre territoire' background='grey'>
        <div>
          <PartnersSearchbar />
        </div>
      </Section>

      <Section title='Développer votre propre outil de gestion d’adresses' subtitle='Implémentez la spécification BAL et connectez vous à la Base Adresse Nationale' background='color'>
        <div className='grid-links'>
          <div className='action-links'>
            <ButtonLink
              size='large'
              href='/bases-locales'
            >
              Accéder à la page dédiée <Book style={{verticalAlign: 'bottom', marginLeft: '3px'}} />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <style jsx>{`
        .description {
          text-align: left;
          border-left: 3px solid ${theme.primary};
          padding-left: 1em;
          margin-top: 3em;
        }

        .easy-step {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          grid-gap: 1em;
          align-items: center;
          justify-content: flex-start;
          margin: 3em 1em 1em 1em;
        }

        .subtitled-img {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          height: 150px;
          justify-content: flex-start;
        }

        .subtitled-img div {
          height: 60px;
          width: 60px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: ${theme.primary};
          color: ${theme.colors.white};
          font-size: 35px;
        }

        .subtitled-img p {
          font-weight: bold;
          font-style: italic;
          font-size: 15px;
        }

        .action-links {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          margin: 2em 0;
        }

        .indispo {
          text-align: center;
          font-size: larger;
          font-style: italic;
          margin: 1em;
        }

        .already-done {
          margin-top: 1em;
        }
      `}</style>
    </Page>
  )
}

export default GererMesAdresses
