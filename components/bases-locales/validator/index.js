import {format} from 'url'
import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import React from 'react'
import PropTypes from 'prop-types'
import {validate} from '@etalab/bal'
import {withRouter} from 'next/router'

import {createBALValidationError} from '../../../lib/error'
import {getFileExtension, checkHeaders, statusCodeMsg} from '../../../lib/bal/file'

import Section from '../../section'
import Loader from '../../loader'

import Report from './report'
import FileHander from './file-handler'

class BALValidator extends React.Component {
  static propTypes = {
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      query: PropTypes.object.isRequired
    }).isRequired
  }

  state = {
    error: null,
    file: null,
    report: null,
    loading: false,
    inProgress: false
  }

  componentDidMount() {
    const {router} = this.props

    if (router.query.url) {
      this.handleInput(decodeURIComponent(router.query.url))
    }
  }

  handleError(error) {
    this.setState({error, file: null, report: null, url: null})
  }

  resetState() {
    this.setState({
      file: null,
      error: null,
      report: null,
      url: null,
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

  handleInput = async input => {
    if (input) {
      this.setState({loading: true, error: null, url: input})
      const url = 'https://adressedgv-cors.now.sh/' + input

      try {
        const response = await fetch(url)
        if (response.ok) {
          if (checkHeaders(response.headers)) {
            const file = await response.blob()
            this.setState({file, loading: false})
            this.parseFile()
          } else {
            throw createBALValidationError('Le fichier n’a pas été reconnu comme étant au format CSV')
          }
        } else if (response.status in statusCodeMsg) {
          throw createBALValidationError(`Impossible de récupérer le fichier car ${statusCodeMsg[response.status]}.`)
        } else {
          throw createBALValidationError('Impossible de récupérer le fichier car une erreur est survenue.')
        }
      } catch (err) {
        this.handleError(err)
      }
    } else {
      this.handleError(createBALValidationError('Le champ est vide.'))
    }

    this.setState({loading: false})
  }

  parseFile = () => {
    const {file} = this.state

    this.setState({inProgress: true})
    validate(file)
      .then(report => {
        report.rowsWithIssuesCount = report.rowsWithIssues.length
        this.setState({report, inProgress: false})
      })
      .then(() => {
        if (this.state.url) {
          this.pushEncodedUrl()
        }
      })
      .catch(err => this.setState({error: createBALValidationError(`Impossible d’analyser le fichier… [${err.message}]`), inProgress: false}))
  }

  pushEncodedUrl() {
    const {router} = this.props
    const query = {...router.query, url: encodeURI(this.state.url)}
    const url = format({pathname: '/bases-locales/validateur', query})
    this.props.router.push(url)
  }

  render() {
    const {router} = this.props
    const {error, file, report, inProgress, loading} = this.state

    return (
      <Section>
        <FileHander defaultValue={router.query.url} file={file} error={error} onFileDrop={this.handleFileDrop} onSubmit={this.handleInput} loading={loading} />
        {inProgress &&
        <div className='centered'>
          <h4>Analyse en cours…</h4>
          <Loader />
        </div>}

        {report &&
          <div style={{margin: '2em 0'}}>
            <Section title='Analyse terminée !' background='grey'>
              <Report report={report} />
            </Section>
          </div>
        }
        <style jsx>{`
          .centered {
            display: flex;
            align-items: center;
            justify-conten: center;
            flex-direction: column;
            margin: 1em 0 2em;
          }
        `}</style>
      </Section>
    )
  }
}

export default (withRouter(BALValidator))
