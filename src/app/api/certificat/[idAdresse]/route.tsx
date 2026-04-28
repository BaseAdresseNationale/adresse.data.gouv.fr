import { NextRequest, NextResponse } from 'next/server'
import { getAddress } from '@/lib/api-ban'
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
  catch (error: any) {
    if (error?.status === 401) {
      habilitation = false
    }
  }

  const isCertifiable = (address?.config?.certificate == CertificateTypeEnum.ALL || (address?.config?.certificate == CertificateTypeEnum.DISTRICT && habilitation)) && await isAddressCertifiable(address)

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
    const errorMessage = `Erreur ${rawResponse.status}: ${rawResponse.statusText}`
    console.error('Échec de la publication des données :', errorMessage)
    throw new Error(errorMessage)
  }

  const response = await rawResponse.json()
  // temporary check migrating ban api response structure
  // to-do : remove this check after migration
  const data = response.response || response

  return NextResponse.json({ id: data.id })
}
