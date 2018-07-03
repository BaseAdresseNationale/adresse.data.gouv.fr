import React from 'react'
import PropTypes from 'prop-types'
import FaSearch from 'react-icons/lib/fa/search'

import theme from '../../../../styles/theme'

import Item from './item'

class Preview extends React.Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    filter: PropTypes.func.isRequired,
    toItem: PropTypes.func.isRequired
  }

  state = {
    input: '',
    filteredItems: null
  }

  handleChange = event => {
    const input = event.target.value
    const {list, filter} = this.props
    const filteredItems = list.filter(item => filter(item, input))

    this.setState({
      input,
      filteredItems
    })
  }

  render() {
    const {list, toItem} = this.props
    const {input, filteredItems} = this.state
    const items = filteredItems || list

    return (
      <div className='container'>
        <div className='search'>
          <input className='search' type='text' value={input} placeholder='Rechercher…' onChange={this.handleChange} />
          <span><FaSearch /></span>
        </div>

        <div className='table'>
          {items.length ?
            items.map(toItem) :
            <div>Aucun résultat</div>}
        </div>

        <style jsx>{`
          input {
            margin: 0.5em 0;
          }

          .search {
            position: relative;
          }

          .search input {
            text-indent: 22px;
          }

          span {
            position: absolute;
            top: 22px;
            left: 1em;
            font-size: 15px;
            color: ${theme.colors.darkGrey};
          }

          .table {
            width: 100;
            display: flex;
            flex-direction: column;
          }
        `}</style>
      </div>
    )
  }
}

export default Preview
