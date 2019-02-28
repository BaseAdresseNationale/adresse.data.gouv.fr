import React from 'react'
import PropTypes from 'prop-types'
import MdFileDownload from 'react-icons/lib/md/file-download'

import ButtonLink from '../../../button-link'
import LoadingContent from '../../../loading-content'

import Context from './context'
import Communes from './communes'

export const FormContext = React.createContext()

class EditBal extends React.PureComponent {
  state = {
    communes: null
  }

  static propTypes = {
    model: PropTypes.object.isRequired,
    codeCommune: PropTypes.string,
    codeVoie: PropTypes.string,
    idNumero: PropTypes.string,
    downloadLink: PropTypes.string,
    filename: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    actions: PropTypes.object.isRequired
  }

  static defaultProps = {
    codeCommune: null,
    codeVoie: null,
    idNumero: null,
    filename: null,
    loading: false,
    downloadLink: null,
    error: null
  }

  async componentDidMount() {
    const {model} = this.props

    this.setState({
      communes: await model.getCommunes()
    })

    this.updateContext()
  }

  async componentDidUpdate(prevProps) {
    const {codeCommune, codeVoie, idNumero} = this.props

    if (codeCommune !== prevProps.codeCommune ||
      codeVoie !== prevProps.codeVoie ||
      idNumero !== prevProps.idNumero
    ) {
      await this.updateContext()
    }
  }

  updateContext = async () => {
    const {model, codeCommune, codeVoie, idNumero} = this.props

    this.setState({
      commune: codeCommune ? await model.getCommune(codeCommune) : null,
      voie: codeVoie ? await model.getVoie(codeCommune, codeVoie) : null,
      numero: idNumero ? await model.getNumero(codeCommune, codeVoie, idNumero) : null
    })
  }

  render() {
    const {communes, commune, voie, numero} = this.state
    const {actions, downloadLink, filename, loading, error} = this.props

    return (
      <div>

        {commune ? (
          <Context
            context={numero || voie || commune}
            commune={commune}
            voie={voie}
            numero={numero}
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
        `}</style>
      </div>
    )
  }
}

export default EditBal
