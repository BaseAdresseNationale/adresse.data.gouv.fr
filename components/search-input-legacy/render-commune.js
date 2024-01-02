import theme from '@/styles/theme'

function RenderCommune(commune, isHighlighted) {
  const {nom, code} = commune
  return (
    <div key={code} className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
      <div className='item-label'>{nom}</div>
      <div>{code}</div>
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

export default RenderCommune
