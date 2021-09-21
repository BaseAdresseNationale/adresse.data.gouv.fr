import PropTypes from 'prop-types'
import React from 'react'
import copy from 'copy-to-clipboard'

import theme from '../../../styles/theme'

import Code from '../code'

import Loader from '../../loader'
import InputExemple from './input-exemple'

class Result extends React.Component {
  static propTypes = {
    exemple: PropTypes.string.isRequired,
    results: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    isLoading: PropTypes.bool
  }

  static defaultProps = {
    isLoading: true,
    results: null
  }

  constructor(props) {
    super(props)
    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.handleDisplay = this.handleDisplay.bind(this)
  }

  copyToClipboard(value) {
    copy(value)
  }

  handleDisplay() {
    this.setState(state => ({
      raw: !state.raw
    }))
  }

  render() {
    const {exemple, results, isLoading} = this.props

    return (
      <div className='result-container'>
        <InputExemple value={exemple} copy={this.copyToClipboard} />
        {isLoading ?
          <div className='loading-pre'>
            <div className='loading-code'>
              <Loader />
            </div>
          </div> :
          <Code code={JSON.stringify(results, null, 2)} />}
        <style jsx>{`
          .result-container {
            display: flex;
            flex-direction: column;
          }

          .loading-pre {
            background: ${theme.colors.white};
            border: 1px solid ${theme.backgroundGrey};
            border-radius: 5px;
            width: 100%;
            padding: 1em;
            margin-bottom: 1em;
          }

          .loading-code {
            width: 100%;
            height: 360px;
            background: ${theme.backgroundGrey}
          }
        `}</style>
      </div>
    )
  }
}

export default Result
