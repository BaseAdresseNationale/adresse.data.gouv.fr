import Link from 'next/link'
import Image from 'next/image'
import {MapPin, Book, BookOpen} from 'react-feather'

import theme from '@/styles/theme'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import ButtonLink from '@/components/button-link'
import PartnersSearchbar from '@/components/bases-locales/charte/partners-searchbar'
import NationalTool from '@/components/gerer-mes-adresses/national-tool'

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
        <NationalTool />
      </Section>

      <Section title='Nos guides et la documentation en ligne vous accompagnent tout au long de votre adressage'>
        <div className='guides-doc-container'>
          <Link href='/guides'>
            <a className='link-container'>
              <div className='circle'>
                <BookOpen size={49} />
              </div>
              Guides
            </a>
          </Link>
          <Link href='https://guide.mes-adresses.data.gouv.fr/'>
            <a className='link-container'>
              <div className='circle'>
                <Image src='/images/logos/doc.png' height={60} width={49} />
              </div>
              Documentation
            </a>
          </Link>
        </div>
      </Section>

      <Section title='Outils disponibles sur votre territoire' subtitle='De nombreux partenaires de la Charte de la Base Adresse Locale proposent un accompagnement et/ou des outils adaptés à votre territoire' background='grey'>
        <PartnersSearchbar />
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

        .guides-doc-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 2em;
          margin-top: 5em;
        }

        .link-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          color: ${theme.darkText};
          font-weight: bold;
          padding: 1em;
        }

        .circle {
          color: ${theme.colors.white};
          background: ${theme.primary};
          border-radius: 50%;
          width: 120px;
          height: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .action-links {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          margin: 2em 0;
        }
      `}</style>
    </Page>
  )
}

export default GererMesAdresses
