import {colorthemes as customColor} from '@/components/charts'

export const defDatadailyDownload = [
  {
    dataKey: 'download BAL',
  },
  {
    dataKey: 'download CSV historique adresses',
    strokeDasharray: 5,
  },
  {
    dataKey: 'download CSV historique lieux-dits',
  },
]

export const defDataGeocoder = [
  {
    dataKey: 'nbSearch',
    colors: customColor.glicyne[0],
  },
  {
    dataKey: 'nbSearchResult',
    strokeDasharray: 3,
    colors: customColor.glicyne[2],
  },
  {
    dataKey: 'nbSearchEmptyResult',
    strokeDasharray: 5,
    colors: customColor.glicyne[3],
  },
  {
    dataKey: 'nbReverseSearch',
    colors: customColor.ecume[0],
  },
  {
    dataKey: 'nbReverseSearchResult',
    strokeDasharray: 3,
    colors: customColor.ecume[3],
  },
  {
    dataKey: 'nbReverseSearchEmptyResult',
    strokeDasharray: 5,
    colors: customColor.ecume[2],
  },
]

export const defDataBanVisit = [
  {
    dataKey: 'Visites',
    colors: customColor.glicyne[3],
  },
  {
    dataKey: 'Visiteurs uniques',
    strokeDasharray: 3,
    colors: customColor.azure[0],
  },
]
