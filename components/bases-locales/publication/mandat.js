import React from 'react'
import PropTypes from 'prop-types'

const Mandat = React.memo(({mandat}) => {
  const {nomNaissance, nomMarital, prenom, typeMandat} = mandat

  return (
    <div className='mandat'>
      <img src='/images/icons/elu.svg' />
      <div>{prenom} {nomMarital || nomNaissance}</div>
      <div><b>{typeMandat}</b></div>
      <style jsx>{`
        .mandat {
          display: flex;
          flex-direction: column;
          text-align: center;
        }
        `}</style>
    </div>
  )
})

Mandat.propTypes = {
  mandat: PropTypes.shape({
    nomNaissance: PropTypes.string.isRequired,
    nomMarital: PropTypes.string,
    prenom: PropTypes.string.isRequired,
    typeMandat: PropTypes.string.isRequired
  }).isRequired
}

export default Mandat
