import PropTypes from 'prop-types'
import styled from 'styled-components'
import {AlertTriangle} from 'react-feather'
import {Button} from '@codegouvfr/react-dsfr/Button'

const StyledButton = styled(Button)`
    color: white;
    margin: 20px !important;
    align-self: center;

    > svg {
        margin-left: 10px;
    }
`

function SignalementButton({onClick, disabled}) {
  return <StyledButton disabled={disabled} onClick={onClick}>Signaler un problème <AlertTriangle /></StyledButton>
}

SignalementButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

export default SignalementButton
