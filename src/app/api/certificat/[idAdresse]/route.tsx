import { NextRequest, NextResponse } from 'next/server'
import { getAddress, getDistrictConfigByCodeCommune } from '@/lib/api-ban'
import { getCommune } from '@/lib/api-geo'
import { isAddressCertifiable } from '@/lib/ban'
import { env } from '@/utils/env'
import { CertificateTypeEnum } from '@/types/api-ban.types'
import { getCurrentAgent } from '@/lib/identity'
import { banAgentHeaders } from '@/lib/ban-session'
import { rejectCrossSiteRequest } from '@/lib/request-guard'

const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')
const BAN_API_TOKEN = env('BAN_API_TOKEN')

// POST : la création d'un certificat ne doit jamais partir d'un simple lien ou d'une image.
export async function POST(request: NextRequest, props: { params: Promise<{ idAdresse: string }> }) {
  const rejection = rejectCrossSiteRequest(request)
  if (rejection) return rejection

  const params = await props.params
  let address
  let habilitation = false
  try {
    address = await getAddress(params.idAdresse)
    if (!address) {
      throw new Error('Adresse non trouvée')
    }
  }
  catch {
    return new NextResponse(null, { status: 404 })
  }

  const agent = await getCurrentAgent()
  try {
    const siret = agent?.identity.siret
    if (siret) {
      const commune = await getCommune(address?.commune?.code)
      if (commune?.siren && commune.siren === siret.slice(0, 9)) {
        habilitation = true
      }
    }
  }
  catch (error) {
    console.error('Vérification de l\'habilitation impossible', error)
  }

  const codeCommune = address?.codeCommune ?? address?.commune?.code
  const addressConfig = codeCommune ? await getDistrictConfigByCodeCommune(codeCommune) : null
  const isCertifiable = (addressConfig?.certificate == CertificateTypeEnum.ALL || (addressConfig?.certificate == CertificateTypeEnum.DISTRICT && habilitation)) && await isAddressCertifiable(address)

  if (!isCertifiable) {
    return new NextResponse('Adresse incompatible avec le service', { status: 404 })
  }

  const { banId: addressID } = address
  const rawResponse = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(agent ? banAgentHeaders(agent) : { Authorization: `Token ${BAN_API_TOKEN}` }),
    },
    body: JSON.stringify({ addressID }),
  })

  if (!rawResponse.ok) {
    console.error(
      'Échec de la publication des données :',
      `Erreur ${rawResponse.status}: ${rawResponse.statusText}`,
    )
    return new NextResponse(null, { status: rawResponse.status })
  }

  const response = await rawResponse.json()
  // temporary check migrating ban api response structure
  // to-do : remove this check after migration
  const data = response.response || response

  return NextResponse.json({ id: data.id })
}
