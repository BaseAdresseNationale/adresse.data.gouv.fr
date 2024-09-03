
import {
  Document,
  Link,
  Page,
  Text,
  StyleSheet,
  Font,
  Image,
  View} from '@react-pdf/renderer'
import PropTypes from 'prop-types'
import getConfig from 'next/config'

const fontSource = './public/dsfr/fonts/Marianne-Regular.woff'
const fontSourceBold = './public/dsfr/fonts/Marianne-Bold.woff'
const fontFamily = 'Marianne' // Devrait etre Arial Regular mais pas de source
const {NEXT_PUBLIC_ADRESSE_URL} = getConfig().publicRuntimeConfig

Font.register({
  family: 'Marianne',
  fonts: [
    {src: fontSource}, // Font-style: normal, font-weight: normal
    {src: fontSourceBold, fontWeight: 700},
    {src: './public/dsfr/fonts/Marianne-Regular_Italic.woff', fontStyle: 'italic'},
    {src: './public/dsfr/fonts/Marianne-Bold_Italic.woff', fontStyle: 'italic', fontWeight: 700}
  ]})

const stylesDSFR = StyleSheet.create({
  page: {padding: '17mm', fontFamily, fontSize: '10pt'},
  titre: {paddingTop: '20mm', paddingBottom: '12mm', textAlign: 'center', fontSize: '12pt', fontWeight: '700'},
  contenu: {},
  blocMarque: {marginBottom: '20mm'},
  signature: {textAlign: 'right', fontSize: '8pt', margin: '10'},
  qrCode: {width: '25mm', height: '25mm', alignSelf: 'flex-end'},
  footer: {position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', fontSize: 10, flexDirection: 'column', alignItems: 'flex-start'},
  footerText: {marginBottom: '5mm', textAlign: 'left'},
  logoBloc: {width: '39mm', height: '30mm'},
  logoBanBloc: {width: '20mm', height: '20mm'},
  logoContainer: {flexDirection: 'row', alignItems: 'center'},
  boldText: {fontFamily: 'Marianne', fontWeight: '700'}
})
function CertificatNumerotation({data, qrCodeDataURL, mairie}) {
  const nomCommune = data.full_address.districtDefaultLabel
  const libelleVoie = data.full_address.commonToponymDefaultLabel
  const numero = data.full_address.number
  const suffix = data.full_address.suffix ? data.full_address.suffix : ''
  const {cog} = data.full_address
  const parcelleCadastral = data.cadastre_ids.map(id => id.replace(/(\d+)([A-Z])/, '$1 $2')).join(', ')
  const logoUrl = `public/logos/certificat/${cog}.png`

  const dateObj = new Date(data.createdAt)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('fr-FR', {month: 'long'})
  const year = dateObj.getFullYear()
  const etabliLe = `${day} ${month} ${year}`
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/certificat/${data.id}`
  return (
    <Document tile="Certificat d'adressage">
      <Page size='A4' style={stylesDSFR.page}>
        <Image src={logoUrl} style={stylesDSFR.logoBloc} />
        <Text>Ville de {nomCommune}</Text>
        <Text>{mairie?.telephone}</Text>
        <Text>{mairie?.email}</Text>
        <Text style={stylesDSFR.titre}>Certificat d&apos;adressage</Text>
        <View style={stylesDSFR.contenu}>
          <Text>
            La commune de {nomCommune} atteste que l&apos;adresse ci-dessous est certifiée dans la Base Adresse
            Nationale à la date du {etabliLe}
          </Text>
          <Text> {'\n'}</Text>
          <Text>
            Section(s) et N° parcelle(s) cadastrale(s) :
          </Text>
          <Text>
            {parcelleCadastral}
          </Text>
          <Text> {'\n'}</Text>
          <Text>
            N° de voirie et désignation de la voie :
          </Text>
          {suffix ?
            <Text style={stylesDSFR.boldText}>{numero} {suffix} {libelleVoie}</Text> :
            <Text style={stylesDSFR.boldText}>{numero} {libelleVoie}</Text>}
          <Text style={stylesDSFR.boldText}>{nomCommune}</Text>
          <Text> {'\n'}</Text>

          <Text>
            En foi de quoi, le présent certificat est délivré au demandeur pour servir et valoir ce que de droit.
          </Text>
        </View>
        <Text> {'\n\n\n\n'}</Text>
        <Text>Consulter l&apos;authenticité de ce certificat : <Link src={certificatUrl}>{certificatUrl}</Link></Text>
        <Image src={qrCodeDataURL} style={stylesDSFR.qrCode} />
        <View style={stylesDSFR.footer}>
          <Text style={stylesDSFR.footerText}>
            Émis par les services de la Base Adresse Nationale, mandataire pour la commune de {nomCommune}.
          </Text>

          <View style={stylesDSFR.logoContainer}>
            <Image src={logoUrl} style={stylesDSFR.logoBloc} />
            <View style={{width: '2mm'}} />
            <Image src='public/images/logos/BAN.png' style={stylesDSFR.logoBanBloc} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

export {CertificatNumerotation}

CertificatNumerotation.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    address_id: PropTypes.string.isRequired,
    full_address: PropTypes.shape({
      number: PropTypes.number.isRequired,
      commonToponymDefaultLabel: PropTypes.string.isRequired,
      suffix: PropTypes.string,
      districtDefaultLabel: PropTypes.string.isRequired,
      cog: PropTypes.string.isRequired,
    }).isRequired,
    cadastre_ids: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  qrCodeDataURL: PropTypes.string.isRequired,
  mairie: PropTypes.object.isRequired
}
