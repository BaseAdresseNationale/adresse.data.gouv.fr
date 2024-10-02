import Section from '../Section'
import ValidationAccordion from './ValidationAccordion'

export type ValidationRow = {
  isValid: boolean
  line: number
  parsedValues: Record<string, string>
  rawValues: Record<string, string>
  localizedValues: Record<string, string>
  errors: { code: string, level: 'E' | 'W' | 'I', schemaName: string }[]
}

type ValidationSummaryProps = {
  rows: ValidationRow[]
}

export default function ValidationSummary({ rows }: ValidationSummaryProps) {
  const errorsGroups: Record<string, ValidationRow[]> = {}
  const warningsGroups: Record<string, ValidationRow[]> = {}
  const infosGroups: Record<string, ValidationRow[]> = {}

  rows.forEach((row) => {
    row.errors.forEach(({ code, level }) => {
      if (level === 'W') {
        if (!warningsGroups[code]) {
          warningsGroups[code] = []
        }

        warningsGroups[code].push(row)
      }

      if (level === 'E') {
        if (!errorsGroups[code]) {
          errorsGroups[code] = []
        }

        errorsGroups[code].push(row)
      }

      if (level === 'I') {
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
