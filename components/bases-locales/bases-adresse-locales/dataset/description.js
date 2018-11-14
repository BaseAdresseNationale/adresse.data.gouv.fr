import React from 'react'
import PropTypes from 'prop-types'
import FaArrowRight from 'react-icons/lib/fa/arrow-right'

import Markdown from '../../../markdown'

class Description extends React.Component {
  static propTypes = {
    description: PropTypes.string.isRequired,
    page: PropTypes.string
  }

  static defaultProps = {
    page: null
  }

  render() {
    const {description, page} = this.props

    return (
      <div>
        <Markdown markdown={description} />
        {page &&
          <a className='dgv-link' href={page}><FaArrowRight style={{marginRight: '5px'}} /> Consulter ce jeu de données sur data.gouv.fr</a>
        }
      </div>
    )
  }
}

export default Description
