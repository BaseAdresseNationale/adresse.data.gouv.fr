import {useState, useEffect} from 'react'
import {validate, profiles} from '@ban-team/validateur-bal'
import {Check, X} from 'react-feather'

import {getFileExtension} from '@/lib/bal/file'

import theme from '@/styles/theme'
import Section from '@/components/section'
import Loader from '@/components/loader'
import ButtonLink from '@/components/button-link'
import Report from './report'
import FileHander from './file-handler'

const defaultProfil = '1.3-etalab-strict'

function BALValidator() {
  const [file, setFile] = useState()
  const [error, setError] = useState()
  const [inProgress, setInProgress] = useState(false)
  const [report, setReport] = useState()
  const [profile, setProfile] = useState(defaultProfil)

  const handleError = error => {
    setError(error)
    setFile(null)
    setReport(null)
  }

  const getProfileReport = async file => {
    if (file) {
      setInProgress(true)
      try {
        setReport(null)
        const report = await validate(file, {profile, relaxFieldsDetection: profile === '1.3-etalab'})
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
  }

  useEffect(() => {
    getProfileReport(file)
  }, [profile, file, getProfileReport])

  const handleFileDrop = fileList => {
    const file = fileList[0]
    const fileExtension = getFileExtension(file.name)

    if (!fileExtension || fileExtension !== 'csv') {
      handleError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier *.csv.')
    } else if (file.size > 100 * 1024 * 1024) {
      handleError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 50 Mo.')
    } else if (file.size === 0) {
      handleError('Ce fichier est vide.')
    } else {
      setError(null)
      setFile(file)
      getProfileReport(file)
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
      <div className='menu-validateur'>
        <div className='profil-selector'>
          <label>Version de la spécification</label>
          <select name='profil' defaultValue={profile} onChange={e => setProfile(e.target.value)}>
            {Object.values(profiles).filter(p => p.isUsed).map(p => (
              <option key={p.code} value={p.code}>
                {p.name}
                {defaultProfil === p.code && ' (défaut)'}
              </option>
            ))}
          </select>
        </div>
        <ButtonLink href='/bases-locales/validator-documentation' title='Documentation Validateur'>
          Documentation
        </ButtonLink>
      </div>
      {inProgress &&
        <Section title='Analyse en cours'>
          <div className='centered'>
            <Loader size='big' />
          </div>
        </Section>}
      {report &&
        <>
          <h3>
            {report.profilesValidation[profile].isValid ? (
              <span className='check profile-validation'>
                Le fichier Bal est valide (en version {profiles[profile].name})
                <span className='icon'><Check alt='Valide' /></span>
              </span>
            ) : (
              <span className='error profile-validation'>
                Le fichier Bal n’est pas valide (en version {profiles[profile].name})
                <X className='icon' alt='Invalide' />
              </span>
            )}
          </h3>
          <Report profile={profile} report={report} />
        </>}
      <style jsx>{`
        .menu-validateur {
          margin-top: 20px;
          display: flex;
          align-items: unset;
          justify-content: space-between;
        }
        .profil-selector {
          display: flex;
          align-items: self-end;
        }
        .profil-selector > label {
          margin-right: 10px;
          font-size: 20px;
          font-weight: bold;
        }
        .centered {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          margin: 1em 0 2em;
        }
        .profile-validation {
          display: flex;
          align-items: baseline;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .check {
          color: ${theme.colors.green};
        }
        .error {
          color: ${theme.colors.red};
        }
        .icon {
          margin-left: 5px;
        }
      `}</style>
    </Section>
  )
}

export default BALValidator
