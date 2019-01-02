import React from 'react'
import PropTypes from 'prop-types'
import FaTable from 'react-icons/lib/fa/table'
import FaMapO from 'react-icons/lib/fa/map-o'
import MdFileDownload from 'react-icons/lib/md/file-download'

import theme from '../../../../styles/theme'

import ButtonLink from '../../../button-link'
import LoadingContent from '../../../loading-content'

import TableMode from './table-mode'
import MapMode from './map-mode'
import Communes from './communes'

export const FormContext = React.createContext()

const getAddresses = commune => {
  const geojson = {
    type: 'FeatureCollection',
    features: []
  }

  Object.keys(commune.voies).forEach(voieIdx => {
    const voie = commune.voies[voieIdx]
    if (voie.numeros) {
      Object.keys(voie.numeros).forEach(numeroIdx => {
        const numero = commune.voies[voieIdx].numeros[numeroIdx]
        const positions = numero.edited ? numero.modified.positions : numero.positions

        if (positions.length > 0) {
          geojson.features.push({
            type: 'Feature',
            id: `${voie.codeVoie}-${numero.id}`,
            geometry: {
              type: 'Point',
              coordinates: positions[0].coords
            },
            properties: {
              ...numero,
              codeCommune: commune.code,
              codeVoie: voie.codeVoie,
              nomVoie: voie.nomVoie,
              source: positions[0].source,
              type: positions[0].type,
              lastUpdate: positions[0].dateMAJ
            }
          })
        }
      })
    }
  })

  return geojson.features.length > 0 ? geojson : null
}

class EditBal extends React.Component {
  state = {
    mode: 'table'
  }

  static propTypes = {
    communes: PropTypes.object,
    commune: PropTypes.object,
    voie: PropTypes.object,
    numero: PropTypes.object,
    downloadLink: PropTypes.string,
    filename: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    actions: PropTypes.object.isRequired
  }

  static defaultProps = {
    communes: null,
    commune: null,
    voie: null,
    numero: null,
    filename: null,
    loading: false,
    downloadLink: null,
    error: null
  }

  toggleDisplay = toDisplay => {
    this.setState({
      mode: toDisplay
    })
  }

  render() {
    const {mode} = this.state
    const {communes, commune, voie, numero, actions, downloadLink, filename, loading, error} = this.props
    const addresses = commune ? getAddresses(commune) : null

    return (
      <div>
        {commune ? (
          <div>

            {addresses && (
              <div className='tabs'>
                <div
                  className={`tab ${mode === 'table' ? 'active' : ''}`}
                  onClick={() => this.toggleDisplay('table')}
                >
                  Tableau <FaTable />
                </div>

                <div
                  className={`tab ${mode === 'map' ? 'active' : ''}`}
                  onClick={() => this.toggleDisplay('map')}
                >
                  Carte <FaMapO />
                </div>
              </div>
            )}

            {mode === 'table' ? (
              <TableMode
                commune={commune}
                voie={voie}
                numero={numero}
                addresses={addresses}
                actions={actions}
              />
            ) : (
              <MapMode
                addresses={addresses}
                actions={actions}
              />
            )}
          </div>
        ) : (
          <Communes communes={communes} actions={actions} />
        )}

        <LoadingContent loading={loading} error={error} centered>
          <div className='button'>
            {downloadLink && filename && (
              <ButtonLink href={downloadLink} download={filename}>
              Télécharger <MdFileDownload />
              </ButtonLink>
            )}
          </div>
        </LoadingContent>

        <style jsx>{`
          .tabs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-column-gap: 1em;
          }

          .tab {
            text-align: center;
            width: 100%;
            padding: 1em;
            border: 1px solid ${theme.border};
          }

          .tab.active {
            color: ${theme.primary};
            border: 1px solid ${theme.primaryLight};
          }

          .tab:hover {
            cursor: pointer;
            color: #fff;
            background: ${theme.primaryLight};
          }

          .button {
            display: flex;
            justify-content: center;
          }
        `}</style>
      </div>
    )
  }
}

export default EditBal
