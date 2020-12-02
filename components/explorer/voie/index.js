import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import Section from '@/components/section'

import TableList from '@/components/table-list'
import Tag from '@/components/tag'

import Head from './head'
import MapContainer from './map-container'
import SourcesTable from '@/components/sources-table'

const Voie = ({commune, voie, numero}) => {
  const handleSelect = ({numero, suffixe}) => {
    const {codeCommune, idVoie} = Router.query

    Router.push(`/explore/commune/${codeCommune}/voie/${idVoie}${numero ? `/numero/${numero}${suffixe || ''}` : ''}`)
  }

  const checkIsSelected = item => {
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
      getValue: data => data.typePosition || data.positionType || 'inconnu'
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
        <SourcesTable
          data={voie.nomsVoie}
          checkIsHighlighted={item => item.source === voie.sourceNomVoie}
          cols={colsSourcesVoie}
          title='Origine du nom de la voie'
          getId={item => item.source}
        />
        {numero && (
          <SourcesTable
            data={numero.adressesOriginales}
            checkIsHighlighted={item => item.source === numero.sourcePosition}
            cols={colsSourcesNumero}
            title='Origine de la position'
            getId={item => item.idPosition}
          />
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
        checkIsSelected={checkIsSelected}
        handleSelect={handleSelect} />
      <style jsx>{`
        .source-container {
          display: flex;
          flex: 1;
        }
        @media (max-width: 800px) {
        .source-container {
          flex-direction: column;
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
    sources: PropTypes.array,
    sourceNomVoie: PropTypes.string,
    nomsVoie: PropTypes.array
  }),
  numero: PropTypes.object
}

Voie.defaultProps = {
  commune: null,
  voie: null,
  numero: null
}

export default Voie
