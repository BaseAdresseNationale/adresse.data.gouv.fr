import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import MdFileDownload from 'react-icons/lib/md/file-download'

import {spaceThousands} from '../../../lib/format-numbers'

import ButtonLink from '../../button-link'

import Organization from './organization'
import Meta from './meta'

class Summary extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    licenseLabel: PropTypes.string.isRequired,
    organization: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string.isRequired,
    valid: PropTypes.bool,
    error: PropTypes.object
  }

  static defaultProps = {
    valid: null,
    error: null
  }

  constructor(props) {
    super(props)

    const {count, licenseLabel, lastUpdate} = props

    this.infos = [
      {title: 'Format', value: 'BAL 1.1'},
      {title: 'Licence', value: licenseLabel},
      {title: 'Dernière mise à jour', value: lastUpdate || 'inconnue'},
      {title: 'Nombre d’adresses', value: spaceThousands(count)}
    ]
  }

  render() {
    const {id, url, valid, status, organization, error} = this.props
    return (
      <div>
        <div className='base-adresse-locale'>
          <div>
            <Organization logo={organization.logo} name={organization.name} />
          </div>

          <div>
            <Meta infos={this.infos} report={{id, status, valid, error}} />
          </div>

          <div className='links'>
            <ButtonLink href={`/bases-locales/jeux-de-donnees/${id}`}>
              Consulter
            </ButtonLink>
            <Link href={url}>
              <a>Télécharger <MdFileDownload /></a>
            </Link>
          </div>
        </div>

        <style jsx>{`
          .base-adresse-locale {
            display: flex;
            justify-content: space-between;
            flex-flow: wrap;
            align-items: center;
          }

          .base-adresse-locale div {
            margin: 1em auto;
          }

          .links {
            display: flex;
            flex-flow: column;
            align-items: center;
          }

          .links a {
            margin: 1em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default Summary
