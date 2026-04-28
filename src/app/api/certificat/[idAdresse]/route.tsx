import { NextRequest, NextResponse } from 'next/server'
import { getAddress, getDistrictConfigByCodeCommune } from '@/lib/api-ban'
import { getCommune } from '@/lib/api-geo'
import { isAddressCertifiable } from '@/lib/ban'
import { env } from 'next-runtime-env'
import { CertificateTypeEnum } from '@/types/api-ban.types'

const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')
const BAN_API_TOKEN = env('BAN_API_TOKEN')

export async function GET(request: NextRequest, { params }: { params: { idAdresse: string } }) {
  let address
  let connexion = null
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

  try {
    connexion = await fetch(`${env('NEXT_PUBLIC_ADRESSE_URL')}/api/me`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
        Authorization: request.headers.get('authorization') || '',
      },
    })
    if (connexion && connexion.ok) {
      const userInfo = await connexion.json()
      const commune = await getCommune(address?.commune?.code)
      if (userInfo?.siret && commune?.siren && commune.siren === userInfo.siret.slice(0, 9)) {
        habilitation = true
      }
    }
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && (error as { status?: number }).status === 401) {
      habilitation = false
    }
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
      'Authorization': `Token ${BAN_API_TOKEN}`,
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
