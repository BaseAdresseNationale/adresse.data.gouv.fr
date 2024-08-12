import getConfig from 'next/config'
import ReactPDF from '@react-pdf/renderer'
import QRCode from 'qrcode'
import {getMairie, getCommuneLogo} from '@/lib/api-etablissements-public'

import {CertificatNumerotation} from '@/components/document/numerotation/certificat'

const {NEXT_PUBLIC_CERTIFICAT_NUMEROTATION_ENABLED, NEXT_PUBLIC_ADRESSE_URL, NEXT_PUBLIC_API_BAN_URL} = getConfig().publicRuntimeConfig

export default async function handler(req, res) {
  if (!NEXT_PUBLIC_CERTIFICAT_NUMEROTATION_ENABLED) {
    return res.status(401).send('Unauthorized')
  }

  const certificatId = req.query['id-certificat']

  // Envoyer une requêteT pour récupérer les informations du certificat
  const response = await fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificat/${certificatId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    return res.status(500).send('Echec de la récupération des données')
  }

  const data = await response.json()
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/api/certificat/justificatif/${data.id}`
  const qrCodeDataURL = await QRCode.toDataURL(certificatUrl)
  const mairie = await getMairie(data.cog)
  const logo = await getCommuneLogo(data.cog)

  // Générer le PDF avec les informations récupérées
  const pdfStream = await ReactPDF.renderToStream(
    <CertificatNumerotation
      data={data}
      qrCodeDataURL={qrCodeDataURL}
      mairie={mairie}
      logo={logo}
    />
  )

  res.setHeader('Content-Type', 'application/pdf')
  pdfStream.pipe(res)
  pdfStream.on('end', () => console.log('Done streaming, response sent.'))
}
