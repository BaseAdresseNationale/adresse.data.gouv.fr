import PropTypes from 'prop-types'

import theme from '../../../../styles/theme'

import Code from '../code'

function ParamsTable({label, params}) {
  return (
    <div className='params-table-container'>
      {label && <label>{label}</label>}
      <table>
        <tbody>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Type</th>
            {params.find(arg => arg.model) && <th>Modèle</th>}
          </tr>
        </tbody>
        {params.map(param => (
          <tbody key={`nom-${param.name}`}>
            <tr>
              <td>{param.name}</td>
              <td>{param.description}</td>
              <td>{param.type}</td>
              {param.model &&
                <td>
                  <Code code={JSON.stringify(param.model, null, 2)} />
                </td>}
            </tr>

            {param.data &&
              <tr>
                <td>
                  <table>
                    <tbody>
                      <tr>
                        {param.data.map(data =>
                          <td key={`list-${data}`} className='data'>{data}</td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>}

            {param.subs && param.subs.map(sub => (
              <tr key={`sub-${param.name}-${sub.name}`} className='sub'>
                <td>{sub.name}</td>
                <td>{sub.description}</td>
                <td>{sub.type}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
      <style jsx>{`
        .params-table-container {
          padding: 0.5em;
          background: ${theme.colors.white};
          border-radius: 3px;
          color: ${theme.darkText};
          margin: 0.5em 0;
        }

        table {
          text-align: left;
          width: 100%;
        }

        table tr:nth-child(odd) td {
          background-color: ${theme.colors.lighterGrey};
        }

        table td {
          padding: 0.5em;
        }

        tr.sub > td:nth-child(1) {
          text-align: right;
        }

        tr.sub td {
          background-color: whitesmoke !important;
        }

        .data {
          background-color: ${theme.colors.lighterBlue} !important;
        }

        @media (max-width: 768px) {
          table {
            display: block;
            overflow: scroll;
          }
        }

        `}</style>
    </div>
  )
}

ParamsTable.defaultProps = {
  label: null
}

ParamsTable.propTypes = {
  label: PropTypes.string,
  params: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      type: PropTypes.string,
      model: PropTypes.object,
      data: PropTypes.array
    })
  ).isRequired
}

export default ParamsTable
