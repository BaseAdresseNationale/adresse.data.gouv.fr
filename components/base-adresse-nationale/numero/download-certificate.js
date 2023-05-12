import {Download} from '@codegouvfr/react-dsfr/Download'
import PropTypes from 'prop-types'

function DownloadCertificate({cleInterop, title}) {
  return (
    <Download label={title} details='PDF' linkProps={{
      href: `/api/certificat/pdf/${cleInterop}`
    }} />
  )
}

export default DownloadCertificate

DownloadCertificate.propTypes = {
  cleInterop: PropTypes.string.isRequired,
  title: PropTypes.string
}

