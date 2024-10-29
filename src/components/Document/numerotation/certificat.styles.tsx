import { StyleSheet, Font } from '@react-pdf/renderer'
const fontSource = 'node_modules/@codegouvfr/react-dsfr/dsfr/fonts/Marianne-Regular.woff'
const fontSourceBold = 'node_modules/@codegouvfr/react-dsfr/dsfr/fonts/Marianne-Bold.woff'
const fontFamily = 'Marianne'

Font.register({
  family: fontFamily,
  fonts: [
    { src: fontSource },
    { src: fontSourceBold, fontWeight: 700 },
    { src: 'node_modules/@codegouvfr/react-dsfr/dsfr/fonts/Marianne-Regular_Italic.woff', fontStyle: 'italic' },
    { src: 'node_modules/@codegouvfr/react-dsfr/dsfr/fonts/Marianne-Bold_Italic.woff', fontStyle: 'italic', fontWeight: 700 },
  ],
})

const stylesDSFR = StyleSheet.create({
  page: { padding: '17mm', fontFamily, fontSize: '10pt' },
  titre: { paddingTop: '20mm', paddingBottom: '12mm', textAlign: 'center', fontSize: '12pt', fontWeight: 700 },
  contenu: {},
  blocMarque: { marginBottom: '20mm' },
  signature: { textAlign: 'right', fontSize: '8pt', margin: '10' },
  qrCode: { width: '25mm', height: '25mm', alignSelf: 'flex-end' },
  qrCodeContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '10mm' },
  footer: { position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', fontSize: 10, flexDirection: 'column', alignItems: 'flex-start' },
  footerText: { marginBottom: '5mm', textAlign: 'left' },
  footerLogo: { width: '25', height: '25' },
  logoBloc: { maxWidth: '35mm', maxHeight: '20mm', width: 'auto', height: 'auto' },
  logoAdresse: { maxWidth: '60mm', maxHeight: '35', width: 'auto', height: 'auto' },
  logoBanBloc: { width: '20mm', height: '20mm' },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  boldText: { fontFamily: 'Marianne', fontWeight: 700 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: '12mm' },
  textContainer: { marginLeft: '10mm' },
  table: { display: 'flex', width: 'auto', marginTop: '10mm', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row' },
  tableCol: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
  tableCell: { margin: 5, fontSize: 10 },
  tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
})

export { stylesDSFR }
