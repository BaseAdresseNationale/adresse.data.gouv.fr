import getConfig from 'next/config'
import ReactPDF from '@react-pdf/renderer'

import {CertificatNumerotation} from '@/components/document/numerotation/certificat'

const {NEXT_PUBLIC_CERTIFICAT_NUMEROTATION_ENABLED} = getConfig().publicRuntimeConfig
const {NEXT_PUBLIC_API_BAN_URL} = getConfig().publicRuntimeConfig

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

  // Générer le PDF avec les informations récupérées
  const pdfStream = await ReactPDF.renderToStream(
    <CertificatNumerotation
      data={data}
    />
  )

  res.setHeader('Content-Type', 'application/pdf')
  pdfStream.pipe(res)
  pdfStream.on('end', () => console.log('Done streaming, response sent.'))
}
