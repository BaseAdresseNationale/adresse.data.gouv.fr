// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime'
import React from 'react'
import PropTypes from 'prop-types'
import {validate, extractAsTree} from '@etalab/bal'
import FaClose from 'react-icons/lib/fa/close'
import FaPencil from 'react-icons/lib/fa/pencil'

import detectEncoding from '../../../lib/detect-encoding'
import {createBALValidationError} from '../../../lib/error'

import theme from '../../../styles/theme'

import Button from '../../button'
import Section from '../../section'
import Loader from '../../loader'
import Holder from '../../csv/holder'
import Notification from '../../notification'

import Report from '../validator/report'

function getFileExtension(fileName) {
  const dotPosition = fileName.lastIndexOf('.')
  if (dotPosition > 0 && dotPosition < fileName.length - 1) {
    return fileName.substr(dotPosition + 1).toLowerCase()
  }
  return null
}

class Uploader extends React.Component {
  state = {
    error: null,
    file: null,
    report: null,
    inProgress: false
  }

  static propTypes = {
    onData: PropTypes.func.isRequired,
    newFile: PropTypes.func.isRequired
  }

  handleError = error => {
    this.setState({error, file: null, report: null})
  }

  resetState() {
    this.setState({
      file: null,
      error: null,
      report: null,
      inProgress: false
    })
  }

  handleFileDrop = fileList => {
    const file = fileList[0] // Keep only the first file
    const fileExtension = getFileExtension(file.name)

    this.resetState()

    if (!fileExtension || fileExtension !== 'csv') {
      this.handleError(createBALValidationError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier *.csv.'))
    } else if (file.size > 100 * 1024 * 1024) {
      this.handleError(createBALValidationError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 100 Mo.'))
    } else {
      this.setState({
        file,
        error: null
      }, this.parseFile)
    }
  }

  parseFile = async () => {
    const {onData} = this.props
    const {file} = this.state
    let tree = null
    let report = null
    let error = null
    const inProgress = true

    this.setState({inProgress})

    try {
      report = await validate(file)
      tree = extractAsTree(report.normalizedRows, true)
    } catch (err) {
      error = createBALValidationError(`Impossible d’analyser le fichier… [${err.message}]`)
    }

    try {
      detectEncoding(file)
    } catch (err) {
      tree = null
      error = 'Impossible de lire ce fichier.'
    }

    this.setState({report, error, inProgress: false})

    if (tree) {
      onData(tree)
    }
  }

  render() {
    const {error, file, report, inProgress} = this.state
    const {newFile} = this.props

    return (
      <div>
        <Section>
          <div>
            <h2>Choisir un fichier</h2>
            <div className='container'>
              <Holder placeholder='Sélectionner ou glisser ici votre fichier BAL au format CSV (maximum 100 Mo)' file={file} onDrop={this.handleFileDrop} />
            </div>
            {error && <Notification style={{marginTop: '1em'}} message={error} type='error' />}
          </div>
        </Section>

        {inProgress ? (
          <div className='centered'>
            <h4>Analyse en cours…</h4>
            <Loader />
          </div>
        ) : (
          <div>
            <h2>Ou</h2>
            <Button onClick={newFile}>Créer un fichier <FaPencil /></Button>
          </div>
        )}

        {report && !report.isValid && !error && (
          <div>
            <div className='report-header'>
              <h2>Le fichier n’est pas conforme <span><FaClose /></span></h2>
              <h3>Voici le rapport d’erreurs présentent dans le fichier</h3>
            </div>
            <Section background='grey'>
              <Report report={report} />
            </Section>
          </div>
        )}

        <style jsx>{`
          .centered {
            display: flex;
            align-items: center;
            justify-conten: center;
            flex-direction: column;
            margin: 1em 0 2em;
          }

          .report-header {
            display: flex;
            flex-direction: column;
            text-align: center;
            background: ${theme.colors.white};
          }

          .report-header h2 {
            display: inline-flex;
            color: ${theme.errorBorder};
            margin: 0 auto;
          }

          .report-header h2 span {
            display: inline-flex;
            background-color: ${theme.errorBg};
            color: ${theme.errorBorder};
            border-radius: 100%;
            padding: 5px;
            margin-left: 1em;
          }

          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
        `}</style>
      </div>
    )
  }
}

export default Uploader
