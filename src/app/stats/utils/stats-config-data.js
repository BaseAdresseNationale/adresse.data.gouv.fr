import {
  colorthemes as customColors,
  defaultTheme as defaultColors,
} from '@/components/Charts/ColorTheme'

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
  ],
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
  ],
}

export const defDataFirstsPublications = {
  default: {
    label: 'Nombre de BAL',
    toolipLabel: 'Évolution du nombre BALs publiées',
    period: '',
  },
  config: [
    {
      dataKeyLabel: 'Nombre de BALs',
      dataKeyRaw: 'firsts_publications',
      colors: customColors.glicyne[3],
      allowMissingValues: true,
    },
    {
      dataKeyLabel: 'Objectif',
      dataKeyRaw: 'objectif',
      colors: customColors.rubi[3],
      chartType: 'scatter',
      allowMissingValues: true,
    },
  ],
}

// Sources des adresses de la BAN (aires empilées), même regroupement que dans bal-admin
// dataKeyRaw : valeurs possibles de `source_position` dans l'export BAN
export const defDataSourcesPublicationBan = {
  default: {
    label: 'Sources',
    toolipLabel: 'Composition de la Base Adresse Nationale',
    period: '',
  },
  config: [
    {
      dataKeyLabel: 'Certifié',
      dataKeyRaw: ['certified'],
      colors: ['#50C878', '#50C878'],
    },
    {
      dataKeyLabel: 'BAL',
      dataKeyRaw: ['commune'],
      colors: ['#008300', '#008300'],
    },
    {
      dataKeyLabel: 'Cadastre',
      dataKeyRaw: ['cadastre'],
      colors: ['#2a78d6', '#2a78d6'],
    },
    {
      dataKeyLabel: 'ARCEP',
      dataKeyRaw: ['arcep'],
      colors: ['#4a3aa7', '#4a3aa7'],
    },
    {
      dataKeyLabel: 'La Poste',
      dataKeyRaw: ['laposte', 'la-poste', 'la poste'],
      colors: ['#eb6834', '#eb6834'],
    },
    {
      dataKeyLabel: 'SDIS',
      dataKeyRaw: ['sdis'],
      colors: ['#e34948', '#e34948'],
    },
    {
      dataKeyLabel: 'Assemblage',
      dataKeyRaw: ['ign', 'inconnue', 'ban'],
      colors: ['#898781', '#898781'],
    },
  ],
}

// Objectifs de premières publications cumulées, au début de chaque année
export const firstsPublicationsObjectives = {
  '2022-01': 5000,
  '2023-01': 10000,
  '2024-01': 15000,
  '2025-01': 20000,
  '2026-01': 25000,
  '2027-01': 30000,
  '2028-01': 35000,
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
  ],
}
