import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import TableList from '../../../../table-list'

const BalVoiesTable = ({commune, voies}) => {
  const handleSelect = voie => {
    Router.push(
      `/commune/voie?idVoie=${voie.idVoie}`,
      `/explore/commune/${commune.code}/voie/${voie.idVoie}`
    )
  }

  const selectVoie = item => {
    handleSelect(
      voies.find(voie => voie.idVoie === item.key)
    )
  }

  const headers = {
    nomVoie: {
      title: 'Nom de voie',
      type: 'alphabetical',
      func: voie => voie.nomVoie
    },
    numerosCount: {
      title: 'Nombre d’adresses',
      type: 'numeric',
      func: voie => voie.numerosCount
    }
  }
  const genItems = voies => {
    return voies.map(voie => {
      return {
        key: voie.idVoie,
        values: [
          voie.nomVoie,
          voie.numerosCount
        ]
      }
    })
  }

  return (
    <TableList
      title='Voies de la commune'
      subtitle={`${voies.length} voies répertoriées`}
      list={voies}
      headers={headers}
      genItems={genItems}
      initialSort={headers[0]}
      handleSelect={selectVoie} />
  )
}

BalVoiesTable.propTypes = {
  commune: PropTypes.object.isRequired,
  voies: PropTypes.array.isRequired
}

export default BalVoiesTable
