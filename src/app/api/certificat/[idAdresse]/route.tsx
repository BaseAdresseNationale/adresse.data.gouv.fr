import { NextRequest, NextResponse } from 'next/server'
import { getAddress, getDistrict } from '@/lib/api-ban'
const NEXT_PUBLIC_API_BAN_URL = process.env.NEXT_PUBLIC_API_BAN_URL
const BAN_API_TOKEN = process.env.BAN_API_TOKEN

const isAddressCertifiable = async ({ banId, sources, certifie, parcelles }: any): Promise<boolean> => {
  return !!banId && sources?.includes('bal') && certifie && parcelles?.length > 0
}

const isDistrictCertifiable = async (banIdDistrict: string | null): Promise<boolean> => {
  if (!banIdDistrict) {
    return false
  }

  const rawResponse = await getDistrict(banIdDistrict)
  const district = rawResponse.response

  if (!district) {
    return false
  }

  const districtConfig = district.config || {}
  return !!districtConfig.certificate
}

export async function GET(request: NextRequest, { params }: { params: { idAdresse: string } }) {
  let address
  try {
    address = await getAddress(params.idAdresse)
    if (!address) {
      throw new Error('Adresse non trouvée')
    }
  }
  catch {
    return new NextResponse(null, { status: 404 })
  }

  const isCertifiable = (await isDistrictCertifiable(address.banIdDistrict)) && await isAddressCertifiable(address)
  if (!isCertifiable) {
    return new NextResponse('Adresse incompatible avec le service', { status: 404 })
  }

  const { banId: addressID } = address
  const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${BAN_API_TOKEN}`,
    },
    body: JSON.stringify({ addressID }),
  })

  if (!response.ok) {
    const errorMessage = `Erreur ${response.status}: ${response.statusText}`
    console.error('Échec de la publication des données :', errorMessage)
    throw new Error(errorMessage)
  }

  const data = await response.json()

  return NextResponse.json({ id: data.id })
}