import PropTypes from 'prop-types'

function SearchResultItem({label, details, isHighlighted}) {
  return (
    <>
      <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
        <div className='item-label'>{label}</div>
        <div>{details}</div>
      </div>

      <style jsx>{`
        .item {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          padding: 0.5em;
        }
        .item:hover {
          cursor: pointer;
        }
        .item-highlighted {
          background-color: var(--light-blue);
          color: var(--white);
        }
        .item .item-label {
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

SearchResultItem.propTypes = {
  label: PropTypes.string.isRequired,
  details: PropTypes.string,
  isHighlighted: PropTypes.bool
}

export default SearchResultItem
