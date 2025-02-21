import { ReviewType } from '@/types/partenaire.types'
import { StyledWrapper } from './PartenaireReviews.styles'
import StarRatingInput from '@/components/StarRatingInput'

interface PartenaireReviewsProps {
  reviews: ReviewType[]
}

export default function PartenaireReviews({ reviews }: PartenaireReviewsProps) {
  return (
    <StyledWrapper title="Avis des communes et collectivités">
      {reviews.map(review => (
        <div key={review.id} className="review">
          <div className="review-header">
            <p><b>{review.community ? review.community : 'Anonyme'}</b></p>
            <p>le {new Date(review.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="review-rating">
            <StarRatingInput value={review.rating} style={{ marginBottom: '0.5rem' }} />
            <span>{review.rating}</span>
          </div>
          <div className="review-content">
            <p>{review.comment}</p>
          </div>
        </div>
      ))}
    </StyledWrapper>
  )
}
