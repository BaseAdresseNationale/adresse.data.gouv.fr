import React from 'react'
import PropTypes from 'prop-types'
import MdFileDownload from 'react-icons/lib/md/file-download'

import Button from '../../../button'
import ButtonLink from '../../../button-link'

import LoadingContent from '../../../loading-content'
import Context from './context'
import Communes from './communes'

export const FormContext = React.createContext()

const getType = item => {
  if (item.code) {
    return 'commune'
  }

  if (item.nomVoie) {
    return 'voie'
  }

  return 'numero'
}

class EditBal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      communes: null,
      commune: null,
      voie: null,
      numero: null
    }
  }

  static propTypes = {
    model: PropTypes.object.isRequired,
    downloadLink: PropTypes.string,
    filename: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    exportBAL: PropTypes.func.isRequired
  }

  static defaultProps = {
    filename: null,
    loading: false,
    downloadLink: null,
    error: null
  }

  componentDidMount = async () => {
    const {communes} = this.state

    if (!communes) {
      const communes = await this.props.model.getCommunes()
      this.setState({communes})
    }
  }

  addItem = async item => {
    const type = getType(item)
    const types = {
      commune: this.addCommune,
      voie: this.addVoie,
      numero: this.addNumero
    }

    await types[type](item)
  }

  addCommune = async newCommune => {
    await this.props.model.createCommune(newCommune.code, newCommune)
  }

  addVoie = async newVoie => {
    const {commune} = this.state
    await this.props.model.createVoie(commune.code, newVoie)
  }

  addNumero = async newNumero => {
    const {commune, voie} = this.state
    await this.props.model.createNumero(commune.code, voie.codeVoie, newNumero)
  }

  renameVoie = async (item, newName) => {
    const {commune} = this.state
    await this.props.model.renameVoie(commune.code, item.codeVoie, newName)
  }

  deleteItem = async item => {
    const {commune, voie} = this.state
    const type = getType(item)

    if (type === 'commune') {
      await this.props.model.deleteCommune(item.code)
    } else if (type === 'voie') {
      await this.props.model.deleteVoie(commune.code, item.codeVoie)
    } else {
      await this.props.model.deleteNumero(commune.code, voie.codeVoie, item.numeroComplet)
    }
  }

  cancelChange = async item => {
    const {commune, voie} = this.state
    const type = getType(item)

    if (type === 'commune') {
      await this.props.model.cancelCommuneChange(item.code)
    } else if (type === 'voie') {
      await this.props.model.cancelVoieChange(commune.code, item.codeVoie)
    } else {
      await this.props.model.cancelNumeroChange(commune.code, voie.codeVoie, item.numeroComplet)
    }
  }

  select = async (codeCommune, codeVoie, numeroComplet) => {
    const commune = await this.props.model.getCommune(codeCommune)
    const voie = await this.props.model.getVoie(codeCommune, codeVoie)
    const numero = await this.props.model.getNumero(codeCommune, codeVoie, numeroComplet)

    this.setState({
      commune,
      voie,
      numero
    })
  }

  render() {
    const {communes, commune, voie, numero} = this.state
    const {exportBAL, downloadLink, filename, loading, error} = this.props
    const actions = {
      select: this.select,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      renameVoie: this.renameVoie,
      cancelChange: this.cancelChange
    }

    return (
      <div>
        <FormContext.Provider value={{commune, voie, numero, actions}}>
          {commune ? (
            <Context
              commune={commune}
              voie={voie}
              numero={numero}
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

          <Button onClick={() => exportBAL(this.props.model)}>Exporter le fichier BAL</Button>
        </FormContext.Provider>

        <style jsx>{`
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
