import { env } from 'next-runtime-env'

const BASE_URL = env('NEXT_PUBLIC_GRIST_API_URL') || ''
const DOC_ID = env('NEXT_PUBLIC_GRIST_DOC_ID') || ''
const WANTED_TABLE_ID = env('NEXT_PUBLIC_GRIST_TABLE_ID') || ''
const API_TOKEN = env('NEXT_PUBLIC_GRIST_API_TOKEN') || ''

interface GristRecord {
  id: number
  fields: {
    [key: string]: string
  }
}

interface ProcessedRecord {
  id_application: string
  nom_application: string
  description_utilisation: string
  nom_utilisateur: string
  image_utilisateur: string
  statut_integration: string
  type_integration: string
  url_application: string
  categorie_application: string
  tags_application: string
}

async function fetchTableJson(): Promise<{ records: GristRecord[] }> {
  const filterDict = { non_publication_usage: [false] }
  const params = new URLSearchParams({ filter: JSON.stringify(filterDict) })

  const response = await fetch(`${BASE_URL}/docs/${DOC_ID}/tables/${WANTED_TABLE_ID}/records?${params}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    next: {
      revalidate: 0,
      tags: ['grist'],
    },
  })

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la récupération des données.`)
  }

  return response.json()
}

function flattenTags(val: any): string {
  if (Array.isArray(val)) {
    let cleaned = val
    if (cleaned.length > 1 && cleaned[0] === 'L') {
      cleaned = cleaned.slice(1)
    }
    cleaned = cleaned.filter((v: any) => v).map((v: any) => String(v))
    return cleaned.join(', ')
  }
  return val
}

export async function fetchAndProcessGristData(): Promise<ProcessedRecord[]> {
  const data = await fetchTableJson()
  const records = data.records || []

  // Traiter les données
  const processedRecords: ProcessedRecord[] = records.map((record) => {
    const fields = record.fields

    // Aplatir les tags
    let tagsApplication = fields.tags_application
    if (tagsApplication) {
      tagsApplication = flattenTags(tagsApplication)
    }

    return {
      id_application: fields.id_application,
      nom_application: fields.nom_application,
      description_utilisation: fields.description_utilisation,
      nom_utilisateur: fields.nom_utilisateur,
      image_utilisateur: fields.image_utilisateur,
      statut_integration: fields.statut_integration,
      type_integration: fields.type_integration,
      url_application: fields.url_application,
      categorie_application: fields.Thematique,
      tags_application: tagsApplication,
    }
  })

  return processedRecords
}
