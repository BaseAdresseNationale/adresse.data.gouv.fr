import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import Section from '../../section'

import TableList from '../../table-list'
import {tagsList} from '../../../lib/table'
import Head from './head'
import MapContainer from './map-container'

const Voie = ({commune, voie, numero}) => {
  const handleSelect = ({numero, suffixe}) => {
    const {codeCommune, idVoie} = Router.query
    const href = `/explore/commune/voie?codeCommune=${codeCommune}&idVoie=${idVoie}${numero ? `&numero=${numero}${suffixe || ''}` : ''}`
    const as = `/explore/commune/${codeCommune}/voie/${idVoie}${numero ? `/numero/${numero}${suffixe || ''}` : ''}`

    Router.push(href, as)
  }

  const cols = {
    numero: {
      title: 'Numéro',
      getValue: voie => voie.numero,
      sortBy: 'numeric'
    },
    sourcePosition: {
      title: 'Sources',
      getValue: voie => tagsList(voie.sources),
      sortBy: 'alphabetical'
    }
  }

  return (
    <Section>
      <Head
        commune={commune}
        voie={voie}
        numero={numero ? numero.numero : null}
        suffixe={numero ? numero.suffixe : null} />
      <MapContainer
        voie={voie}
        addresses={voie.numeros}
        numero={numero}
        onSelect={(numero, suffixe) => handleSelect({numero, suffixe})} />
      <TableList
        title='Adresses de la voie'
        subtitle={voie.numerosCount === 1 ? `${voie.numerosCount} adresse répertoriée` : `${voie.numerosCount} adresses répertoriées`}
        textFilter={item => item.numero}
        filters={{sourcePosition: 'Sources'}}
        list={voie.numeros}
        cols={cols}
        handleSelect={handleSelect} />
    </Section>
  )
}

Voie.propTypes = {
  commune: PropTypes.object,
  voie: PropTypes.shape({
    nomVoie: PropTypes.string.isRequired,
    codeCommune: PropTypes.string.isRequired,
    nomCommune: PropTypes.string.isRequired,
    numeros: PropTypes.array.isRequired,
    numerosCount: PropTypes.number.isRequired,
    numero: PropTypes.number,
    sources: PropTypes.array
  }),
  numero: PropTypes.object
}

Voie.defaultProps = {
  commune: null,
  voie: null,
  numero: null
}

export default Voie
