import React from 'react'
import PropTypes from 'prop-types'
import MdFileDownload from 'react-icons/lib/md/file-download'

import ButtonLink from '../../../button-link'
import LoadingContent from '../../../loading-content'

import Context from './context'
import Communes from './communes'

export const FormContext = React.createContext()

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
