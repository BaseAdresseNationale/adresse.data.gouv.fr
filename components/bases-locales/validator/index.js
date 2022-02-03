import {useState} from 'react'
import {prevalidate} from '@etalab/bal'

import {getFileExtension} from '@/lib/bal/file'

import Section from '@/components/section'
import Loader from '@/components/loader'

import Report from './report'
import FileHander from './file-handler'

function BALValidator() {
  const [file, setFile] = useState()
  const [error, setError] = useState()
  const [inProgress, setInProgress] = useState(false)
  const [report, setReport] = useState()

  const handleError = error => {
    setError(error)
    setFile(null)
    setReport(null)
  }

  const parseFile = async file => {
    setInProgress(true)
    try {
      const report = await prevalidate(file, {relaxFieldsDetection: true})
      if (report.parseOk) {
        setReport(report)
      } else {
        setError(`Impossible d’analyser le fichier... [${report.parseErrors[0].message}]`)
        setFile(null)
        setReport(null)
      }
    } catch (err) {
      setError(`Impossible d’analyser le fichier... [${err.message}]`)
      setFile(null)
      setReport(null)
    }

    setInProgress(false)
  }

  const handleFileDrop = fileList => {
    const file = fileList[0]
    const fileExtension = getFileExtension(file.name)

    if (!fileExtension || fileExtension !== 'csv') {
      handleError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier *.csv.')
    } else if (file.size > 50 * 1024 * 1024) {
      handleError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 50 Mo.')
    } else if (file.size === 0) {
      handleError('Ce fichier est vide.')
    } else {
      setError(null)
      setFile(file)
      parseFile(file)
    }
  }

  return (
    <Section>
      <FileHander
        file={file}
        isLoading={inProgress}
        error={error}
        onFileDrop={handleFileDrop}
      />
      {inProgress &&
        <Section title='Analyse en cours'>
          <div className='centered'>
            <Loader size='big' />
          </div>
        </Section>}

      {report &&
        <div>
          <Report report={report} />
        </div>}

      <style jsx>{`
        .centered {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin: 1em 0 2em;
        }
      `}</style>
    </Section>
  )
}

export default BALValidator
