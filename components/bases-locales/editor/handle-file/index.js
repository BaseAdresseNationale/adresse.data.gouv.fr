// eslint-disable-next-line import/no-unassigned-import
import 'regenerator-runtime/runtime'
import React from 'react'
import PropTypes from 'prop-types'
import {validate, extractAsTree} from '@etalab/bal'
import FaClose from 'react-icons/lib/fa/close'

import detectEncoding from '../../../../lib/detect-encoding'
import {createBALValidationError} from '../../../../lib/error'

import theme from '../../../../styles/theme'

import Section from '../../../section'
import Loader from '../../../loader'

import Report from '../../validator/report'

import FileHander from './file-handler'

function getFileExtension(fileName) {
  const dotPosition = fileName.lastIndexOf('.')
  if (dotPosition > 0 && dotPosition < fileName.length - 1) {
    return fileName.substr(dotPosition + 1).toLowerCase()
  }
  return null
}

class Editor extends React.Component {
  state = {
    error: null,
    file: null,
    report: null,
    inProgress: false
  }

  static propTypes = {
    onData: PropTypes.func.isRequired
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

    return (
      <div>
        <FileHander file={file} error={error} onFileDrop={this.handleFileDrop} />

        {inProgress &&
          <div className='centered'>
            <h4>Analyse en cours…</h4>
            <Loader />
          </div>}

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
        `}</style>
      </div>
    )
  }
}

export default Editor
