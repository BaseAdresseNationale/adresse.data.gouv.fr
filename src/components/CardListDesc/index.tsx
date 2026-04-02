import type { ReactNode } from 'react'

interface CardListDescProps {
  title: string
  titleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  items: ReactNode[]
  descPrefix?: ReactNode
  footer?: ReactNode
}

/**
 * Carte DSFR avec une liste (ul/li) dans la description.
 * Le composant Card de react-dsfr rend `desc` dans un <p>, ce qui interdit
 * d'y nicher un <ul>. Ce composant reproduit le markup DSFR en utilisant
 * un <div> à la place.
 */
export default function CardListDesc({
  title,
  titleAs: TitleTag = 'h3',
  items,
  descPrefix,
  footer,
}: CardListDescProps) {
  return (
    <div className="fr-card">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <TitleTag className="fr-card__title">{title}</TitleTag>
          <div className="fr-card__desc">
            {descPrefix && <p>{descPrefix}</p>}
            <ul>
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        {footer && (
          <div className="fr-card__footer">{footer}</div>
        )}
      </div>
    </div>
  )
}
