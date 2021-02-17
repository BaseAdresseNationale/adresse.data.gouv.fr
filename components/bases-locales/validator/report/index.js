import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {validateProfile} from '@etalab/bal'

import Loader from '@/components/loader'

import Fields from './fields'
import Summary from './summary'

import theme from '@/styles/theme'
import FileValidation from './file-validation'

function Report({report}) {
  const {fileValidation, rows, fields, notFoundFields, profilesValidation} = report
  const [profile, setProfile] = useState('1.2-etalab')
  const [profileReport, setProfileReport] = useState(null)

  useEffect(() => {
    const getProfileReport = async () => {
      const profileReport = await validateProfile(report, profile)
      setProfileReport(profileReport)
    }

    if (profile) {
      getProfileReport()
    }
  }, [report, profile])

  return (
    <div>
      <div className='profil-selector'>
        <label>Version de la spécification :</label>
        <select name='profil' defaultValue={profile} onChange={e => setProfile(e.target.value)}>
          {Object.keys(profilesValidation).map(key => (
            <option key={key} value={key}>
              {profilesValidation[key].isValid ? '✅' : '❌'}
              {' '}
              {profilesValidation[key].name}
            </option>
          ))}
        </select>
      </div>

      <div className='report-container'>
        <FileValidation {...fileValidation} rowsCount={rows.length} />
      </div>

      <div className='report-container'>
        <Fields fields={fields} notFound={notFoundFields} />
      </div>

      <div className='report-container'>
        <h4>Validation des données</h4>
        {profileReport ? (
          <Summary rows={profileReport.rows} fields={profileReport.fields} />
        ) : (
          <Loader size='big' />
        )}
      </div>

      <style jsx>{`
        .profil-selector {
          display: flex;
          align-items: center;
          margin: 1em;
        }

        select {
          margin-left: 1em;
          background-size: 2em 1em;
        }

        .report-container {
          margin: 2em 0;
          padding: 2em 1em;
          box-shadow: 0 1px 4px ${theme.boxShadow};
          background: ${theme.colors.white};
        }
      `}</style>
    </div>
  )
}

Report.propTypes = {
  report: PropTypes.shape({
    fields: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    notFoundFields: PropTypes.array.isRequired,
    profilesValidation: PropTypes.object.isRequired,
    uniqueErrors: PropTypes.array.isRequired,
    fileValidation: PropTypes.shape({
      encoding: PropTypes.object.isRequired,
      delimiter: PropTypes.object.isRequired,
      linebreak: PropTypes.object.isRequired
    })
  }).isRequired
}

export default Report
