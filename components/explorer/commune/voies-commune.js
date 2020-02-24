import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import withFetch from '../../hoc/with-fetch'

import TableList from '../../table-list'

const VoiesCommune = ({voies, commune}) => {
  const cols = {
    nomVoie: {
      title: 'Nom de voie',
      getValue: voie => voie.nomVoie,
      sortBy: 'alphabetical'
    },
    numerosCount: {
      title: 'Nombre d’adresses',
      getValue: voie => voie.numerosCount,
      sortBy: 'numeric'
    }
  }

  const handleSelect = ({idVoie}) => {
    Router.push(
      `/commune/voie?idVoie=${idVoie}`,
      `/explore/commune/${commune.codeCommune}/voie/${idVoie}`
    )
  }

  return (
    <div className='voies'>
      <TableList
        title='Voies de la commune'
        subtitle={voies.length === 1 ? `${voies.length} adresse répertoriée` : `${voies.length} adresses répertoriées`}
        list={voies}
        textFilter={item => item.nomVoie}
        filters={{sourceNomVoie: 'Sources'}}
        cols={cols}
        handleSelect={handleSelect} />

      <style jsx>{`
        .voies {
          margin-top: 2em;
        }
        `}</style>
    </div>
  )
}

VoiesCommune.propTypes = {
  voies: PropTypes.array,
  commune: PropTypes.object
}

VoiesCommune.defaultProps = {
  voies: [],
  commune: {}
}

export default withFetch(data => ({
  voies: data.voies,
  commune: data
}))(VoiesCommune)
