import ReactPDF from '@react-pdf/renderer'
import {CertificatNumerotation} from '@/components/document/numerotation/certificat'
import {getAddress} from '@/lib/api-ban'

const {NEXT_PUBLIC_CERTIFICAT_NUMEROTATION_ENABLED} = process.env

const certifiable = ({sources, certifie, parcelles}) =>
  // Check is bal
  sources?.includes('bal') &&
  // Check is certifié
  certifie &&
  // Check has parcelle
  parcelles?.length > 0

export default async function handler(req, res) {
  if (!NEXT_PUBLIC_CERTIFICAT_NUMEROTATION_ENABLED) {
    return res.status(401).send('Unauthorized')
  }

  let address
  try {
    address = await getAddress(req.query['id-adresse'])
  } catch {
    return res.status(404).send()
  }

  if (!certifiable(address)) {
    return res.status(404).send('Adresse incompatible avec le service')
  }

  const pdfStream = await ReactPDF.renderToStream(
    <CertificatNumerotation
      numero={address}
      voie={address.voie}
      commune={address.commune}
    />
  )
  res.setHeader('Content-Type', 'application/pdf')
  pdfStream.pipe(res)
  pdfStream.on('end', () => console.log('Done streaming, response sent.'))
}
