const statusCodeMsg = {
  400: 'l’url n’est pas valide',
  404: 'il n’a pas pu être trouvé',
  500: 'le serveur ne répond pas'
}

function getFileExtension(fileName) {
  const dotPosition = fileName.lastIndexOf('.')
  if (dotPosition > 0 && dotPosition < fileName.length - 1) {
    return fileName.slice(dotPosition + 1).toLowerCase()
  }

  return null
}

function checkHeaders(headers) {
  const contentType = headers.get('Content-Type')
  const contentDisposition = headers.get('Content-Disposition')

  if (contentType && contentType.includes('csv')) {
    return true
  }

  if (contentDisposition && contentDisposition.includes('.csv')) {
    return true
  }

  return false
}

module.exports = {
  getFileExtension,
  checkHeaders,
  statusCodeMsg
}
