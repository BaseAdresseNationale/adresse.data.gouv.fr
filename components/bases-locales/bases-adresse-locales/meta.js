import React, {Fragment} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import FaCheck from 'react-icons/lib/fa/check'
import FaClose from 'react-icons/lib/fa/close'

import theme from '../../../styles/theme'

class Meta extends React.Component {
  render() {
    const {id, status, license, valid, error} = this.props

    return (
      <div className='content'>
        <div>
          <b>Format :</b>
          <span>BAL 1.1</span>
        </div>

        <div>
          <b>Licence :</b>
          <span>{license}</span>
        </div>

        <div>
          <b>Conformité :</b>
          {valid ?
            <span className='valid'><FaCheck /></span> :
            <Fragment>
              <span className='invalid'><FaClose /></span>
              {status === 'ok' ?
                <Link href={{
                  pathname: `/bases-locales/jeux-de-donnees/${id}/rapport-validation`,
                  asPath: `/bases-locales/jeux-de-donnees/${id}/rapport-validation`
                }}>
                  <a>Consulter le rapport</a>
                </Link> :
                <div className='error'>
                  <div>Le fichier n’a pas pu être analysé car :</div>
                  <div>{error}</div>
                </div>
              }
            </Fragment>
          }
        </div>
        <style jsx>{`
          .content {
            display: flex;
            flex-direction: column;
          }

          span {
            border-radius: 3.75em;
            background-color: ${theme.infoBg};
            color: ${theme.infoBorder};
            display: inline-block;
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

Meta.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.oneOf([
    'ok',
    'malformed'
  ]).isRequired,
  license: PropTypes.string.isRequired,
  error: PropTypes.string,
  valid: PropTypes.bool
}

export default Meta
