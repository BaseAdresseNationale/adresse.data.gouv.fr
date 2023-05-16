import {
  Document,
  Link,
  Page,
  Text,
  StyleSheet,
  Font,
  View} from '@react-pdf/renderer'
import PropTypes from 'prop-types'
import {getNumeroComplet} from '@/lib/ban'
import {sanitizedDate} from '@/lib/date'
import {BlocMarque} from '../bloc-marque'

const fontSource = './public/dsfr/fonts/Marianne-Regular.woff'
const fontFamily = 'Marianne' // Devrait etre Arial Regular mais pas de source
const SITE_URL = 'https://adresse.data.gouv.fr'

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

function CertificatNumerotation({commune, voie, numero, etablissementDate}) {
  const {nom: nomCommune} = commune
  const {nomVoie: libelleVoie} = voie

  const isMultiParcelle = numero.parcelles.length > 1
  const parcelleCadastral = numero.parcelles.join(', ') || '123456'

  const etabliLe = sanitizedDate(etablissementDate || Date.now())

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
          <Text>{getNumeroComplet(numero)} {libelleVoie}</Text>
          <Text>{numero.lieuDitComplementNom}</Text>
          <Text>{numero.codePostal} {numero.libelleAcheminement}</Text>
        </View>
        <View style={{padding: '12pt'}}>
          {/* <Image source='Capture de l’adresse sur l’explorateur'/>
          or <Canvas /> */}
          {/*
          <Link src={`/base-adresse-nationale/${numero.id}`}>
            Lien vers l’adresse sur l’explorateur adresse.data.gouv.fr : {new URL(`/base-adresse-nationale/${numero.id}`, SITE_URL).toString()}
          </Link>
          */}
        </View>
        <Text>
          Pour servir et valoir ce que de droit, le {etabliLe}.
        </Text>

        <Text style={stylesDSFR.signature}>L’équipe adresse</Text>

        <Text style={{fontStyle: 'italic', position: 'absolute', left: '20mm', bottom: '20mm'}}>
          Signaler un problème à la commune de {nomCommune} : <Link src={`/commune/${commune.code}`}>{new URL(`/commune/${commune.code}`, SITE_URL).toString()}</Link>
        </Text>

      </Page>
    </Document>
  )
}

export {CertificatNumerotation}

CertificatNumerotation.propTypes = {
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  voie: PropTypes.shape({
    nomVoie: PropTypes.string.isRequired
  }),
  numero: PropTypes.shape({
    id: PropTypes.string.isRequired,
    lieuDitComplementNom: PropTypes.string,
    codePostal: PropTypes.string.isRequired,
    libelleAcheminement: PropTypes.string.isRequired,
    parcelles: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  etablissementDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ])
}
