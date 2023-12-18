import theme from '@/styles/theme'

import HeroStatement from './hero-statement'
import HeroTile from './hero-tile'

const inputLinks = [
  {
    type: 'communes',
    badgeLabels: ['communes'],
    title: 'Administrer vos adresses',
    description: 'Choisissez la méthode adaptée à votre besoin',
    link: {href: '/gerer-mes-adresses', target: '_self'},
    img: (<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path fill='currentColor' d='M5 19h1.414l9.314-9.314-1.414-1.414L5 17.586V19zm16 2H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L9.243 19H21v2zM15.728 6.858l1.414 1.414 1.414-1.414-1.414-1.414-1.414 1.414z' />
    </svg>
    )
  },
  {
    type: 'communes',
    badgeLabels: ['communes', 'partenaires'],
    title: 'La fabrique de l’adresse',
    description: 'Des outils pour tous les profils, élus, agents, géomaticens...',
    link: {href: 'https://guide-bonnes-pratiques.adresse.data.gouv.fr/les-outils-de-la-fabrique-de-ladresse', target: '_blank'},
    img: (<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path fill='currentColor' d='M5.33 3.271a3.5 3.5 0 0 1 4.254 4.963l10.709 10.71-1.414 1.414-10.71-10.71a3.502 3.502 0 0 1-4.962-4.255L5.444 7.63a1.5 1.5 0 1 0 2.121-2.121L5.329 3.27zm10.367 1.884l3.182-1.768 1.414 1.414-1.768 3.182-1.768.354-2.12 2.121-1.415-1.414 2.121-2.121.354-1.768zm-6.718 8.132l1.414 1.414-5.303 5.303a1 1 0 0 1-1.492-1.327l.078-.087 5.303-5.303z' />
    </svg>
    )
  },
  {
    type: 'communes',
    badgeLabels: ['communes', 'partenaires'],
    title: 'Consulter les ressources',
    description: 'Vous y trouverez des exemples, modèles, tuto...',
    link: {href: '/ressources', target: '_self'},
    img: (<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path fill='currentColor' d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1 1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355z' />
    </svg>
    )
  },
  {
    type: 'utilisateurs',
    badgeLabels: ['utilisateurs'],
    title: 'Accéder aux données',
    description: 'Téléchargez les données de la\u00A0BAN',
    link: {href: '/donnees-nationales', target: '_self'},
    img: (<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path fill='currentColor' d='M5 12.5c0 .313.461.858 1.53 1.393C7.914 14.585 9.877 15 12 15c2.123 0 4.086-.415 5.47-1.107 1.069-.535 1.53-1.08 1.53-1.393v-2.171C17.35 11.349 14.827 12 12 12s-5.35-.652-7-1.671V12.5zm14 2.829C17.35 16.349 14.827 17 12 17s-5.35-.652-7-1.671V17.5c0 .313.461.858 1.53 1.393C7.914 19.585 9.877 20 12 20c2.123 0 4.086-.415 5.47-1.107 1.069-.535 1.53-1.08 1.53-1.393v-2.171zM3 17.5v-10C3 5.015 7.03 3 12 3s9 2.015 9 4.5v10c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5zm9-7.5c2.123 0 4.086-.415 5.47-1.107C18.539 8.358 19 7.813 19 7.5c0-.313-.461-.858-1.53-1.393C16.086 5.415 14.123 5 12 5c-2.123 0-4.086.415-5.47 1.107C5.461 6.642 5 7.187 5 7.5c0 .313.461.858 1.53 1.393C7.914 9.585 9.877 10 12 10z' />
    </svg>
    )
  },
  {
    type: 'utilisateurs',
    badgeLabels: ['utilisateurs', 'partenaires'],
    title: 'Explorer avec nos outils',
    description: 'Parcourez, en ligne, les données de l’adresse',
    link: {href: '/outils', target: '_self'},
    img: (<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path fill='currentColor' d='M13 8v8a3 3 0 0 1-3 3H7.83a3.001 3.001 0 1 1 0-2H10a1 1 0 0 0 1-1V8a3 3 0 0 1 3-3h3V2l5 4-5 4V7h-3a1 1 0 0 0-1 1zM5 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' />
    </svg>)
  },
  {
    type: 'utilisateurs',
    badgeLabels: ['utilisateurs'],
    title: 'Utiliser nos API',
    description: 'Un service prêt à l’emploi',
    link: {href: '/api-doc', target: '_self'},
    img: (<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='48' height='48'>
      <path fill='none' d='M0 0h24v24H0z' />
      <path fill='currentColor' d='M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z' />
    </svg>
    )
  },
]

