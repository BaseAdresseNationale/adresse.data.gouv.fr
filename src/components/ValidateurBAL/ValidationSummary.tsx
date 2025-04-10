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
    { title: 'Erreurs', count: errorsCount, groups: errorsGroups },
    { title: 'Avertissements', count: warningsCount, groups: warningsGroups },
    { title: 'Informations', count: infosCount, groups: infosGroups },
  ]

  return totalErrorCount > 0
    ? (
        <Section>
          <h4>Validation ligne par ligne</h4>
          {dataValidation.map(({ count, title, groups }) => (
            count > 0 && <ValidationAccordion key={title} title={title} groups={groups} />
          ))}
        </Section>
      )
    : null
}
