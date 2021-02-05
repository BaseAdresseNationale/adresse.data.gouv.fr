import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import {validate} from '@etalab/bal'

import {getFileExtension, checkHeaders, statusCodeMsg} from '@/lib/bal/file'

import FileHander from '../validator/file-handler'
import Report from '../validator/report'

import theme from '@/styles/theme'

const ManageFile = React.memo(({url, handleValidBal}) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  const parseFile = useCallback(async file => {
    try {
      const report = await validate(file)

      if (report.rowsWithIssues.length === 0) {
        handleValidBal(report)
      } else {
        setReport(report)
      }
    } catch (err) {
      const error = `Impossible d’analyser le fichier… [${err.message}]`
      setError(error)
    }
  }, [handleValidBal])

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
    } else if (file.size > 100 * 1024 * 1024) {
      setError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 100 Mo.')
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
        loading={loading}
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
  handleValidBal: PropTypes.func.isRequired
}

ManageFile.defaultProps = {
  url: null
}

export default ManageFile
