import { Habilitation, Revision } from '@/types/api-depot.types'
import Alert from '@codegouvfr/react-dsfr/Alert'
import styled from 'styled-components'
import Card from '@codegouvfr/react-dsfr/Card'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import Select from '@codegouvfr/react-dsfr/Select'
import { getEmailsCommune, getUrlProConnect } from '@/lib/api-depot'
import styles from './button-pro-connect.module.css'
import { Button } from '@codegouvfr/react-dsfr/Button'

interface HabilitationMethodProps {
  revision: Revision
  habilitation: Habilitation
  sendPinCode: () => Promise<void>
  emailSelected?: string
  setEmailSelected: Dispatch<SetStateAction<string | undefined>>
}

const StyledWrapper = styled.div`
    .habilitation-methods {
        margin: 2rem 0;
        display: flex;
        justify-content: space-around;
        gap: 1rem;

        > div {
            max-width: 400px;
        }
    }
`

const StyledButton = styled(Button)`
    width: 214px;
    height: 56px;
    text-align: left;
    &::before {
      width: 40px;
      height: 40px;
    }
`

export function HabilitationMethod({ revision, habilitation, sendPinCode, emailSelected, setEmailSelected }: HabilitationMethodProps) {
  const [emailsCommune, setEmailsCommune] = useState<string[]>([])

  const proConnectUrl = useMemo(() => {
    const redirectUrl = encodeURIComponent(`${window.location.href}?revisionId=${revision.id}&habilitationId=${habilitation.id}`)
    return getUrlProConnect(habilitation.id, redirectUrl)
  }, [habilitation.id, revision.id])

  useEffect(() => {
    async function fetchEmailsCommune() {
      const emails = await getEmailsCommune(habilitation.codeCommune)
      setEmailsCommune(emails)
      if (emails.length > 0) {
        setEmailSelected(emails[0])
      }
    }

    fetchEmailsCommune()
  }, [habilitation.codeCommune, setEmailSelected])

  return (
    <StyledWrapper>
      <p>
        Afin de pouvoir publier vos adresses dans la <b>Base Adresse Nationale</b>, votre <b>Base Adresse Locale</b> doit obtenir une <b>habilitation</b>.
      </p>
      <ul>
        <li>
          Permet à <b>toute personne aillant accès à l’édition</b> de cette Base Adresse Locale de <b>mettre à jour</b> les adresses de sa commune.
        </li>
        <li>
          Pour l’obtenir, <b>un(e) élu(e)</b> de la commune ou <b>un(e) employé(e)</b> de la mairie doit <b>s’authentifier</b>.
        </li>
      </ul>
      <div className="habilitation-methods">
        {emailSelected && (
          <Card
            desc={(
              <>
                <div
                  className="fr-container"
                  style={{
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '1rem',
                    marginBottom: '1rem',
                  }}
                >
                  <StyledButton
                    iconId="fr-icon-mail-line"
                    onClick={sendPinCode}
                  >
                    Recevoir un code d&apos;habilitation
                  </StyledButton>
                </div>
                {emailsCommune.length === 1 && (
                  <span>
                    Un code d’authentification vous sera envoyé à l’adresse : <b>{emailSelected}</b>
                  </span>
                )}
                {emailsCommune.length > 1 && (
                  <Select
                    label="Un code d’habilitation vous sera envoyé à l’adresse que vous selectionnez"
                    nativeSelectProps={{
                      onChange: e => setEmailSelected(e.target.value),
                      value: emailSelected,
                    }}
                  >
                    {emailsCommune.map((email: string) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </Select>
                )}
              </>
            )}
            title="Via le courriel de la mairie"
            titleAs="h3"
          />
        )}
        <Card
          desc={(
            <>
              <div
                className="fr-container"
                style={{
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <button
                  className={styles['proconnect-button']}
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.location.href = proConnectUrl}
                >
                  <span className={styles['proconnect-sr-only']}>
                    S&apos;identifier avec ProConnect
                  </span>
                </button>
              </div>
              <span>Aucune donnée personnelle ne nous sera transmise durant ce processus d’authentification</span>
            </>
          )}
          title="Via votre compte ProConnect"
          titleAs="h3"
        />
      </div>
      <Alert
        title="Prestataires et délégataires"
        description={(
          <p>
            Contactez la mairie pour qu’elle puisse <b>authentifier</b> les adresses selon les modalités définies ci-dessus. Pour rappel, la commune <b>reste responsable de ses adresses</b>, même en cas de délégation de la <b>réalisation technique de l’adressage</b>.
          </p>
        )}
        severity="info"
      />
    </StyledWrapper>
  )
}
