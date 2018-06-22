import React from 'react'
import PropTypes from 'prop-types'
import {deburr} from 'lodash'
import FaSearch from 'react-icons/lib/fa/search'

import theme from '../../../../../../styles/theme'

import CommunesList from './communes-list'

class Head extends React.Component {
  static propTypes = {
    communes: PropTypes.arrayOf(
      PropTypes.shape({
        nom: PropTypes.string.isRequired
      })
    ).isRequired
  }

  state = {
    input: '',
    filteredCommunes: null
  }

  handleChange = event => {
    const input = event.target.value
    const {communes} = this.props
    const filteredCommunes = communes.filter(commune => deburr(commune.nom.toLowerCase()).includes(input))

    this.setState({
      input,
      filteredCommunes
    })
  }

  render() {
    const {communes} = this.props
    const {input, filteredCommunes} = this.state
    const communesList = filteredCommunes || communes

    return (
      <div className='container'>
        <div className='search'>
          <input className='search' type='text' value={input} placeholder='Rechercher une commune' onChange={this.handleChange} />
          <span><FaSearch /></span>
        </div>
        <div className='table'>
          {communesList.length ?
            <CommunesList
              communes={communesList} /> :
            <div>Aucun résultat</div>}
        </div>
        <style jsx>{`
        input {
          margin: 1em 0;
        }

        .search {
          position: relative;
        }

        .search input {
          text-indent: 30px;
        }

        span {
          position: absolute;
          top: 30px;
          left: 1em;
          font-size: 15px;
          color: ${theme.colors.darkGrey};
        }
        `}</style>
      </div>
    )
  }
}

export default Head
