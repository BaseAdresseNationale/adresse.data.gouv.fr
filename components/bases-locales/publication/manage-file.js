import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {uniq} from 'lodash'
import {validate} from '@etalab/bal'

import {getFileExtension} from '@/lib/bal/file'

import FileHander from '../validator/file-handler'
import Report from '../validator/report'

import theme from '@/styles/theme'

const ManageFile = React.memo(({url, handleFile}) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  const parseFile = useCallback(async file => {
    try {
      const report = await validate(file)
      const communes = uniq(report.normalizedRows.map(r => r.codeCommune))

      if (communes.length !== 1) {
        throw new Error('Fichier BAL vide ou contenant plusieurs communes')
      }

      if (report.hasErrors) {
        setReport(report)
      } else {
        handleFile(file)
      }
    } catch (err) {
      const error = `Impossible d’analyser le fichier… [${err.message}]`
      setError(error)
    }
  }, [handleFile])

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

  useEffect(() => {
    if (report) {
      setLoading(false)
    }
  }, [report])

  const handleFileDrop = useCallback(fileList => {
    const file = fileList[0] // Keep only the first file
    const fileExtension = getFileExtension(file.name)

    setLoading(true)

    if (!fileExtension || fileExtension !== 'csv') {
      setError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier *.csv.')
    } else if (file.size > 10 * 1024 * 1024) {
      setError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 10 Mo.')
    } else {
      setFile(file)
    }
  }, [setLoading, setError])

  return (
    <>
      <FileHander
        defaultValue={url}
        file={file}
        error={error}
        onFileDrop={handleFileDrop}
        isLoading={loading}
      />

      {report && (
        <>
          <h3 style={{color: theme.colors.red}}>Base adresses locales non conforme</h3>
          <Report report={report} />
        </>
      )}
    </>
  )
})

ManageFile.propTypes = {
  url: PropTypes.string,
  handleFile: PropTypes.func.isRequired
}

ManageFile.defaultProps = {
  url: null
}

export default ManageFile
