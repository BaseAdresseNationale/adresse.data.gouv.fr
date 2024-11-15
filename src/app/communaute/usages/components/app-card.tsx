'use client'

import Card from '@codegouvfr/react-dsfr/Card'
import Tag from '@codegouvfr/react-dsfr/Tag'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Button from '@codegouvfr/react-dsfr/Button'
import ResponsiveImage from '@/components/ResponsiveImage'

type Severity = 'new' | 'error' | 'success'
const statusColors: Record<string, Severity> = {
  'en cours de test': 'new',
  'en réflexion': 'error',
  'default': 'success',
}

const typeColors: Record<string, string> = {
  'Non défini': '#ced4da',
  'API': '#68D391',
  'Téléchargement': '#a3cef1',
  'default': '#E2E8F0',
  'Géocodeur': '#70a0af',
}

const getStatusColor = (status: string) => statusColors[status] || statusColors.default
const getTypeColor = (type: string) => typeColors[type] || typeColors.default

export interface UsersBan {
  typeIntegration: string
  nomApplication: string
  descriptionUtilisation: string
  imageUtilisateur: string
  urlApplication: string
  dernierTelechargement: string
  nomUtilisateur: string
  statutIntegration: string
  tagsApplication: string
}

function AppCard({
  statutIntegration,
  typeIntegration,
  nomApplication,
  descriptionUtilisation,
  imageUtilisateur,
  urlApplication,
  dernierTelechargement,
  nomUtilisateur,
  tagsApplication,
}: UsersBan) {
  return (
    <Card
      size="small"
      title={nomApplication}
      desc={descriptionUtilisation}
      imageComponent={<ResponsiveImage src={imageUtilisateur} alt={nomUtilisateur} style={{ objectFit: 'contain' }} />}
      start={tagsApplication && (
        <ul className="fr-tags-group">
          {tagsApplication.split(', ').map((tag, index) => <li key={index}><Tag small key={index}>{tag.toLowerCase()}</Tag></li>)}
        </ul>
      )}
      end={(
        <ul className="fr-tags-group">
          <li><Badge noIcon className="fr-badge--sm" severity={getStatusColor(statutIntegration)}>{statutIntegration}</Badge></li>
          <li><p style={{ backgroundColor: getTypeColor(typeIntegration) }} className="fr-badge fr-badge--sm">{typeIntegration}</p></li>
        </ul>
      )}
      endDetail={dernierTelechargement && <p>Dernier téléchargement: {dernierTelechargement}</p>}

      footer={urlApplication && (
        <Button
          className="fr-btn fr-btn--secondary"
          linkProps={{
            href: urlApplication,
            target: '_blank',
          }}
          size="small"
        >Voir l`application
        </Button>
      )}
    />

  )
}

export default AppCard
