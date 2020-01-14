import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import withFetch from '../../hoc/with-fetch'

import {tagsList} from '../../../lib/table'
import {getTypeByPriority} from '../../../lib/types'
import TableList from '../../table-list'

const VoiesCommune = ({voies, commune}) => {
  const headers = [
    {
      title: 'Nom de voie',
      type: 'alphabetical',
      func: voie => voie.nomVoie
    },
    {
      title: 'Nombre d’adresses',
      type: 'numeric',
      func: voie => voie.numerosCount
    },
    {title: 'Source'}
  ]

  const selectVoie = item => {
    voies.find(voie => voie.idVoie === item.key)
    handleSelect(item.key)
  }

  const handleSelect = idVoie => {
    Router.push(
      `/commune/voie?idVoie=${idVoie}`,
      `/explore/commune/${commune.codeCommune}/voie/${idVoie}`
    )
  }

  const genItems = voies => {
    return voies.map(voie => {
      return {
        key: voie.idVoie,
        values: [
          voie.nomVoie,
          voie.numerosCount,
          tagsList(getTypeByPriority(voie.sources))
        ]
      }
    })
  }

  return (
    <div className='voies'>
      <TableList
        title='Voies de la commune'
        subtitle={voies.length === 1 ? `${voies.length} adresse répertoriée` : `${voies.length} adresses répertoriées`}
        list={voies}
        headers={headers}
        genItems={genItems}
        initialSort={headers[0]}
        handleSelect={selectVoie} />

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
