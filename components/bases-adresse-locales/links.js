import React from 'react'
import PropTypes from 'prop-types'
import MdFileDownload from 'react-icons/lib/md/file-download'

import ButtonLink from '../button-link'

class Links extends React.Component {
  render() {
    const {url, page} = this.props
    const ButtonStyle = {
      fontSize: '1em',
      margin: '1em 0',
      width: '100%',
      textAlign: 'center'
    }

    return (
      <div className='links'>
        <ButtonLink href={url} style={ButtonStyle}>
          Télécharger <MdFileDownload />
        </ButtonLink>
        <a href={page}>Voir sur data.gouv.fr</a>

        <style jsx>{`
          .links {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          `}</style>
      </div>
    )
  }
}

Links.propTypes = {
  url: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired
}
export default Links
