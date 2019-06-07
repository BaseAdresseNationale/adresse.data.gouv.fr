import React from 'react'
import PropTypes from 'prop-types'
import MdFileDownload from 'react-icons/lib/md/file-download'

import theme from '../../../../styles/theme'

import Button from '../../../button'
import ButtonLink from '../../../button-link'
import LoadingContent from '../../../loading-content'

class ExportControls extends React.Component {
  static propTypes = {
    downloadLink: PropTypes.string,
    filename: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.instanceOf(Error),
    exportBAL: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  }

  static defaultProps = {
    filename: null,
    loading: false,
    downloadLink: null,
    error: null
  }

  render() {
    const {loading, error, downloadLink, filename, exportBAL, reset} = this.props
    return (
      <div className='export-controls'>
        <div className='buttons'>
          <Button onClick={exportBAL}>Enregistrer les changements</Button>
          <Button color='warning' size='small' onClick={reset}>Annuler et quitter</Button>
        </div>

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
          .export-controls {
            display: flex;
            flex-direction: column;
            padding: 1em;
            align-items: center;
            background: ${theme.backgroundGrey};
          }

          .buttons {
            display: grid;
            grid-row-gap: 1em;
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

export default ExportControls
