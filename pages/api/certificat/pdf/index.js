import ReactPDF from '@react-pdf/renderer'
import {Test} from '@/components/document/numerotation/certificat'

export default async function handler(req, res) {
  const pdfStream = await ReactPDF.renderToStream(<Test />)
  res.setHeader('Content-Type', 'application/pdf')
  pdfStream.pipe(res)
  pdfStream.on('end', () => console.log('Done streaming, response sent.'))
}
