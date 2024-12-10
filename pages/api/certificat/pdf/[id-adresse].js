import getConfig from 'next/config'
import ReactPDF from '@react-pdf/renderer'

import {CertificatNumerotation} from '@/components/document/numerotation/certificat'
import {getAddress, getDistrict} from '@/lib/api-ban'
import QRCode from 'qrcode'
import {getMairie} from '@/lib/api-etablissements-public'

const {NEXT_PUBLIC_CERTIFICAT_NUMEROTATION_ENABLED, NEXT_PUBLIC_ADRESSE_URL, NEXT_PUBLIC_API_BAN_URL} = getConfig().publicRuntimeConfig
const {BAN_API_TOKEN} = process.env

const isAddressCertifiable = async ({banId, sources, certifie, parcelles}) => {
  return (
    // Check has banId
    banId &&
    // Check is bal
    sources?.includes('bal') &&
    // Check is certifié
    certifie &&
    // Check has parcelle
    parcelles?.length > 0
  )
}

const isDistrictCertifiable = async banIdDistrict => {
  // Check if district is certifiable
  if (!banIdDistrict) {
    return false
  }

  const rawResponse = await getDistrict(banIdDistrict)
  const district = rawResponse.response
  if (!district) {
    return false
  }

  const districtConfig = district.config || {}
  if (!districtConfig.certificate) {
    return false
  }

  return true
}

export default async function handler(req, res) {
  if (!NEXT_PUBLIC_CERTIFICAT_NUMEROTATION_ENABLED) {
    return res.status(401).send('Unauthorized')
  }

  let address
  try {
    address = await getAddress(req.query['id-adresse'])
    if (!address) {
      throw new Error('Adresse non trouvée')
    }
  } catch {
    return res.status(404).send()
  }

  const isCertifiable = (await isDistrictCertifiable(address.banIdDistrict)) && isAddressCertifiable(address)
  if (!isCertifiable) {
    return res.status(404).send('Adresse incompatible avec le service')
  }

  const {banId: addressID} = address
  const rawResponse = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${BAN_API_TOKEN}`,
    },
    body: JSON.stringify({addressID}),
  })

  if (!rawResponse.ok) {
    throw new Error('Échec de la publication des données')
  }

  const response = await rawResponse.json()
  // Temorary check to handle ban api response migration
  // to-do: remove this check when ban api response migration is done
  const data = response.response || response
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/certificat/${data.id}`
  const qrCodeDataURL = await QRCode.toDataURL(certificatUrl)
  const mairie = await getMairie(data.full_address.cog)
  // Const logo = await getCommuneLogo(data.full_address.insee_code)

  const pdfStream = await ReactPDF.renderToStream(
    <CertificatNumerotation
      data={data}
      qrCodeDataURL={qrCodeDataURL}
      mairie={mairie}
      // Logo={logo}
    />
  )
  res.setHeader('Content-Type', 'application/pdf')
  pdfStream.pipe(res)
  pdfStream.on('end', () => console.log('Done streaming, response sent.'))
}
