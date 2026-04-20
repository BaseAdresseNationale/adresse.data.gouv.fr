import { StyleSheet, Font } from '@react-pdf/renderer'

const fontSource = 'public/fonts/Marianne-Regular.woff'
const fontSourceBold = 'public/fonts/Marianne-Bold.woff'
const fontFamily = 'Marianne'

Font.register({
  family: fontFamily,
  fonts: [
    { src: fontSource },
    { src: fontSourceBold, fontWeight: 700 },
    { src: 'public/fonts/Marianne-Regular_Italic.woff', fontStyle: 'italic' },
    { src: 'public/fonts/Marianne-Bold_Italic.woff', fontStyle: 'italic', fontWeight: 700 },
  ],
})

const stylesDSFR = StyleSheet.create({
  page: { padding: '17mm', fontFamily, fontSize: '10pt' },
  titre: { paddingTop: '20mm', paddingBottom: '12mm', textAlign: 'center', fontSize: '12pt', fontWeight: 700 },
  contenu: { width: '100%' },
  attestationLine: { width: '100%' },
  issuerBlockLine: { width: '100%', maxWidth: '100%' },
  qrCode: { width: '25mm', height: '25mm', alignSelf: 'flex-end' },
  qrCodeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10mm' },
  footer: { position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', fontSize: 10, flexDirection: 'column', alignItems: 'flex-start' },
  footerText: { marginBottom: '5mm', textAlign: 'left' },
  logoBloc: { maxWidth: '35mm', maxHeight: '20mm', width: 'auto', height: 'auto' },
  logoAdresse: { height: '15mm', width: 'auto' },
  logoMarianne: { height: '15mm', width: 'auto' },
  table: { display: 'flex', width: 'auto', marginTop: '10mm', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row' },
  tableCol: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
  tableCell: { margin: 5, fontSize: 10 },
  tableCell10: { margin: 1, fontSize: 8 },
  tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
  qrCodeLinkContainer: { flex: 1, marginRight: '5mm', minWidth: 1 },
  annexe: { fontSize: '7pt' },
})

export { stylesDSFR }
