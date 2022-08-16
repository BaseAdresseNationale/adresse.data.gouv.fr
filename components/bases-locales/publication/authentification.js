import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import {ChevronRight, ChevronDown, Info, Mail, Users, Clock, LogIn} from 'react-feather'

const ADRESSE_URL = process.env.NEXT_PUBLIC_ADRESSE_URL || 'https://adresse.data.gouv.fr'

import theme from '@/styles/theme'

import Button from '@/components/button'
import ActionButtonNeutral from '@/components/action-button-neutral'

function Authentification({communeEmail, revisionId, habilitationId, authenticationUrl, handleCodeAuthentification}) {
  const [isHabilitedOpen, setIsHabilitedOpen] = useState(true)
  const [isNonHabilitedOpen, setIsNonHabilitedOpen] = useState(false)

  const redirectUrl = `${ADRESSE_URL}/bases-locales/publication?revisionId=${revisionId}&habilitationId=${habilitationId}`
  const fcButtonUrl = `${authenticationUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}`

  return (
    <div className='auth-container'>
      <div className='dropdown-container'>
        <ActionButtonNeutral
          isFullSize
          label={`${isHabilitedOpen ? 'Masquer' : 'Afficher'} la marche à suivre lorsque vous êtes habilité`}
          onClick={() => setIsHabilitedOpen(!isHabilitedOpen)}
        >
          <div className='dropdown-title'>
            <h3>Vous êtes habilité(e)</h3>
            {isHabilitedOpen ? <ChevronDown color={theme.primary} size={35} alt aria-hidden='true' /> : <ChevronRight color={theme.primary} size={35} alt aria-hidden='true' />}
          </div>
        </ActionButtonNeutral>

        {isHabilitedOpen && (
          <div className='content'>
            <div className='authentification-choice'>
              <h4>M’authentifier comme élu de la commune</h4>
              <a href={fcButtonUrl} aria-label='S’authentifier avec FranceConnect'>
                <Image width={280} height={82} layout='fixed' src='/images/FCboutons-10.svg' alt aria-hidden='true' />
              </a>
              <p className='alert-personal-data'>
                Aucune donnée personnelle ne nous sera transmise durant ce processus d’authentification
              </p>
            </div>

            <div className='authentification-choice'>
              <h4>Authentifier la mairie de la commune</h4>
              <Button size='large' disabled={!communeEmail} onClick={handleCodeAuthentification}>
                <div className='mail-button'>
                  <Mail size={40} alt='Envoi par e-mail' /> Recevoir un code d’authentification
                </div>
              </Button>
              <p className='email-info'>
                {communeEmail ? (
                  <>Un code d’authentification vous sera envoyé à l’adresse : <br /> <b>{communeEmail}</b></>
                ) : (
                  'Cette option est indisponible car aucune adresse email pour votre mairie n’a pu être trouvée'
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className='habilitation-explanation'>
        <div>Comprendre l’habilitation en quelques points</div>
        <p className='intro'>Afin de pouvoir publier vos adresses dans la <b>Base Adresse Nationale</b>, votre <b>Base Adresse Locale</b> doit obtenir une <b>habilitation</b>.</p>
        <ul>
          <li><Users size={15} alt aria-hidden='true' /> <p>Permet à <b>toute personne aillant accès à l’édition</b> de cette Base Adresse Locale de <b>mettre à jour</b> les adresses de sa commune.</p></li>
          <li><Clock size={15} alt aria-hidden='true' /> <p>Elle est valable <b>6 mois</b>.</p></li>
          <li><LogIn size={15} alt aria-hidden='true' /> <p>Pour l’obtenir, <b>un(e) élu(e)</b> de la commune ou <b>un(e) employé(e)</b> de la mairie doit <b>s’authentifier</b>.</p></li>
        </ul>
      </div>

      <div className='dropdown-container'>
        <ActionButtonNeutral
          isFullSize
          label={`${isHabilitedOpen ? 'Masquer' : 'Afficher'} la marche à suivre lorsque vous n'êtes pas habilité`}
          onClick={() => setIsNonHabilitedOpen(!isNonHabilitedOpen)}
        >
          <div className='dropdown-title'>
            <h3>Vous n’êtes pas habilité(e)</h3>
            {isNonHabilitedOpen ? <ChevronDown color={theme.primary} size={35} /> : <ChevronRight color={theme.primary} size={35} />}
          </div>
        </ActionButtonNeutral>

        {isNonHabilitedOpen && (
          <div className='content'>
            <div className='infos-habilitation'>
              <h4><Info alt aria-hidden='true' /><b>Prestataires et délégataires</b></h4>
              <p>Contactez la mairie pour qu’elle puisse <b>authentifier </b>les adresses selon les modalités définies ci-dessus. Pour rappel, la commune <b>reste responsable de ses adresses</b>, même en cas de délégation de la <b>réalisation technique de l’adressage</b>.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .intro {
          text-align: center;
        }

        .habilitation-explanation, .mail-button, .authentification-choice, .content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1em;
        }

        .habilitation-explanation div {
          font-size: 20px;
          font-weight: bold;
          color: ${theme.primary};
        }

        ul li {
          display: grid;
          grid-template-columns: 15px 1fr;
          align-items: baseline;
          gap: 10px;
        }

        p, h3, h4 {
          margin: 0;
        }

        .dropdown-container {
          border: solid 1px ${theme.border};
          box-sizing: border-box;
          box-shadow: 0px 4px 22px -5px rgba(0, 0, 0, 0.45);
          border-radius: 8px;
          margin: 1em 0;
          padding: 1em;
        }

        .dropdown-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          color: ${theme.darkText};
        }

        h4 {
          display: flex;
          gap: 10px;
        }

        .content {
          border-top: 2px solid ${theme.borderLighter};
          margin-top: 1em;
          flex-flow: row wrap;
          justify-content: space-around;
          text-align: center;
        }

        .infos-habilitation, .authentification-choice {
          padding: 1em;
          border-radius: 8px;
          margin-top: 1em;
        }

        .infos-habilitation {
          background: ${theme.colors.lighterBlue};
          color: ${theme.primary};
        }

        .authentification-choice {
          min-height: 304px;
          flex: 1;
          justify-content: space-between;
          background: ${theme.colors.lighterGrey};
          gap: 1em;
        }

        .alert-personal-data {
          text-align: center;
          font-weight: bolder;
          text-decoration: underline;
        }

        .mail-button {
          gap: 10px;
        }

        .email-info {
          font-style: italic;
        }
      `}</style>
    </div>
  )
}

Authentification.defaultProps = {
  communeEmail: null
}

Authentification.propTypes = {
  communeEmail: PropTypes.string,
  revisionId: PropTypes.string.isRequired,
  habilitationId: PropTypes.string.isRequired,
  authenticationUrl: PropTypes.string.isRequired,
  handleCodeAuthentification: PropTypes.func.isRequired
}

export default Authentification
