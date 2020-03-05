import 'isomorphic-unfetch' // eslint-disable-line import/no-unassigned-import
import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {validate} from '@etalab/bal'

import {getFileExtension, checkHeaders, statusCodeMsg} from '../../../lib/bal/file'

import FileHander from '../validator/file-handler'
import Report from '../validator/report'

import theme from '../../../styles/theme'

const ManageFile = React.memo(({url, handleValidBal}) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  const handleFileDrop = useCallback(fileList => {
    const file = fileList[0] // Keep only the first file
    const fileExtension = getFileExtension(file.name)

    setLoading(true)

    if (!fileExtension || fileExtension !== 'csv') {
      setError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier *.csv.')
    } else if (file.size > 100 * 1024 * 1024) {
      setError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 100 Mo.')
    } else if (file.size === 0) {
      setError('Ce fichier est vide.')
    } else {
      setFile(file)
    }
  }, [setLoading, setError])

  const parseFile = useCallback(async file => {
    try {
      const report = await validate(file)
      setLoading(false)
      if (report.hasErrors) {
        setReport(report)
      } else {
        handleValidBal(report)
      }
    } catch (err) {
      const error = `Impossible d’analyser le fichier… [${err.message}]`
      setError(error)
    }
  }, [handleValidBal])

  const handleInput = useCallback(async input => {
    setError(null)
    if (input) {
      const url = 'https://adressedgv-cors.now.sh/' + input

      try {
        setLoading(true)
        const response = await fetch(url)
        if (response.ok) {
          if (checkHeaders(response.headers)) {
            const file = await response.blob()
            setFile(file)
          } else {
            throw new Error('Le fichier n’a pas été reconnu comme étant au format CSV')
          }
        } else if (response.status in statusCodeMsg) {
          throw new Error(`Impossible de récupérer le fichier car ${statusCodeMsg[response.status]}.`)
        } else {
          throw new Error('Impossible de récupérer le fichier car une erreur est survenue.')
        }
      } catch (err) {
        setError(err)
      }
    } else {
      const error = 'Le champ est vide.'
      setError(error)
    }
  }, [setLoading, setFile, setError])

  useEffect(() => {
    if (file) {
      setError(null)
      setReport(null)
      parseFile(file)
    }
  }, [file, parseFile])

  useEffect(() => {
    if (error) {
      setFile(null)
      setLoading(false)
      setReport(null)
    }
  }, [error])

  return (
    <>
      <FileHander
        defaultValue={url}
        file={file}
        error={error}
        onFileDrop={handleFileDrop}
        onSubmit={handleInput}
        isLoading={loading}
      />

      {report && (
        <>
          <h3 style={{color: theme.colors.red, marginTop: '1em'}}>Base adresses locales non conforme</h3>
          <Report report={report} />
        </>
      )}
    </>
  )
})

ManageFile.propTypes = {
  url: PropTypes.string,
  handleValidBal: PropTypes.func.isRequired
}

ManageFile.defaultProps = {
  url: null
}

export default ManageFile
