type ValidateurProfile = {
  code: string
  name: string
  isUsed: boolean
  relax: boolean
  errors: string[]
  warnings: string[]
  infos: string[]
  format: string
}

declare module '@ban-team/validateur-bal' {
  export function validate(file: File, profile: string): Promise<any>
  export const profiles: Record<string, ValidateurProfile>
  export const getLabel: (code: string) => string
}

declare module 'vt-pbf';