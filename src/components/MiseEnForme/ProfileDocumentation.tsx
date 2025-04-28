import { getLabel, ProfileType } from '@ban-team/validateur-bal'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import Table from '@codegouvfr/react-dsfr/Table'
import styled from 'styled-components'

type ProfileDocumentationProps = {
  profile: ProfileType
}

const StyledWrapper = styled.div`
  .table-wrapper {
    max-width: calc(100vw - 3rem);
  }
`

export default function ProfileDocumentation({ profile }: ProfileDocumentationProps) {
  const { name, errors, warnings, infos } = profile
  const errorsLevel = errors?.map((code: string) => ([code, getLabel(code.replace('@@', 'eus'))])) ?? []
  const warningsLevel = warnings?.map((code: string) => ([code, getLabel(code.replace('@@', 'eus'))])) ?? []
  const infosLevel = infos?.map((code: string) => ([code, getLabel(code.replace('@@', 'eus'))])) ?? []

  return (
    <StyledWrapper>
      <h3 style={{ marginTop: '1rem' }}>{name}</h3>
      <Accordion label="Erreurs">
        <div className="table-wrapper">
          <Table data={errorsLevel} headers={['Code', 'Libellé']} />
        </div>
      </Accordion>

      <Accordion label="Avertissements">
        <div className="table-wrapper">
          <Table data={warningsLevel} headers={['Code', 'Libellé']} />
        </div>
      </Accordion>

      <Accordion label="Informations">
        <div className="table-wrapper">
          <Table data={infosLevel} headers={['Code', 'Libellé']} />
        </div>
      </Accordion>
    </StyledWrapper>
  )
}
