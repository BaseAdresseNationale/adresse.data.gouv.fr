import prune from 'underscore.string/prune'
import PropTypes from 'prop-types'
import Head from 'next/head'

const SITE_NAME = 'adresse.data.gouv.fr'

function Meta({title, description, image}) {
  description = prune(description, 160, '…')
  return (
    <Head>
      {title ? <title>{title} | {SITE_NAME}</title> : <title>{SITE_NAME}</title>}

      {/* Search Engine */}
      <meta name='description' content={description} />
      <meta name='image' content={image || 'https://adresse.data.gouv.fr/images/previews/default.png'} />

      {/* Schema.org for Google */}
      <meta itemProp='name' content={title} />
      <meta itemProp='description' content={description} />
      <meta itemProp='image' content={image || 'https://adresse.data.gouv.fr/images/previews/default.png'} />

      {/* Twitter */}
      <meta name='twitter:image' content={image || '{{ site.url }}/img/logo_marianne_share.jpeg'} />

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:site' content='@AdresseDataGouv' />
      <meta name='twitter:image:src' content={image || '/images/logos/logo-adresse.svg'} />

      {/* Open Graph general (Facebook, Pinterest & Google+) */}
      <meta name='og:title' content={title} />
      <meta name='og:description' content={description} />
      <meta name='og:image' content={image || '/images/logos/logo-adresse.svg'} />
      <meta name='og:url' content='https://adresse.data.gouv.fr' />
      <meta name='og:site_name' content='adresse.data.gouv.fr' />
      <meta name='og:locale' content='fr_FR' />
      <meta name='og:type' content='website' />
    </Head>
  )
}

Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string
}

Meta.defaultProps = {
  title: 'Site officiel de la Base Adresse Nationale',
  description: 'Un référentiel national ouvert : de l’adresse à la coordonnée géographique',
  image: null
}

export default Meta
