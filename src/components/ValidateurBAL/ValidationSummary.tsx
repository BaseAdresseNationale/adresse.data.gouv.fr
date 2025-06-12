import Badge from '@codegouvfr/react-dsfr/Badge'
import Section from '../Section'
import ValidationAccordion from './ValidationAccordion'
import { ErrorLevelEnum, ValidateRowFullType } from '@ban-team/validateur-bal'

type ValidationSummaryProps = {
  rows: ValidateRowFullType[]
}

export default function ValidationSummary({ rows }: ValidationSummaryProps) {
  const errorsGroups: Record<string, ValidateRowFullType[]> = {}
  const warningsGroups: Record<string, ValidateRowFullType[]> = {}
  const infosGroups: Record<string, ValidateRowFullType[]> = {}

  rows.forEach((row) => {
    row.errors!.forEach(({ code, level }) => {
      if (level === ErrorLevelEnum.WARNING) {
        if (!warningsGroups[code]) {
          warningsGroups[code] = []
        }

        warningsGroups[code].push(row)
      }

      if (level === ErrorLevelEnum.ERROR) {
        if (!errorsGroups[code]) {
          errorsGroups[code] = []
        }

        errorsGroups[code].push(row)
      }

      if (level === ErrorLevelEnum.INFO) {
        if (!infosGroups[code]) {
          infosGroups[code] = []
        }

        infosGroups[code].push(row)
      }
    })
  })

  const errorsCount = Object.keys(errorsGroups).length
  const warningsCount = Object.keys(warningsGroups).length
  const infosCount = Object.keys(infosGroups).length

  const totalErrorCount = errorsCount + warningsCount + infosCount

  const dataValidation = [
    { key: 'errors', title: <Badge severity="error">Erreur</Badge>, count: errorsCount, groups: errorsGroups },
    { key: 'warnings', title: <Badge severity="warning">Avertissement</Badge>, count: warningsCount, groups: warningsGroups },
    { key: 'infos', title: <Badge severity="info">Info</Badge>, count: infosCount, groups: infosGroups },
  ]

  return totalErrorCount > 0
    ? (
        <>
          {dataValidation.map(({ count, key, title, groups }) => (
            count > 0 && <ValidationAccordion key={key} title={title} groups={groups} />
          ))}
        </>
      )
    : null
}
