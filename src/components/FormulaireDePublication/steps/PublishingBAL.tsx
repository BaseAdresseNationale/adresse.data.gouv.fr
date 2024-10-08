import { Commune } from '@/types/api-geo.types'
import Alert from '@codegouvfr/react-dsfr/Alert'
import Button from '@codegouvfr/react-dsfr/Button'
import { useState } from 'react'
import styled from 'styled-components'
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox'

interface PublishingBALProps {
  commune: Commune
  handlePublishRevision: () => Promise<void>
  hasConflict: boolean
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export function PublishingBAL({ commune, handlePublishRevision, hasConflict }: PublishingBALProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  return (
    <StyledWrapper>
      <p>La Base Adresse Locale de votre commune <b>{commune.nom} ({commune.code})</b> est maintenant <b>prête à être publiée</b></p>

      {hasConflict && (
        <>
          <Alert
            title={`Une Base Adresse Locale est déjà publiée pour ${commune.nom}`}
            severity="warning"
            description={(
              <p>
                Une autre Base Adresses Locale est déjà synchronisée avec la Base Adresses Nationale pour la commune de {commune.nom} ({commune.code}).<br />
                En choisissant de publier, votre Base Adresse Locale <b>remplacera celle actuellement en place</b>.
              </p>
            )}
          />

          <Checkbox
            style={{ marginTop: '2rem' }}
            options={[
              {
                label: 'Je comprends que ma Base Adresse Locale remplacera celle actuellement synchronisée avec la Base Adresses Nationale',
                nativeInputProps: {
                  checked: isConfirmed,
                  onChange: () => {
                    setIsConfirmed(prev => !prev)
                  },
                },
              },
            ]}
          />
        </>
      )}

      <Button iconId="fr-icon-upload-line" size="large" disabled={hasConflict && !isConfirmed} onClick={handlePublishRevision}>
        Publier
      </Button>
    </StyledWrapper>
  )
}
