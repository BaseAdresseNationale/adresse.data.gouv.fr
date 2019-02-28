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
    exportControls: PropTypes.node.isRequired,
    codeCommune: PropTypes.string.isRequired,
    codeVoie: PropTypes.string,
    idNumero: PropTypes.string,
    actions: PropTypes.object.isRequired
  }

  static defaultProps = {
    codeVoie: null,
    idNumero: null
  }

  async componentDidMount() {
    const {model, codeCommune} = this.props
    const commune = await model.getCommune(codeCommune)

    this.setState({commune})
  }

  async componentDidUpdate(prevProps) {
    const {codeVoie, idNumero} = this.props

    if (codeVoie !== prevProps.codeVoie || idNumero !== prevProps.idNumero) {
      await this.updateContext()
    }
  }

  updateContext = async () => {
    const {model, codeCommune, codeVoie, idNumero} = this.props

    this.setState({
      voie: codeVoie ? await model.getVoie(codeCommune, codeVoie) : null,
      numero: idNumero ? await model.getNumero(codeCommune, codeVoie, idNumero) : null
    })
  }

  getContext = () => {
    const {commune, voie, numero} = this.state
    const {codeCommune, codeVoie, actions} = this.props
    const item = numero || voie || commune

    return {
      name: getName(item),
      status: getStatus(item),
      previous: () => actions.select(
        codeVoie ? codeCommune : null,
        numero ? codeVoie : null
      )
    }
  }

  render() {
    const {commune, voie, numero} = this.state
    const {exportControls, actions} = this.props

    if (!commune) {
      return null
    }

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
