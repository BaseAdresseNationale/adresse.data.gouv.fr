import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import MdFileDownload from 'react-icons/lib/md/file-download'

import {contoursToGeoJson} from '../../../../lib/geojson'

import ButtonLink from '../../../button-link'
import LoadingContent from '../../../loading-content'

import ContourCommuneMap from './contour-commune-map'
import AdressesCommuneMap from './adresses-commune-map'
import Context from './context'
import Communes from './communes'

export const FormContext = React.createContext()

const getContour = communes => {
  if (Object.keys(communes).length > 0) {
    const geojson = contoursToGeoJson(Object.keys(communes).map(commune => communes[commune]))

    if (geojson.features.length > 0) {
      return geojson
    }
  }

  return null
}

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
        if (numero.positions.length > 0) {
          geojson.features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: numero.positions[0].coords
            },
            properties: {
              ...numero,
              codeCommune: commune.code,
              codeVoie: voie.codeVoie,
              source: numero.positions[0].source,
              type: numero.positions[0].type,
              lastUpdate: numero.positions[0].dateMAJ
            }
          })
        }
      })
    }
  })

  return geojson
}

class EditBal extends React.Component {
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

  render() {
    const {communes, commune, voie, numero, actions, downloadLink, filename, loading, error} = this.props
    const communesContours = communes ? getContour(communes) : null
    const addresses = commune ? getAddresses(commune) : null

    return (
      <div>

        {commune ? (
          <Fragment>
            {addresses && addresses.features.length > 0 && (
              <div className='map'>
                <AdressesCommuneMap
                  data={addresses}
                  selected={numero}
                  select={actions.select}
                />
              </div>
            )}

            <Context
              commune={commune}
              voie={voie}
              numero={numero}
              contour={communesContours || addresses}
              actions={actions}
            />
          </Fragment>
        ) : (
          <Fragment>
            {communesContours && communesContours.features.length > 0 && (
              <div className='map'>
                <ContourCommuneMap data={communesContours} select={actions.select} />
              </div>
            )}

            <Communes
              communes={communes}
              actions={actions}
            />
          </Fragment>
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
          .button {
            display: flex;
            justify-content: center;
          }

          .map {
            height: 600px;
            margin: 1em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default EditBal
