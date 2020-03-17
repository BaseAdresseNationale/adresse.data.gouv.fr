import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import TableList from '../../table-list'
import Tag from '../../tag'

import {getTypeByPriority} from '../../../lib/types'

const VoiesCommune = ({voies, commune}) => {
  const cols = {
    nomVoie: {
      title: 'Nom de voie',
      getValue: voie => voie.nomVoie,
      sortBy: 'alphabetical'
    },
    idVoie: {
      title: 'Code de la voie',
      getValue: voie => voie.idVoie,
      sortBy: 'alphabetical'
    },
    numerosCount: {
      title: 'Nombre d’adresses',
      getValue: voie => voie.numerosCount,
      sortBy: 'numeric'
    },
    sources: {
      title: 'Source',
      getValue: ({sources}) => getTypeByPriority(sources).map(source => (
        <Tag key={source} type={source} style={{display: 'inline-flex'}} />
      )),
      sortBy: 'alphabetical'
    }
  }

  const handleSelect = ({idVoie}) => {
    Router.push(
      `/commune/voie?idVoie=${idVoie}`,
      `/explore/commune/${commune.code}/voie/${idVoie}`
    )
  }

  return (
    <div className='voies'>
      <TableList
        title='Voies de la commune'
        subtitle={voies.length === 1 ? `${voies.length} adresse répertoriée` : `${voies.length} adresses répertoriées`}
        list={voies}
        textFilter={item => item.nomVoie}
        filters={{sources: 'Sources'}}
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
  commune: PropTypes.shape({
    code: PropTypes.string.isRequired
  })
}

VoiesCommune.defaultProps = {
  voies: [],
  commune: {}
}

export default VoiesCommune
