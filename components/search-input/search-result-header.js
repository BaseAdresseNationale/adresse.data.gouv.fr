import PropTypes from 'prop-types'

function SearchResultHeader({header}) {
  return (
    <div>
      <div className='item-header'>{header}</div>
      <style jsx>{`
        .item-header {
          background-color: var(--dark-grey);
          color: var(--white);
          padding: 0.2em;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

SearchResultHeader.propTypes = {
  header: PropTypes.string.isRequired
}

export default SearchResultHeader
