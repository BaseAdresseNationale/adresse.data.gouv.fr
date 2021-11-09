import Link from 'next/link'
import {Edit2, HelpCircle} from 'react-feather'

import theme from '@/styles/theme'

import Notification from '../notification'
import ButtonLink from '../button-link'

function NationalTool() {
  return (
    <>
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

      <style jsx>{`
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

        .already-done {
          margin-top: 1em;
        }
      `}</style>
    </>
  )
}

export default NationalTool
