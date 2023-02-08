import Link from 'next/link'
import {MapPin, Book, Edit2, HelpCircle, FileText, Terminal, RefreshCw, Database} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import ButtonLink from '@/components/button-link'
import Notification from '@/components/notification'
import PartnersSearchbar from '@/components/bases-locales/charte/partners-searchbar'
import theme from '@/styles/theme'

function GererMesAdresses() {
  return (
    <Page>
      <Head title='Gérer mes adresses' icon={<MapPin size={56} alt='' aria-hidden='true' />} />

      <Section title='Pourquoi et comment gérer les adresses de ma commune ?' subtitle='Un véritable enjeu de souveraineté pour la France et ses territoires'>
        <SectionText>
          <p>
            La <b>création des voies et des adresses</b> en France est du <b>ressort des communes</b>, via le conseil municipal (<Link href='/blog/que-va-changer-la-loi3ds-pour-les-communes-sur-leur-adresse'>art.169 Loi 3DS</Link>).
          </p>

          <p>
            Pour qu’elles puissent exprimer pleinement cette compétence, les communes mettent en place et tiennent à jour un <b>fichier répertoriant l’intégralité des adresses, voies et lieux-dits</b> présents sur leur territoire, une <Link href='/bases-locales' legacyBehavior><a><b>Base Adresse Locale</b></a></Link>.
          </p>

          <p>
            Des <a href='https://guide-bonnes-pratiques.adresse.data.gouv.fr/les-outils-de-la-fabrique-de-ladresse'>outils</a> <b>libres, gratuits et ne nécessitant aucune compétence technique</b>, vous permettent de créer et administrer <b>vous-même</b> votre Base Adresse Locale.
          </p>

          <p>
            Découvrez le <a href='https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/schema-du-parcours'>parcours de l’adresse</a>, depuis la délibération jusqu’à la transmission à l’ensemble des services publics.
          </p>

          <p>
            Ces adresses sont celles que l’on retrouvera dans la <b><Link href='/donnees-nationales'>Base Adresse Nationale</Link></b>, le <a href='https://www.data.gouv.fr/fr/pages/spd/reference'>service public de la donnée</a> pour les adresses en France.<br />{}
            Elles seront conformes aux besoins des <b>différents acteurs</b>, comme par exemple <b>les secours</b> ou les opérateurs en charge du <b><a href='https://adresse.data.gouv.fr/data/docs/communes-operateurs-obligations-adresse.pdf'>déploiement de la fibre optique</a></b>.
          </p>
        </SectionText>
      </Section>

      <Section title='Plusieurs solutions s’offrent à vous' background='color' />

      <Section title='Utilisez l’outil national : Mes Adresses' subtitle='Facile, gratuit et rapide !' background='grey'>
        <div className='easy-step'>
          <div className='subtitled-img'>
            <div className='circle'>
              <b>1</b>
            </div>
            <p>Créez votre <br /> Base Adresse Locale</p>
          </div>
          <div className='subtitled-img'>
            <div className='circle'>
              <b>2</b>
            </div>
            <p>Gérez vos adresses <br />directement en ligne</p>
          </div>
          <div className='subtitled-img'>
            <div className='circle'>
              <b>3</b>
            </div>
            <p>Partagez vos adresses dans <br /> la Base Adresse Nationale 🇫🇷</p>
          </div>
          <div className='subtitled-img'>
            <div className='circle'>
              <RefreshCw size={42} alt='' aria-hidden='true' />
            </div>
            <p>Continuez la mise à jour <br /> de vos adresses</p>
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
            Créez votre Base Adresse Locale <Edit2 style={{verticalAlign: 'bottom', marginLeft: '3px'}} alt='' aria-hidden='true' />
          </ButtonLink>

          <div className='already-done'>
            <div>Vous avez déjà créé une Base Adresse Locale ?</div>
            <a target='_blank' rel='noreferrer' href='https://mes-adresses.data.gouv.fr'>Retrouvez-la ici</a>
          </div>
        </div>

        <Notification isFullWidth>
          <div>
            <HelpCircle style={{verticalAlign: 'bottom', marginRight: '1em'}} alt='' aria-hidden='true' />
            <Link href='/ressources'>Des guides sont à votre disposition</Link> ainsi que des <a href='https://peertube.adresse.data.gouv.fr/w/p/4kx66AESyPc6Er47sgBeFX' target='_blank' rel='noopener noreferrer'>vidéos tutorielles</a> afin de bien débuter, ainsi que le <a href='https://mes-adresses.data.gouv.fr/new?test=1' target='_blank' rel='noopener noreferrer'>mode démonstration</a> de Mes Adresses qui vous permet de le découvrir en toute liberté.
          </div>
        </Notification>
      </Section>

      <Section id='recherche-partenaires' title='Vous souhaitez être accompagné dans votre adressage' subtitle='De nombreux partenaires de la Charte de la Base Adresse Locale proposent un accompagnement et/ou des outils adaptés à votre territoire'>
        <PartnersSearchbar />
      </Section>

      <Section title='Vous utilisez déjà votre propre outil' subtitle='Plusieurs solutions existent afin de publier vos fichiers Base Adresse Locale' background='grey'>
        <div className='easy-step'>
          <div className='subtitled-img'>
            <div className='circle'>
              <b><FileText size={42} alt='' aria-hidden='true' /></b>
            </div>
            <p><Link href='/bases-locales/publication'>Formulaire de dépôt</Link></p>
          </div>
          <div className='subtitled-img'>
            <div className='circle'>
              <b><Database size={42} alt='' aria-hidden='true' /></b>
            </div>
            <p><a href='https://www.data.gouv.fr/fr/'>data.gouv.fr</a></p>
          </div>
          <div className='subtitled-img'>
            <div className='circle'>
              <b><Terminal size={42} alt='' aria-hidden='true' /></b>
            </div>
            <p><a href='https://github.com/BaseAdresseNationale/api-depot/wiki/Documentation'>API dépôt d’une Base Adresse Locale</a></p>
          </div>
        </div>

        <div className='action-links'>
          <ButtonLink
            size='large'
            href='https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/publier-une-base-adresse-locale'
          >
            Voir tous les méthodes de publication
          </ButtonLink>
        </div>

        <Notification isFullWidth>
          <div>
            <HelpCircle style={{verticalAlign: 'bottom', marginRight: '1em'}} alt='' aria-hidden='true' />
            Avant de publier, <b>vérifiez la conformité</b> de votre fichier Base Adresse Locale grâce au <Link href='/bases-locales/validateur'>Validateur BAL</Link>
          </div>
        </Notification>
      </Section>

      <Section title='Vous accompagnez des communes' subtitle='Implémentez la spécification BAL dans votre outil de gestion des adresses et connectez vous à la Base Adresse Nationale' background='color'>
        <div className='grid-links'>
          <div className='action-links'>
            <ButtonLink
              size='large'
              href='/bases-locales'
              color='white'
              isOutlined
            >
              Accédez à la page dédiée <Book style={{verticalAlign: 'bottom', marginLeft: '3px'}} alt='' aria-hidden='true' />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <style jsx>{`
        .easy-step {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          grid-gap: 1em;
          align-items: center;
          margin: 3em 1em;
        }

        .subtitled-img, .circle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .circle {
          height: 80px;
          width: 80px;
          border-radius: 50%;
          background: ${theme.primary};
          color: ${theme.colors.white};
          font-size: 40px;
        }

        .circle b {
          font-size: 50px;
        }

        .subtitled-img p {
          width: 100%;
          font-style: italic;
        }

        .subtitled-img img {
          width: 100%;
          max-width: 250px;
          background: whitesmoke;
          box-shadow: 0 3px 10px -5px #C9D3DF;
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
