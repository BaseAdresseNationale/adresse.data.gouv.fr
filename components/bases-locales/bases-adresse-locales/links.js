import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import MdFileDownload from 'react-icons/lib/md/file-download'

import ButtonLink from '../../button-link'

class Links extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    link: PropTypes.string
  }

  static defaultProps = {
    link: null
  }

  render() {
    const {url, link} = this.props
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

        {link &&
        <Link href={link}>
          <a>Consulter</a>
        </Link>}

        <style jsx>{`
          .links {
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 212px;
            margin: 0 auto;
          }
          `}</style>
      </div>
    )
  }
}

export default Links
