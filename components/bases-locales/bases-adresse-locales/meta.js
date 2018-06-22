import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import FaCheck from 'react-icons/lib/fa/check'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../styles/theme'

class Meta extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    status: PropTypes.oneOf([
      'ok',
      'malformed'
    ]).isRequired,
    license: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string,
    error: PropTypes.string,
    valid: PropTypes.bool,
    column: PropTypes.bool
  }

  static defaultProps = {
    column: false
  }

  render() {
    const {id, status, license, lastUpdate, valid, error, column} = this.props
    const report = (
      <div style={{marginLeft: '0.2em'}}>
        {status === 'ok' ?
          <Link href={{
            pathname: `/bases-locales/jeux-de-donnees/${id}`,
            asPath: `bases-locales/jeux-de-donnees/${id}`,
            query: {report: true}
          }}>
            <a>Consulter le rapport</a>
          </Link> :
          <div className='error'>
            <div>Le fichier n’a pas pu être analysé car :</div>
            <div>{error}</div>
          </div>
        }
      </div>
    )

    return (
      <div className={`content ${column ? 'column' : ''}`}>
        <div className='info'>
          <b>Format :</b>
          <span>BAL 1.1</span>
        </div>

        <div className='info'>
          <b>Licence :</b>
          <span>{license}</span>
        </div>

        <div className='info'>
          <b>Dernière date de mise à jour :</b>
          <span>{lastUpdate ? lastUpdate : 'inconnue'}</span>
        </div>

        <div className='info'>
          <b>Conformité :</b>
          {valid ?
            <span className='valid'><FaCheck />{report}</span> :
            <span className='invalid'><FaClose />{report}</span>
          }

        </div>
        <style jsx>{`
          .content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-flow: wrap;
          }

          .column {
            flex-direction: column;
            align-items: start;
          }

          .info {
            margin 0.5em 0;
          }

          .column .info {
            margin 0;
          }

          span {
            display: inline-flex;
            border-radius: 3.75em;
            background-color: ${theme.infoBg};
            color: ${theme.infoBorder};
            font-size: .75em;
            line-height: 1;
            padding: .4em 1.2em;
            margin: .1em .5em
          }

          span.valid {
            padding: .4em .5em;
            background-color: ${theme.successBg};
            color: ${theme.successBorder};
          }

          span.invalid {
            padding: .4em .5em;
            background-color: ${theme.errorBg};
            color: ${theme.errorBorder};
          }

          .error {
            text-color: ${theme.errorBg};
          }
          `}</style>
      </div>
    )
  }
}

export default Meta
