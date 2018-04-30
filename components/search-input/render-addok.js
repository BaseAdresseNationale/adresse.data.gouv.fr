import theme from '../../styles/theme'

const featuresTypes = {
  housenumber: 'Numéro',
  street: 'Rue',
  locality: 'Lieu-dit',
  hamlet: 'Hameau',
  village: 'Village',
  city: 'Ville',
  municipality: 'Commune'
}

function RenderAddok(item, isHighlighted) {  
  if (item.header) {
    return (
      <div> 
        <div key={item.header} className='header'>{featuresTypes[item.header]}</div>
        <style jsx>{`
          .header {
            background-color: ${theme.colors.grey};
            color: ${theme.colors.white};
            padding: 0.2em;
          }
        `}
        </style>
      </div>
    )
  }

  const {name, context, city, type, postcode} = item.properties
  
  return (
    <div>
      <div key={`${name}-${postcode}`} className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
        <div>
          <div className='label'>{name}</div>
        </div>
          {type === 'municipality' ?
            <div>{context}</div> :
            <div>{city} - {postcode}</div>
          }
      </div>
      <style jsx>{`
        .item {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          padding: 1em;
        }

        .item .label {
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

export default RenderAddok
