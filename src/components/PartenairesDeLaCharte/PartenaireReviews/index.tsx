import { ReviewType } from '@/types/partenaire.types'
import { StyledWrapper } from './PartenaireReviews.styles'
import StarRatingInput from '@/components/StarRatingInput'

interface PartenaireReviewsProps {
  reviews: ReviewType[]
}

const getReviewAuthor = (review: ReviewType) => {
  if (!review.fullname) {
    return 'Anonyme'
  }

  return `${review.fullname}${review.community ? ` (${review.community})` : ''}`
}

export default function PartenaireReviews({ reviews }: PartenaireReviewsProps) {
  return (
    <StyledWrapper title="Avis">
      {reviews.map(review => (
        <div key={review.id} className="review">
          <div className="review-header">
            <StarRatingInput value={review.rating} style={{ marginBottom: '0.5rem' }} />
            <p>{getReviewAuthor(review)}</p>
            <p>le {new Date(review.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="review-content">
            <p>{review.comment}</p>
          </div>
        </div>
      ))}
    </StyledWrapper>
  )
}
