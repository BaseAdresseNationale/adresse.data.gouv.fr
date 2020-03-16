import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import Section from '../../section'
import {Check} from 'react-feather'

import TableList from '../../table-list'
import Tag from '../../tag'

import Head from './head'
import MapContainer from './map-container'
import SourcesVoie from './sources-voie'
import SourcePosition from './source-position'
import Sources from './sources'

const Voie = ({commune, voie, numero}) => {
  const handleSelect = ({numero, suffixe}) => {
    const {codeCommune, idVoie} = Router.query
    const href = `/explore/commune/voie?codeCommune=${codeCommune}&idVoie=${idVoie}${numero ? `&numero=${numero}${suffixe || ''}` : ''}`
    const as = `/explore/commune/${codeCommune}/voie/${idVoie}${numero ? `/numero/${numero}${suffixe || ''}` : ''}`

    Router.push(href, as)
  }

  const isSelected = item => {
    if (numero) {
      return item.cleInterop === numero.cleInterop
    }

    return null
  }

  const cols = {
    numero: {
      title: 'Numéro',
      getValue: voie => voie.numero + (voie.suffixe ? voie.suffixe : ''),
      sortBy: 'numeric'
    },
    sources: {
      title: 'Sources',
      getValue: ({sources}) => sources.map(source => (
        <Tag key={source} type={source} style={{display: 'inline-flex'}} />
      )),
      sortBy: 'alphabetical'
    }
  }

  const {nomsVoie, sourceNomVoie} = voie

  const dataVoie = nomsVoie.map(data => {
    const r = {...data, isChecked: false}
    if (data.source === sourceNomVoie) {
      r.isChecked = true
      return r
    }

    return r
  })

  const colsSourcesVoie = {
    nomVoie: {
      title: 'Libellé',
      getValue: data => data.nomVoie
    },
    source: {
      title: 'Source',
      getValue: data => <Tag key={data.source} type={data.source} style={{display: 'inline-flex'}} />
    },
    count: {
      title: 'Nombre d’occurence',
      getValue: data => data.count
    }
  }

  const colsSourcesNumero = {
    source: {
      title: 'Source',
      getValue: data => <Tag key={data.source} type={data.source} style={{display: 'inline-flex'}} />
    },
    position: {
      title: 'Type de position',
      getValue: data => data.typePosition || data.positionType
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
      <div className='source-container'>
        <Sources data={dataVoie} cols={colsSourcesVoie} title='Origine du nom de la voie' />
        {/* <SourcesVoie voie={voie} /> */}
        {numero && (
          <>
          <Sources data={numero.adressesOriginales} cols={colsSourcesNumero} title='Origine de la position' />
          {/* <SourcePosition numero={numero} /> */}
          </>
        )}
      </div>
      {numero ? (
        <div style={{textAlign: 'center', paddingBottom: '15px'}}><i>Les tableaux ci-dessus listent tous les libellés et positions rencontrés dans les différentes sources ayant permis de produire le fichier Adresses, ainsi que le nombre d’occurences. Le libellé retenu par l’algorithme est indiqué en vert.</i></div>
      ) : (
        <div style={{textAlign: 'center', paddingBottom: '15px'}}><i>Le tableau ci-dessus liste tous les libellés rencontrés dans les différentes sources ayant permis de produire le fichier Adresses, ainsi que le nombre d’occurences. Le libellé retenu par l’algorithme est indiqué en vert.</i></div>
      )}
      <TableList
        title='Adresses de la voie'
        subtitle={voie.numerosCount === 1 ? `${voie.numerosCount} adresse répertoriée` : `${voie.numerosCount} adresses répertoriées`}
        textFilter={item => item.numero}
        filters={{sources: 'Sources'}}
        list={voie.numeros}
        cols={cols}
        isSelected={isSelected}
        handleSelect={handleSelect} />
      <style jsx>{`
        .source-container {
          display: inline-flex;
          width: 100%;
        }
      `}</style>
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
    suffixe: PropTypes.string,
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
