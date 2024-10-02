import {Download} from '@codegouvfr/react-dsfr/Download'
import PropTypes from 'prop-types'

function DownloadCertificate({id, title}) {
  return (
    <Download label={title} details='PDF' linkProps={{
      href: `/api/certificat/pdf/${id}`,
      target: '_blank'
    }} />
  )
}

export default DownloadCertificate

DownloadCertificate.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string
}

