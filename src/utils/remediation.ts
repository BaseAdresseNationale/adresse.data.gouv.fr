import { ValidateRowFullType } from '@ban-team/validateur-bal'

export function getNbRowsRemediation(rows: ValidateRowFullType[]) {
  return rows?.reduce((acc, value) => Object.keys(value.remediations).length > 0 ? acc + 1 : acc, 0) || 0
}

export function getErrorsWithRemediations(rows: ValidateRowFullType[]) {
  return rows?.reduce((acc: Record<string, number>, row) => {
    Object.values(row.remediations)?.forEach(({ errors }) => {
      errors.forEach((error) => {
        acc[error] = (acc[error] || 0) + 1
      })
    })
    return acc
  }, {}) || {}
}
