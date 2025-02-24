import { Habilitation } from '@/types/api-depot.types'
import Button from '@codegouvfr/react-dsfr/Button'
import PinField from 'react-pin-field'
import styled from 'styled-components'

const StyledWrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;

.pin-wrapper {
  margin-bottom: 2rem;
  .pin-field {
    border: 1px solid #d3d3d3;
    border-right: none;
    font-size: 2rem;
    height: 4rem;
    outline: none;
    text-align: center;
    width: 4rem;

    &:first-of-type {
       border-radius: .5rem 0 0 .5rem;
    }

    &:last-of-type {
      border-right: 1px solid #d3d3d3;
      border-radius: 0 .5rem .5rem 0;
    }

    &:focus {
      box-shadow: 0 0 0 2px #f5f5f5;
      border: 2px solid ${({ theme }) => theme.colors.primary.main};
    }
  }
}
`

interface PinCodeValidationProps {
  email: string
  onSubmit: (code: string) => void
  sendPinCode: () => Promise<void>
  isLoading?: boolean
}

export function PinCodeValidation({ onSubmit, email, sendPinCode, isLoading }: PinCodeValidationProps) {
  return (
    <StyledWrapper>
      <p>Entrer le code qui vous a été envoyé à l&apos;adresse : <b>{email}</b></p>
      <div className="pin-wrapper">
        <PinField disabled={isLoading} onComplete={code => onSubmit(code)} validate={/^[0-9]$/} length={6} className="pin-field" />
      </div>
      <p>Vous n’avez pas reçu votre code ?</p>
      <Button priority="secondary" onClick={sendPinCode}>
        Renvoyer un code
      </Button>
    </StyledWrapper>
  )
}
