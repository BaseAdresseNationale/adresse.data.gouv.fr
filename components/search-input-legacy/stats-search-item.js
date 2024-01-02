import theme from '@/styles/theme'

export default function StatsSearchItem(item, isHighlighted) {
  const {nom, value, type} = item
  return (
    <div key={`${type}-${value}`} className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
      <div className='item-label'>{nom}</div>
      <div className='item-info'>{type} {value}</div>
      <style jsx>{`
            .item {
              display: flex;
              flex-flow: row;
              justify-content: space-between;
              align-items: center;
              padding: 1em;
            }
    
            .item .item-label {
              font-weight: 600;
            }
  
            .item .item-info {
              color: ${theme.colors.darkGrey};
            }
  
            .item-highlighted .item-info {
              color: ${theme.colors.white};
            }
    
            .item:hover {
              cursor: pointer;
            }
    
            .item-highlighted {
              background-color: ${theme.primary};
              color: ${theme.colors.white};
            }
            `}</style>
    </div>
  )
}
