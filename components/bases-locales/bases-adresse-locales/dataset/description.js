import React from 'react'
import PropTypes from 'prop-types'
import FaArrowRight from 'react-icons/lib/fa/arrow-right'

import Markdown from '../../../markdown'

class Description extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    page: PropTypes.string
  }

  static defaultProps = {
    page: null
  }

  render() {
    const {title, description, page} = this.props

    return (
      <div>
        <h3>{title}</h3>
        <div>
          <Markdown markdown={description} />
          {page &&
            <a className='dgv-link' href={page}><FaArrowRight style={{marginRight: '5px'}} /> Consulter ce jeu de données sur data.gouv.fr</a>
          }
        </div>
      </div>
    )
  }
}

export default Description
