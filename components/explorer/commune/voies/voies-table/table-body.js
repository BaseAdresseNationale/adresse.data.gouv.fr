import React from 'react'
import PropTypes from 'prop-types'
import Router, {withRouter} from 'next/router'

import theme from '../../../../../styles/theme'

class TableBody extends React.Component {
  render() {
    const {voies, wrapped, router} = this.props

    return (
      <tbody>
        {voies.map((voie, idx) => (
          <tr
            key={voie.idVoie}
            className={wrapped && idx === 8 ? 'fade-out' : ''}
            onClick={() =>
              Router.push(
                `/commune/voie?codeVoie=${voie.codeVoie}`,
                `/explore/commune/${router.query.codeCommune}/voies/${voie.codeVoie}`)}>
            <td>{voie.nomsVoie[0]}</td>
            <td>{voie.nbNumeros}</td>
            <td>{voie.sources.map((source, idx) => `${source}${idx + 1 < voie.sources.length ? ', ' : ''}`)}</td>
          </tr>
        ))}
        <style jsx>{`
          td {
            border: 1px solid ${theme.border};
            padding: 8px;
          }

          tr:nth-child(even) {
            background-color: ${theme.backgroundGrey};
          }

          tr:hover {
            cursor: pointer;
            background-color: ${theme.colors.lightGrey};
          }

          tr.fade-out {
            opacity: 0.6;
          }

          tr.fade-out td {
            border: 1px dotted ${theme.border};
          }
          `}</style>
      </tbody>
    )
  }
}

TableBody.propTypes = {
  voies: PropTypes.array.isRequired,
  wrapped: PropTypes.bool,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  }).isRequired
}

TableBody.defaultProps = {
  wrapped: false
}

export default (withRouter(TableBody))
