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

function SignalementButton({onClick}) {
  return <StyledButton onClick={onClick}>Signaler un problème <AlertTriangle /></StyledButton>
}

SignalementButton.propType = {
  onClick: PropTypes.func.isRequired,
}

export default SignalementButton
