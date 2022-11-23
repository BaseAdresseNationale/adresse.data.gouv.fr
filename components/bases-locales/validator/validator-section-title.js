import PropTypes from 'prop-types'

function ValidatorSectionTitle({children}) {
  return (
    <h2>
      {children}

      <style jsx>{`
        h2 {
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>
    </h2>
  )
}

ValidatorSectionTitle.propTypes = {
  children: PropTypes.node.isRequired
}

export default ValidatorSectionTitle
