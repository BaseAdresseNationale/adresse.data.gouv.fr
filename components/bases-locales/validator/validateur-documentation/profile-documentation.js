import PropTypes from 'prop-types'
import {fr} from '@codegouvfr/react-dsfr'
import {Accordion} from '@codegouvfr/react-dsfr/Accordion'
import styled from 'styled-components'
import ListDocumentation from './list-documentation'

const StyledAccordion = styled(Accordion)`
  .fr-accordion__btn {
    font-size: 16px;
  }
  .fr-accordion__btn:hover {
    background: none !important;
  }
  .accordion {
    padding: 10px;
  }
`

function ProfileDocumentation({profile, type}) {
  return (
    <div style={{marginLeft: '10px'}} className={fr.cx('fr-accordions-group')}>
      <h4>{profile.name}</h4>
      <StyledAccordion label='Erreurs' className='accordion'>
        <ListDocumentation key='errors' lines={profile.errors} type={type} title='Erreurs' className='error' />
      </StyledAccordion>
      <StyledAccordion label='Alertes' className='accordion'>
        <ListDocumentation key='warnings' lines={profile.warnings} type={type} title='Alertes' className='warning' />
      </StyledAccordion>
      <br />
    </div>
  )
}

ProfileDocumentation.propTypes = {
  profile: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
}

export default ProfileDocumentation
