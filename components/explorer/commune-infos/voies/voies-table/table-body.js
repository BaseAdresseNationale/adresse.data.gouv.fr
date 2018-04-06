import React from 'react'
import PropTypes from 'prop-types'
import Router, {withRouter} from 'next/router'

import theme from '../../../../../styles/theme'

class TableBody extends React.Component {
  render() {
    const {voies, router} = this.props
    return (
      <tbody>
        {voies.map(voie => (
          <tr
            key={voie.idVoie}
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
          `}</style>
      </tbody>
    )
  }
}

TableBody.propTypes = {
  voies: PropTypes.array.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  }).isRequired
}

export default (withRouter(TableBody))
