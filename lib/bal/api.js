import getConfig from 'next/config'

const {publicRuntimeConfig} = getConfig()
export const API_BAL_URL = publicRuntimeConfig.API_BAL_URL || 'https://adresse.data.gouv.fr/api-bal'
