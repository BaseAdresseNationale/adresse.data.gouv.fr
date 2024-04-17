import {
  colorthemes as customColors,
  defaultTheme as defaultColors,
} from '@/components/charts'

export const defDataDailyDownload = {
  default: {
    label: 'Téléchargements',
    toolipLabel: 'Total des téléchargements',
    period: '',
    total: 0,
  },
  config: [
    {
      dataKeyLabel: 'Données BAN',
      dataKeyRaw: 'Download Data ban',
      colors: customColors.rubi[3],
    },
    {
      dataKeyLabel: 'Export de commune (Format BAL)',
      dataKeyRaw: 'Download Commune adresses (Format csv-bal)',
      colors: customColors.glicyne[3],
      strokeDasharray: 5,
    },
    {
      dataKeyLabel: 'Export de commune (Format BAN/IGN)',
      dataKeyRaw: 'Download Commune adresses (Format csv-legacy)',
      colors: customColors.glicyne[1],
    },
    {
      dataKeyLabel: 'Fichier Cadastre',
      dataKeyRaw: 'Download Data adresses-cadastre',
      colors: customColors.ecume[2],
    },
    {
      dataKeyLabel: 'Autres données',
      dataKeyRaw: 'Other Download',
      colors: defaultColors[0],
    },
  ]
}

export const defDataMonthlyLookup = {
  default: {
    label: 'Lookup',
    period: '',
    toolipLabel: 'Recherche d’adresses',
  },
  config: [
    {
      dataKeyLabel: 'Total des recherches',
      dataKeyRaw: 'Total',
      colors: customColors.ecume[0],
      ordinate: true,
    },
    {
      dataKeyLabel: 'Recherche d’adresse',
      dataKeyRaw: 'Numéro',
      colors: customColors.glicyne[0],
    },
    {
      dataKeyLabel: 'Recherche de toponyme',
      dataKeyRaw: 'Voie',
      strokeDasharray: 3,
      colors: customColors.glicyne[2],
    },
    {
      dataKeyLabel: 'Recherche de commune ou arrondissement',
      dataKeyRaw: 'Commune',
      strokeDasharray: 5,
      colors: customColors.glicyne[3],
    },
    {
      dataKeyLabel: 'Recherche d’identifiant inconnue',
      dataKeyRaw: 'false',
      colors: defaultColors[0],
    },
  ]
}

export const defDataBanVisit = {
  default: {
    label: 'Visite',
    toolipLabel: 'Quantité de visite sur le site',
    period: '',
  },
  config: [
    {
      dataKeyLabel: 'Visites',
      dataKeyRaw: 'nbVisits',
      colors: customColors.glicyne[3],
      ordinate: true,
    },
    {
      dataKeyLabel: 'Visiteurs uniques',
      dataKeyRaw: 'nbUniqVisitors',
      strokeDasharray: 3,
      colors: customColors.azure[0],
    },
  ]
}
