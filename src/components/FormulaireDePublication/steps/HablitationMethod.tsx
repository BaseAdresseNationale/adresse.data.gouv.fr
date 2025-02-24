import { Habilitation, Revision } from '@/types/api-depot.types'
import Alert from '@codegouvfr/react-dsfr/Alert'
import styled from 'styled-components'
import Card from '@codegouvfr/react-dsfr/Card'
import ResponsiveImage from '../../ResponsiveImage'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Select from '@codegouvfr/react-dsfr/Select'
import { getEmailsCommune } from '@/lib/api-depot'

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

export function HabilitationMethod({ revision, habilitation, sendPinCode, emailSelected, setEmailSelected }: HabilitationMethodProps) {
  const [redirectUrl, setRedirectUrl] = useState('')
  const [emailsCommune, setEmailsCommune] = useState<string[]>([])

  const franceConnectUrl = `${habilitation.franceconnectAuthenticationUrl}?redirectUrl=${encodeURIComponent(redirectUrl)}`

  useEffect(() => {
    const redirectUrl = `${window.location.href}?revisionId=${revision.id}&habilitationId=${habilitation.id}`
    setRedirectUrl(redirectUrl)
  }, [revision, habilitation])

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
            imageComponent={<ResponsiveImage src="/commune/default-logo.svg" alt="Mairie de la commune" style={{ objectFit: 'contain' }} />}
            desc={(
              <>
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
            linkProps={{
              onClick: sendPinCode,
              href: '#',
            }}
            title="Authentifier la mairie de la commune"
            titleAs="h3"
          />
        )}
        <Card
          desc={<span>Aucune donnée personnelle ne nous sera transmise durant ce processus d’authentification</span>}
          imageComponent={<ResponsiveImage src="/img/france-connect.png" alt="Logo FranceConnect" style={{ objectFit: 'contain' }} />}
          linkProps={{
            onClick: () => window.location.href = franceConnectUrl,
            href: '#',
          }}
          title="M'authentifier comme élu de la commune"
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
