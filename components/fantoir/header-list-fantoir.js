import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function HeaderListFantoir({headers, hasToggleContent}) {
  return (
    <div className='title'>
      {headers.map(header => (
        <div key={header} className='infos'>{header}</div>
      ))}
      {hasToggleContent && (
        <div className='margin' />
      )}
      <style jsx>{`
        .title {
          background-color: ${theme.primary};
          color: #FFF;
          display: flex;
          padding: .5em;
          border-top: 1px solid ${theme.border};
          border-left: 1px solid ${theme.border};
          border-right: 1px solid ${theme.border};
        }

        .infos {
          flex: 1;
          text-align: center;
        }

        .margin {
          width: 35px;
        }
      `}</style>
    </div>
  )
}

HeaderListFantoir.defaultProps = {
  hasToggleContent: false
}

HeaderListFantoir.propTypes = {
  headers: PropTypes.array.isRequired,
  hasToggleContent: PropTypes.bool
}

export default HeaderListFantoir
