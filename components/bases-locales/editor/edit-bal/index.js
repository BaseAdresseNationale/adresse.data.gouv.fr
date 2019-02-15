import React from 'react'
import PropTypes from 'prop-types'

import {getName, getStatus} from '../../../../lib/bal/item'
import {communeNumerosToGeoJson, communeVoiesToGeoJson} from '../../../../lib/geojson'

import CommuneVisualizer from '../../../commune-visualizer'

import SideMenu from './side-menu'
import Context from './context'

export const FormContext = React.createContext()

class EditBal extends React.PureComponent {
  state = {
    voie: null,
    numero: null
  }

  static propTypes = {
    model: PropTypes.object.isRequired,
    commune: PropTypes.shape({
      code: PropTypes.string.isRequired
    }).isRequired,
    exportControls: PropTypes.node.isRequired,
    codeVoie: PropTypes.string,
    idNumero: PropTypes.string,
    actions: PropTypes.object.isRequired
  }

  static defaultProps = {
    codeVoie: null,
    idNumero: null
  }

  async componentDidUpdate(prevProps) {
    const {codeVoie, idNumero} = this.props

    if (codeVoie !== prevProps.codeVoie || idNumero !== prevProps.idNumero) {
      await this.updateContext()
    }
  }

  updateContext = async () => {
    const {model, commune, codeVoie, idNumero} = this.props

    this.setState({
      voie: codeVoie ? await model.getVoie(commune.code, codeVoie) : null,
      numero: idNumero ? await model.getNumero(commune.code, codeVoie, idNumero) : null
    })
  }

  getContext = () => {
    const {voie, numero} = this.state
    const {commune, codeVoie, actions} = this.props
    const item = numero || voie || commune

    return {
      name: getName(item),
      status: getStatus(item),
      previous: () => actions.select(
        codeVoie ? commune.code : null,
        numero ? codeVoie : null
      )
    }
  }

  render() {
    const {voie, numero} = this.state
    const {commune, exportControls, actions} = this.props
    const context = this.getContext()
    const voies = communeVoiesToGeoJson(commune)
    const addresses = communeNumerosToGeoJson(commune)

    return (
      <div className='fullscreen-mode'>
        <SideMenu context={context} exportControls={exportControls}>
          <Context
            commune={commune}
            voie={voie}
            numero={numero}
            actions={actions}
          />
        </SideMenu>

        <div className='map'>
          <CommuneVisualizer
            context={context}
            commune={commune}
            voies={voies}
            numeros={addresses}
            voie={voie}
            numero={numero}
            actions={actions}
          />
        </div>

        <style jsx>{`
          .fullscreen-mode {
            display: flex;
            position: fixed;
            top: 74px;
            left: 0;
            bottom: 0;
            right: 0;
            background: #fff;
          }

          .map {
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

export default EditBal
