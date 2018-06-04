import React from 'react'
import PropTypes from 'prop-types'
import FaTimesCircle from 'react-icons/lib/fa/times-circle'

import {_get} from '../../../lib/fetch'

import theme from '../../../styles/theme'

import Button from '../../button'
import LoadingContent from '../../loading-content'

import BalReport from './bal-report'

class Dataset extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      displayReport: Boolean(props.report),
      stateReport: null,
      loading: false,
      error: null
    }

    this.getReport = this.getReport.bind(this)
    this.handleReport = this.handleReport.bind(this)
  }

  async handleReport() {
    const {report} = this.props
    const {stateReport} = this.state

    this.setState(state => {
      return {
        displayReport: !state.displayReport
      }
    })

    if (!report && !stateReport) {
      await this.getReport()
    }
  }

  async getReport() {
    const {report, datasetId} = this.props
    let stateReport = null
    let error = null

    if (!report) {
      this.setState({loading: true})

      try {
        stateReport = await _get(`https://adresse.data.gouv.fr/api-bal/datasets/${datasetId}/report`)
      } catch (err) {
        error = err
      }
    }

    this.setState({
      stateReport,
      error,
      loading: false
    })
  }

  render() {
    const {stateReport, displayReport, loading, error} = this.state
    const report = this.props.report || stateReport

    return (
      <div>
        {(!displayReport || error) &&
          <div className='centered'>
            <Button onClick={this.handleReport}>Afficher le rapport</Button>
          </div>}

        {(displayReport || loading) &&
          <LoadingContent loading={loading} error={error} centered>
            <div className='report'>
              <div className='close' onClick={this.handleReport}><FaTimesCircle size={32} /></div>
              <BalReport report={report} />
            </div>
          </LoadingContent>}

        <style jsx>{`
          .centered {
            display: flex;
            justify-content: center;
          }

          .report {
            border-top: 1px solid ${theme.border};
          }

          .close {
            position: absolute;
            right: 0;
            margin: 1.3em;
          }

          .close:hover {
            color: ${theme.primary};
            cursor: pointer;
          }
          `}</style>
      </div>
    )
  }
}

Dataset.propTypes = {
  report: PropTypes.object,
  datasetId: PropTypes.string.isRequired
}

Dataset.defaultProps = {
  report: null
}

export default Dataset
