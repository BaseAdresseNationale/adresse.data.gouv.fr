import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'
import FaAngleRight from 'react-icons/lib/fa/angle-right'

import theme from '../../../../../../styles/theme'

class CommunesList extends React.Component {
  static propTypes = {
    communes: PropTypes.arrayOf(
      PropTypes.shape({
        nom: PropTypes.string.isRequired,
        population: PropTypes.number
      })
    ).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      query: PropTypes.object.isRequired
    }).isRequired
  }

  communeLink = codeCommune => {
    const {router} = this.props
    router.push(`/bases-locales/jeux-de-donnees/${router.query.id}/${codeCommune}`)
  }

  render() {
    const {communes} = this.props

    return (
      <div className='container'>
        {communes.map(commune => (
          <div key={commune.nom} className='commune' onClick={() => this.communeLink(commune.code)}>
            <div className='infos'>
              <div className='name'><b>{commune.nom}</b></div>
              {commune.population ? (
                <div><b>{commune.population}</b> habitants</div>
                ) : (
                  <div>Population inconnue</div>
                )}
            </div>
            <div className='link'><FaAngleRight /></div>
          </div>
          ))}

        <style jsx>{`
          .container {
            width: 100;
            display: flex;
            flex-direction: column;
          }

          .commune {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid ${theme.border};
            padding: 1em;
            margin: 0.2em 0;
          }

          .infos {
            display: flex;
            flex-grow: 1;
            justify-content: space-between;
          }

          .name {
            font-size: 18px;
          }

          .commune:hover {
            cursor: pointer;
            color: ${theme.colors.white};
            background-color: ${theme.primary};
          }

          .link {
            display: none;
          }

          @media (max-width: 580px) {
            .commune {
              flex-direction: column;
              aling-items: center;
              flex-flow: wrap;
            }

            .infos {
              flex-direction: column;
            }


            .name {
              font-size: initial;
            }

            .link {
              display: block;
              margin: 1em;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default withRouter(CommunesList)
