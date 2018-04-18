import React from 'react'
import PropTypes from 'prop-types'
import {_get} from '../../lib/fetch'

import Page from '../../layouts/main'
import Section from '../../components/section'
import withErrors from '../../components/hoc/with-errors'

import SearchCommune from '../../components/explorer/search-commune'
import Commune from '../../components/explorer/commune'
import VoiesCommune from '../../components/explorer/commune/voies-commune'

class CommunePage extends React.Component {
  state = {
    communeVoiesPromise: null
  }

  componentDidMount() {
    const {commune} = this.props

    if (commune && commune.code) {
      this.buildVoiesPromise(commune.code)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {commune} = this.props

    if (nextProps.commune.code !== commune.code) {
      this.buildVoiesPromise(nextProps.commune.code)
    }
  }

  buildVoiesPromise(codeCommune) {
    this.setState(() => ({
      communeVoiesPromise: _get(`https://sandbox.geo.api.gouv.fr/explore/${codeCommune}`)
    }))
  }

  render() {
    const {communeVoiesPromise} = this.state
    const {commune} = this.props
    const description = `Consulter les voies de ${commune.nom}`

    return (
      <Page title={commune.nom} description={description}>
        <SearchCommune />

        <Section>
          <Commune {...commune} />
          <VoiesCommune promise={communeVoiesPromise} />
        </Section>
      </Page>
    )
  }
}

CommunePage.propTypes = {
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    codesPostaux: PropTypes.array.isRequired,
    departement: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired,
    region: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired
    }).isRequired,
    centre: PropTypes.shape({
      type: PropTypes.string.isRequired,
      coordinates: PropTypes.array.isRequired
    }).isRequired,
    contour: PropTypes.shape({
      type: PropTypes.string.isRequired,
      coordinates: PropTypes.array.isRequired
    }).isRequired,
    population: PropTypes.number.isRequired,
    surface: PropTypes.number.isRequired
  })
}

CommunePage.defaultProps = {
  commune: null
}

CommunePage.getInitialProps = async ({query}) => {
  const fields = 'fields=code,nom,codesPostaux,surface,population,centre,contour,departement,region'
  return {
    commune: await _get(`https://geo.api.gouv.fr/communes/${query.codeCommune}?${fields}&boost=population`)
  }
}

export default (withErrors(CommunePage))
