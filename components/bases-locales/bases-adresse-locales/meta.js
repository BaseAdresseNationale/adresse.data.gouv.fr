import React, {Fragment} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import FaCheck from 'react-icons/lib/fa/check'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../styles/theme'

import Info from './info'

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
        <Info title='Format'>
          <span>BAL 1.1</span>
        </Info>

        <Info title='Licence'>
          <span>{license}</span>
        </Info>

        <Info title='Dernière mise à jour'>
          <span>{lastUpdate ? lastUpdate : 'inconnue'}</span>
        </Info>

        <Info title='Conformité' type={valid ? 'valid' : 'invalid'}>
          {valid ?
            <Fragment><FaCheck />{report}</Fragment> :
            <Fragment><FaClose />{report}</Fragment>
          }
        </Info>

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

          .error {
            text-color: ${theme.errorBg};
          }
          `}</style>
      </div>
    )
  }
}

export default Meta
