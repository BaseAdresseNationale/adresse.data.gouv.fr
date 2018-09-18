import React from 'react'
import PropTypes from 'prop-types'
import MdFileDownload from 'react-icons/lib/md/file-download'

import {contoursToGeoJson} from '../../../../lib/geojson'

import ButtonLink from '../../../button-link'
import LoadingContent from '../../../loading-content'

import ContourCommuneMap from './contour-commune-map'
import Context from './context'
import Communes from './communes'

export const FormContext = React.createContext()

const getContour = communes => {
  if (communes && Object.keys(communes).length > 0) {
    const geojson = contoursToGeoJson(Object.keys(communes).map(commune => communes[commune]))

    if (geojson.features.length > 0) {
      return geojson
    }
  }

  return null
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
    const contour = getContour(communes)

    return (
      <div>
        {contour && contour.features.length > 0 && (
          <div className='map'>
            <ContourCommuneMap data={contour} select={actions.select} />
          </div>
        )}

        {commune ? (
          <Context
            commune={commune}
            voie={voie}
            numero={numero}
            contour={contour}
            actions={actions}
          />
        ) : (
          <Communes
            communes={communes}
            actions={actions}
          />
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