const inputStatement = [
  {
    type: 'actuality',
    badgeLabels: ['communes'],
    title: 'Mise en application prochaine de la loi\u00A03DS',
    body: <p>La publication du décret faisant des communes
      la source officielle des adresses est en approche .</p>,
    links: [
      {text: 'En savoir plus', href: 'https://adresse.data.gouv.fr/blog/que-va-changer-la-loi3ds-pour-les-communes-sur-leur-adresse', target: '_blank'},
      {text: 'Consulter les textes règlementaires', href: 'https://guide-bonnes-pratiques.adresse.data.gouv.fr/textes-reglementaires/procedures-legales', target: '_blank'},
    ],
    img: (
      <svg width='63' height='59' viewBox='0 0 63 59' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <ellipse cx='31.033' cy='29.5' rx='31.0095' ry='29.5' fill='white' />
        <path fill='white' stroke='#A558A0' strokeWidth='2' d='M56.8377 29.5C56.8377 42.9845 45.3321 54 31.0329 54C16.7336 54 5.22803 42.9845 5.22803 29.5C5.22803 16.0155 16.7336 5 31.0329 5C45.3321 5 56.8377 16.0155 56.8377 29.5Z' />
        <path fill='#A558A0' d='M28.8942 34.875H33.1242L34.2942 13.5H27.7242L28.8942 34.875ZM31.0542 45.54C33.1692 45.54 34.9692 43.74 34.9692 41.625C34.9692 39.51 33.1692 37.71 31.0542 37.71C28.8492 37.71 27.0942 39.51 27.0942 41.625C27.0942 43.74 28.8942 45.54 31.0542 45.54Z' />
      </svg>
    )
  },
  {
    type: 'default',
    badgeLabels: ['communes', 'partenaires'],
    title: 'La démarche d’adressage',
    body: <p>Issu du guide des bonnes pratiques,
      le <i>parcours de l’adresse</i> vous aidera à comprendre comment
      transmettre les adresses de votre commune
      vers la BAN.</p>,
    links: [
      {text: 'Lire sur le guide des bonnes pratiques', href: 'https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/schema-du-parcours', target: '_blank'},
      {text: 'Assister à un webinaire', href: '/evenements', target: '_self'},
    ],
  },
]

function HeroMenu() {
  return (
    <>
      <div className='hero-menu'>
        <div className='wrapper'>
          <div className='statement-wrapper'>
            {inputStatement.map(({type, badgeLabels, title, body, links, img}) => (
              <HeroStatement key={`${type}--${title}`} {...{type, badgeLabels, title, body, links, img}} />
            ))}
          </div>
          {inputLinks.map(({type, badgeLabels, title, description, link, img}) => (
            <div key={`${type}--${title}`} className={type}>
              <HeroTile {...{type, badgeLabels, title, description, link, img}} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-menu {
          margin-top: 4rem;
        }

        @media (min-width: ${theme.breakPoints.tablet}) {
          .wrapper {
            margin: 0 auto;
            display: grid;

            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(4, auto);
            grid-gap: 1rem;
            grid-auto-rows: 1fr;
            grid-auto-flow: column;
          }
        }
        @media (min-width: ${theme.breakPoints.desktop}) {
          .wrapper {
            max-width: 1210px;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: auto;
            grid-auto-rows: max-content;
          }
        }
        .wrapper > div {
          display: flex;
          margin: 1rem 0;
        }
        @media (min-width: ${theme.breakPoints.tablet}) {
          .wrapper > div {
            margin: 0;
          }
        }

        .statement-wrapper {
          grid-column: 1;
          grid-row: 1;
          flex-direction: column;
          gap: 1rem;
          align-items: stretch;
          justify-content: stretch;
        }
        @media (min-width: ${theme.breakPoints.tablet}) {
          .statement-wrapper {
          grid-column: 1 / 3;
          flex-direction: row;
          }
        }
        @media (min-width: ${theme.breakPoints.desktop}) {
          .statement-wrapper {
            grid-column: 3;
            grid-row: 1 / 4;
            flex-direction: column-reverse;
          }
        }

        .commune {
          grid-column: 1;
        }

        .utilisateur {
          grid-column: 2;
        }
    `}</style>
    </>
  )
}

export default HeroMenu
