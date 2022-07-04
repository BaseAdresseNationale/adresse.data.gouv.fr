import React from 'react'
import PropTypes from 'prop-types'
import {ArrowRight} from 'react-feather'

import Markdown from '@/components/markdown'

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
          <a className='dgv-link' href={page}><ArrowRight style={{marginRight: '5px', verticalAlign: 'middle'}} alt /> Consulter ce jeu de données sur data.gouv.fr</a>}
      </div>
    )
  }
}

export default Description
