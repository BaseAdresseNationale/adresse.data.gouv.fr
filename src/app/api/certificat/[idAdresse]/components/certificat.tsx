/* eslint-disable jsx-a11y/alt-text */
import {
  Document,
  Link,
  Page,
  Text,
  Image,
  View,
} from '@react-pdf/renderer'
import { stylesDSFR } from './certificat.stylesheet'
import { env } from 'next-runtime-env'

const NEXT_PUBLIC_ADRESSE_URL = env('NEXT_PUBLIC_ADRESSE_URL')

interface CertificatNumerotationProps {
  data: {
    id: string
    createdAt: string
    full_address: {
      number: number
      commonToponymDefaultLabel: string
      suffix?: string
      districtDefaultLabel: string
      cog: string
      lieuDitComplementNomDefaultLabel?: string
      postalCode: string
      multidistributed: boolean
    }
    cadastre_ids: string[]
  }
  qrCodeDataURL: string
  mairie: {
    telephone?: string
    email?: string
  }
  logoUrl: string
}

const CertificatNumerotation: React.FC<CertificatNumerotationProps> = ({ data, qrCodeDataURL, mairie, logoUrl }) => {
  const nomCommune = data.full_address.districtDefaultLabel
  const libelleVoie = data.full_address.commonToponymDefaultLabel
  const numero = data.full_address.number
  const suffix = data.full_address.suffix || ''
  const { cog } = data.full_address
  const lieuDitComplementNomDefaultLabel = data.full_address.lieuDitComplementNomDefaultLabel || null
  const parcelles = data.cadastre_ids.map(id => id.replace(/(\d+)([A-Z])/, '$1 $2'))

  // const logoUrl = `public/logos/certificat/${cog}.png`
  const logoAdresse = `public/logos/certificat/adresse-logo.png`

  const dateObj = new Date(data.createdAt)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('fr-FR', { month: 'long' })
  const year = dateObj.getFullYear()
  const etabliLe = `${day} ${month} ${year}`
  const certificatUrl = `${NEXT_PUBLIC_ADRESSE_URL}/certificat/${data.id}`
  const postalCode = data.full_address.postalCode
  const multidistributed = data.full_address.multidistributed

  const groupParcelles = (parcelles: string[]): string[] => {
    const grouped: string[] = []
    if (parcelles.length > 10) {
      for (let i = 0; i < parcelles.length; i += 3) {
        grouped.push(
          parcelles[i] + (parcelles[i + 1] ? `, ${parcelles[i + 1]}` : '') + (parcelles[i + 2] ? `, ${parcelles[i + 2]}` : '')
        )
      }
    }
    else {
      for (let i = 0; i < parcelles.length; i += 2) {
        grouped.push(
          parcelles[i] + (parcelles[i + 1] ? `    ,    ${parcelles[i + 1]}` : '')
        )
      }
    }
    return grouped
  }

  const groupedParcelles = groupParcelles(parcelles)

  return (
    <Document title="Certificat d'adressage">
      <Page size="A4" style={stylesDSFR.page}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Image src={logoAdresse} style={stylesDSFR.logoAdresse} />
          <Image src={logoUrl} style={stylesDSFR.logoBloc} />
        </View>
        <Text> {'\n'}</Text>
        {/* Conteneur pour le logo de la mairie et les informations */}
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <View>
            <Text>Ville de {nomCommune}</Text>

            {cog === '49331'
              ? (
                  <>
                    <Text>Secrétariat Général</Text>
                    <Text>02 41 92 52 74</Text>
                    <Text>fabienne.prodhomme@segreenanjoubleu.fr</Text>
                  </>
                )
              : (
                  <>
                    <Text>{mairie?.telephone}</Text>
                    <Text>{mairie?.email}</Text>
                  </>
                )}
          </View>
        </View>
        <Text style={stylesDSFR.titre}>Certificat d&apos;adressage</Text>
        <View style={stylesDSFR.contenu}>
          <Text>
            La ville de {nomCommune} atteste que l&apos;adresse ci-dessous est certifiée dans la Base Adresse
            Nationale à la date du {etabliLe}.
          </Text>
          <Text> {'\n'}</Text>

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
                  {lieuDitComplementNomDefaultLabel}
                </Text>
                <Text style={stylesDSFR.tableCell}>
                  {postalCode} {nomCommune}
                </Text>
              </View>
              <View style={stylesDSFR.tableCol}>
                {groupedParcelles.map((parcelle, index) => (
                  <Text key={index} style={parcelles.length > 10 ? stylesDSFR.tableCell10 : stylesDSFR.tableCell}>{parcelle}</Text>
                ))}
              </View>
            </View>
          </View>

          {
            multidistributed
              ? (
                  <>
                    <Text>{'\n'}</Text>
                    <Text style={stylesDSFR.annexe}>Cette commune dispose de plusieurs codes postaux fournis par &apos;La Poste&apos;. La Base Adresse Nationale ne garantit pas l&apos;exactitude du code postal fourni dans ce document. En cas de doute, veuillez vous rapprocher de la mairie pour l&apos;édition du certificat.</Text>
                  </>
                )
              : null
          }

          <Text> {'\n'}</Text>

          <Text>
            En foi de quoi, le présent certificat est délivré au demandeur pour servir et valoir ce que de droit.
          </Text>
        </View>
        <View style={stylesDSFR.qrCodeContainer}>
          <View style={stylesDSFR.qrCodeLinkContainer}>
            <Text>
              Consulter l&apos;authenticité de ce certificat :
            </Text>
            <Link src={certificatUrl}>
              {certificatUrl}
            </Link>
          </View>
          <Image src={qrCodeDataURL} style={stylesDSFR.qrCode} />
        </View>

        <View style={stylesDSFR.footer}>
          <Text style={stylesDSFR.footerText}>Ce document ne vaut pas : autorisation d&apos;urbanisme, droit de passage, servitude, droit de propriété, certificat de résidence ou d&apos;hébergement.</Text>
          <Text style={stylesDSFR.footerText}>
            Émis par les services de la Base Adresse Nationale, mandataire pour la ville de {nomCommune}.
          </Text>

          <View style={stylesDSFR.logoContainer}>
            {/* <Image src={logoUrl} style={stylesDSFR.footerLogo} /> */}
            <View style={{ width: '2mm' }} />
            <Image src="public/logos/certificat/BAN.png" style={stylesDSFR.footerLogo} />
          </View>
        </View>
      </Page>
    </Document>
  )
}

export { CertificatNumerotation }
