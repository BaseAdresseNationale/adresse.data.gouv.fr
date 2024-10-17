import {
  Document,
  Link,
  Page,
  Text,
  StyleSheet,
  Font,
  Image,
  View
} from '@react-pdf/renderer'
import PropTypes from 'prop-types'
import getConfig from 'next/config'

const fontSource = './public/dsfr/fonts/Marianne-Regular.woff'
const fontSourceBold = './public/dsfr/fonts/Marianne-Bold.woff'
const fontFamily = 'Marianne'
const {NEXT_PUBLIC_ADRESSE_URL} = getConfig().publicRuntimeConfig

Font.register({
  family: 'Marianne',
  fonts: [
    {src: fontSource},
    {src: fontSourceBold, fontWeight: 700},
    {src: './public/dsfr/fonts/Marianne-Regular_Italic.woff', fontStyle: 'italic'},
    {src: './public/dsfr/fonts/Marianne-Bold_Italic.woff', fontStyle: 'italic', fontWeight: 700}
  ]
})

const stylesDSFR = StyleSheet.create({
  page: {padding: '17mm', fontFamily, fontSize: '10pt'},
  titre: {paddingTop: '20mm', paddingBottom: '12mm', textAlign: 'center', fontSize: '12pt', fontWeight: '700'},
  contenu: {},
  blocMarque: {marginBottom: '20mm'},
  signature: {textAlign: 'right', fontSize: '8pt', margin: '10'},
  qrCode: {width: '25mm', height: '25mm', alignSelf: 'flex-end'},
  qrCodeContainer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '10mm'}, // Conteneur pour le texte et le QR code
  footer: {position: 'absolute', bottom: '20mm', left: '20mm', right: '20mm', fontSize: 10, flexDirection: 'column', alignItems: 'flex-start'},
  footerText: {marginBottom: '5mm', textAlign: 'left'},
  footerLogo: {width: '20mm', height: 'auto'}, // Réduit la taille des logos ici
  logoBloc: {
    maxWidth: '35mm', // Largeur maximale de 35mm
    maxHeight: '35mm', // Hauteur maximale de 35mm
    width: 'auto', // Largeur automatique pour garder les proportions
    height: 'auto', // Hauteur automatique pour garder les proportions
  },
  logoBanBloc: {width: '20mm', height: '20mm'},
  logoContainer: {flexDirection: 'row', alignItems: 'center'},
  boldText: {fontFamily: 'Marianne', fontWeight: '700'},
  headerContainer: {flexDirection: 'row', alignItems: 'center', marginBottom: '12mm'},
  textContainer: {marginLeft: '10mm'},
  table: {display: 'table', width: 'auto', marginTop: '10mm', borderStyle: 'solid', borderWidth: 1, borderColor: '#000'},
  tableRow: {flexDirection: 'row'},
  tableCol: {width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#000'},
  tableCell: {margin: 5, fontSize: 10},
  tableHeader: {backgroundColor: '#f0f0f0', fontWeight: 'bold'}
})

function CertificatNumerotation({data, qrCodeDataURL, mairie}) {
  const nomCommune = data.full_address.districtDefaultLabel
  const libelleVoie = data.full_address.commonToponymDefaultLabel
  const numero = data.full_address.number
  const suffix = data.full_address.suffix ? data.full_address.suffix : ''
  const {cog} = data.full_address
  const parcelles = data.cadastre_ids.map(id => id.replace(/(\d+)([A-Z])/, '$1 $2'))

  const logoUrl = `public/logos/certificat/${cog}.png`

  const dateObj = new Date(data.createdAt)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('fr-FR', {month: 'long'})
  const year = dateObj.getFullYear()
  const etabliLe = `${day} ${month} ${year}`
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/certificat/${data.id}`

  // Fonction pour grouper les parcelles par deux
  const groupParcelles = parcelles => {
    const grouped = []
    for (let i = 0; i < parcelles.length; i += 2) {
      grouped.push(
        parcelles[i] + (parcelles[i + 1] ? `    ,    ${parcelles[i + 1]}` : '')
      )
    }

    return grouped
  }

  const groupedParcelles = groupParcelles(parcelles)

  return (
    <Document title="Certificat d'adressage">
      <Page size='A4' style={stylesDSFR.page}>
        <Image src={logoUrl} style={stylesDSFR.logoBloc} />
        <Text>Ville de {nomCommune}</Text>

        {cog === '49331' ? (
          <>
            <Text>Secrétariat Général</Text>
            <Text>02 41 92 52 74</Text>
            <Text>fabienne.prodhomme@segreenanjoubleu.fr</Text>
          </>
        ) : (
          <>
            <Text>{mairie?.telephone}</Text>
            <Text>{mairie?.email}</Text>
          </>
        )}
        <Text style={stylesDSFR.titre}>Certificat d&apos;adressage</Text>
        <View style={stylesDSFR.contenu}>
          <Text>
            La ville de {nomCommune} atteste que l&apos;adresse ci-dessous est certifiée dans la Base Adresse
            Nationale à la date du {etabliLe}.
          </Text>
          <Text> {'\n'}</Text>

          {/* Tableau modifié avec deux colonnes */}
          <View style={stylesDSFR.table}>
            <View style={stylesDSFR.tableRow}>
              <View style={stylesDSFR.tableCol}>
                <Text style={[stylesDSFR.tableCell, stylesDSFR.tableHeader]}>N° de voirie et désignation de la voie</Text>
              </View>
              <View style={stylesDSFR.tableCol}>
                <Text style={[stylesDSFR.tableCell, stylesDSFR.tableHeader]}>Section(s) et N° parcelle(s) cadastrale(s)</Text>
              </View>
            </View>
            <View style={stylesDSFR.tableRow}>
              <View style={stylesDSFR.tableCol}>
                <Text style={stylesDSFR.tableCell}>
                  {suffix ? `${numero} ${suffix} ${libelleVoie}` : `${numero} ${libelleVoie}`}
                </Text>
                <Text style={stylesDSFR.tableCell}>
                  {nomCommune}
                </Text>
              </View>
              <View style={stylesDSFR.tableCol}>
                {groupedParcelles.map((parcelle, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Text key={index} style={stylesDSFR.tableCell}>{parcelle}</Text>
                ))}
              </View>
            </View>
          </View>

          <Text> {'\n'}</Text>

          <Text>
            En foi de quoi, le présent certificat est délivré au demandeur pour servir et valoir ce que de droit.
          </Text>
        </View>
        {/* Conteneur pour le texte et le QR code */}
        <View style={stylesDSFR.qrCodeContainer}>
          <Text style={stylesDSFR.qrCodeText}>
            Consulter l&apos;authenticité de ce certificat : <Link src={certificatUrl}>{certificatUrl}</Link>
          </Text>
          <Image src={qrCodeDataURL} style={stylesDSFR.qrCode} />
        </View>
        <View style={stylesDSFR.footer}>
          <Text style={stylesDSFR.footerText}>
            Émis par les services de la Base Adresse Nationale, mandataire pour la ville de {nomCommune}.
          </Text>

          <View style={stylesDSFR.logoContainer}>
            <Image src={logoUrl} style={stylesDSFR.footerLogo} />
            <View style={{width: '2mm'}} />
            <Image src='public/images/logos/BAN.png' style={stylesDSFR.footerLogo} />
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
