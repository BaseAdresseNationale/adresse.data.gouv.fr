import { env } from 'next-runtime-env'

const BASE_URL = env('NEXT_PUBLIC_GRIST_API_URL') || ''
const DOC_ID = env('NEXT_PUBLIC_GRIST_DOC_ID') || ''
const DOC_BANDEAU_ID= env('NEXT_PUBLIC_GRIST_DOC_BANDEAU_ID') || ''
const WANTED_TABLE_ID = env('NEXT_PUBLIC_GRIST_TABLE_ID') || ''
const API_TOKEN = env('GRIST_API_TOKEN') || ''

interface GristRecord {
  id: number
  fields: {
    [key: string]: string
  }
}

interface ApplicationRecord {
  id_application: string
  nom_application: string
  description_utilisation: string
  nom_utilisateur: string
  logo_download_url: string
  statut_integration: string
  type_integration: string
  url_article: string
  url_application: string
  categorie_application: string
  tags_application: string
}

export interface AlerteRecord {
  type: string
  message: string
  date_debut: string
  date_fin: string
  validation_publication: string
  lien: string
  message_lien: string
}

export interface ActuRecord {
  date: string
  titre: string
  description: string
  auteur: string
  lien: string
  tags_application: string
}

async function fetchTableJson(table: string, docId: string): Promise<{ records: GristRecord[] }> {
  const filterDict = { non_publication_usage: [false], validation_publication: [true] }
  const params = new URLSearchParams({ filter: JSON.stringify(filterDict) })

  const response = await fetch(`${BASE_URL}/docs/${docId}/tables/${table}/records?${params}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    next: {
      revalidate: 0,
      tags: ['grist'],
    },
  })
  if (!response.ok) {
    console.error(new Error(`Erreur HTTP ${response.status} lors de la récupération des données Grist.`))
    return { records: [] }
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

export async function fetchAndProcessAlertesGristData() : Promise<AlerteRecord[]>{
  const data = await fetchTableJson('Alertes', DOC_BANDEAU_ID)
  const records = data?.records

  if (!records || records.length === 0) return []

  const activeRecords = records.filter((record) => {
    const date_debut = Number(record.fields.date_debut)
    const date_fin = Number(record.fields.date_fin)
    if (!date_debut || !date_fin) return false

    const now = new Date()
    const dateDebut = new Date(date_debut * 1000)
    const dateFin = new Date(date_fin * 1000)

    return dateDebut <= now && now <= dateFin
  })

  const order = { alert: 0, warning: 1, info: 2 }

  return activeRecords
    .sort((a, b) => (order[a.fields.type as keyof typeof order] ?? 3) - (order[b.fields.type as keyof typeof order] ?? 3))
    .map(record => {
      const fields = record.fields
        return {
          type: fields.type ?? '',
          message: fields.message ?? '',
          date_debut: fields.date_debut ?? '',
          date_fin: fields.date_fin ?? '',
          validation_publication: fields.validation_publication ?? '',
          lien: fields.lien ?? '',
          message_lien: fields.message_lien ?? ''
        }
    })
}

export async function fetchAndProcessActusGristData(): Promise<ActuRecord[]> {
  const data = await fetchTableJson('News', DOC_BANDEAU_ID)
  const records = data.records || []

  // Traiter les données
  const processedRecords: ActuRecord[] = records.map((record) => {
    const fields = record.fields

    // Aplatir les tags
    let tagsApplication = fields.tags_application
    if (tagsApplication) {
      tagsApplication = flattenTags(tagsApplication)
    }
    return {
      date: fields.date,
      titre: fields.titre,
      description: fields.description,
      auteur: fields.auteur,
      lien: fields.lien,
      tags_application: tagsApplication,
    }
  })

  return processedRecords
}

export async function fetchAndProcessApplicationGristData(): Promise<ApplicationRecord[]> {
  const data = await fetchTableJson(WANTED_TABLE_ID, DOC_ID)
  const records = data.records || []

  // Traiter les données
  const processedRecords: ApplicationRecord[] = records.map((record) => {
    const fields = record.fields

    // Aplatir les tags
    let tagsApplication = fields.tags_application
    if (tagsApplication) {
      tagsApplication = flattenTags(tagsApplication)
    }
    const imgId = fields.Logo2?.[1]?.toString() ?? ''
    return {
      id_application: fields.id_application,
      nom_application: fields.nom_application,
      description_utilisation: fields.description_utilisation,
      nom_utilisateur: fields.nom_utilisateur,
      logo_download_url: imgId ? `/api/grist/attachments/${imgId}` : '',
      statut_integration: fields.statut_integration,
      type_integration: fields.type_integration,
      url_article: fields.url_article_blog,
      url_application: fields.url_application,
      categorie_application: fields.Thematique,
      tags_application: tagsApplication,
    }
  })

  return processedRecords
}
