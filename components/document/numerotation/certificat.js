import {
  Document,
  Link,
  Page,
  Text,
  StyleSheet,
  Font,
  View} from '@react-pdf/renderer'
import PropTypes from 'prop-types'
import {BlocMarque} from '../bloc-marque'
import getConfig from 'next/config'

const fontSource = './public/dsfr/fonts/Marianne-Regular.woff'
const fontFamily = 'Marianne' // Devrait etre Arial Regular mais pas de source
const SITE_URL = 'https://adresse.data.gouv.fr'
const {NEXT_PUBLIC_ADRESSE_URL} = getConfig().publicRuntimeConfig

Font.register({
  family: 'Marianne',
  fonts: [
    {src: fontSource}, // Font-style: normal, font-weight: normal
    {src: './public/dsfr/fonts/Marianne-Regular_Italic.woff', fontStyle: 'italic'},
    {src: './public/dsfr/fonts/Marianne-Bold_Italic.woff', fontStyle: 'italic', fontWeight: 700}
  ]})

const stylesDSFR = StyleSheet.create({
  page: {padding: '17mm', fontFamily, fontSize: '10pt'},
  titre: {paddingTop: '20mm', paddingBottom: '12mm', textAlign: 'center', fontSize: '12pt', fontWeight: 'bold'},
  contenu: {},
  blocMarque: {marginBottom: '20mm'},
  signature: {textAlign: 'right', fontSize: '8pt', margin: '10'}
})

function CertificatNumerotation({data}) {
  const nomCommune = data.nom_commune
  const libelleVoie = data.rue
  const numero = data.number
  const {cog} = data

  const isMultiParcelle = data.parcelles.length > 1
  const parcelleCadastral = data.parcelles.join(', ') || '123456'

  const etabliLe = data.createdAt
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/api/certificat/justificatif/${data.id}`

  const mmMarinaneSize = 4.25

  return (
    <Document tile='Certificat de numerotage'>
      <Page size='A4' style={stylesDSFR.page}>
        <View style={stylesDSFR.blocMarque}>
          <BlocMarque baseSize={mmMarinaneSize} />
        </View>
        <Text>Commune de {nomCommune}</Text>

        <Text style={stylesDSFR.titre}>Certificat de numérotage</Text>
        <View style={stylesDSFR.contenu}>
          <Text>
            La commune de {nomCommune} atteste que l’adresse certifiée dans sa Base Adresse Locale, associée
            { isMultiParcelle ? ' aux parcelles ' : ' à la parcelle '} {parcelleCadastral} est :
          </Text>
          <Text>{numero} {libelleVoie}</Text>
          <Text>{cog} {nomCommune}</Text>
        </View>
        <View style={{padding: '12pt'}}>
          <Text> Lien du document :{' '}
            <Link src={certificatUrl}>{certificatUrl}</Link>
          </Text>
        </View>
        <Text>
          Pour servir et valoir ce que de droit, le {etabliLe}.
        </Text>

        <Text style={stylesDSFR.signature}>L’équipe adresse</Text>

        <Text style={{fontStyle: 'italic', position: 'absolute', left: '20mm', bottom: '20mm'}}>
          Signaler un problème à la commune de {nomCommune} : <Link src={`/commune/${cog}`}>{new URL(`/commune/${cog}`, SITE_URL).toString()}</Link>
        </Text>

      </Page>
    </Document>
  )
}

export {CertificatNumerotation}

CertificatNumerotation.propTypes = {
  /* eslint-disable camelcase */
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    address_id: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    suffix: PropTypes.string,
    rue: PropTypes.string.isRequired,
    nom_commune: PropTypes.string.isRequired,
    cog: PropTypes.string.isRequired,
    parcelles: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
  /* eslint-enable camelcase */

}
