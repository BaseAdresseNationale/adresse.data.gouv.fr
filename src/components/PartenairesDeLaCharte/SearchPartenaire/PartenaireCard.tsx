import { PartenaireDeLaCharteTypeEnum, PartenaireDeLaChartType, ReviewType } from '@/types/partenaire.types'
import { Card } from '@codegouvfr/react-dsfr/Card'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import ResponsiveImage from '../../ResponsiveImage'
import Link from 'next/link'
import Button from '@codegouvfr/react-dsfr/Button'
import { useMemo } from 'react'
import StarRatingInput from '@/components/StarRatingInput'

export interface PartenaireCardProps {
  partenaire: PartenaireDeLaChartType
  onReview?: (partenaire: PartenaireDeLaChartType) => void
  detail: string
}

export default function PartenaireCard({
  partenaire,
  onReview,
  detail,
}: PartenaireCardProps) {
  const globalReview = useMemo(() => {
    if (!partenaire.reviews || partenaire.reviews.length === 0) {
      return
    }

    return partenaire.reviews.reduce((acc, review) => acc + review.rating, 0) / partenaire.reviews.length
  }, [partenaire])

  const isCommune = partenaire.type === PartenaireDeLaCharteTypeEnum.COMMUNE

  return (
    <Card
      key={partenaire.id}
      title={(
        <Link href={isCommune ? `/commune/${partenaire.codeCommune}` : `/partenaires/${partenaire.id}`}>
          {partenaire.name}
          {globalReview && (
            <div style={{ display: 'flex', alignItems: 'end', marginTop: '0.5rem' }}>
              <StarRatingInput value={globalReview} />
              <span style={{ fontSize: '0.8rem', color: '#f1bf42', marginLeft: '1rem' }}>{(partenaire.reviews as ReviewType[]).length} avis</span>
            </div>
          )}
        </Link>
      )}
      imageComponent={<ResponsiveImage src={partenaire.picture} alt={`Logo de ${partenaire.name}`} style={{ objectFit: 'contain' }} />}
      start={<ul className="fr-badges-group">{partenaire.services.map(service => <Badge key={service} small noIcon severity="info">{service}</Badge>)}</ul>}
      detail={detail}
      footer={(
        <>
          {partenaire.link && <Button priority="secondary" linkProps={{ href: partenaire.link, target: '_blank' }} style={{ marginTop: '0.5rem' }}>Site du partenaire</Button>}
          {onReview && <Button type="button" priority="secondary" style={{ marginTop: '0.5rem' }} onClick={() => onReview(partenaire)}>Noter la prestation</Button>}
        </>
      )}
    />
  )
}
