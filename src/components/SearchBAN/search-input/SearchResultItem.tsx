import {
  Item,
  ItemLabel,
  ItemDetails,
} from './SearchResultItem.styles'

interface SearchResultItemProps {
  label: React.ReactNode
  details?: React.ReactNode
  isHighlighted?: boolean
}

function SearchResultItem({ label, details, isHighlighted }: SearchResultItemProps) {
  return (
    <Item $isHighlighted={isHighlighted} className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
      <ItemLabel className="item-label">{label}</ItemLabel>
      <ItemDetails>{details}</ItemDetails>
    </Item>
  )
}

export default SearchResultItem
