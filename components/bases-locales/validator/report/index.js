import {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {validateProfile} from '@etalab/bal'
import {Info} from 'react-feather'

import Loader from '@/components/loader'
import Notification from '@/components/notification'
import Button from '@/components/button'
import ValidationInfos from './summary/validation-infos'

import Fields from './fields'
import Summary from './summary'

import theme from '@/styles/theme'
import FileValidation from './file-validation'

function Report({report}) {
  const {fileValidation, rows, fields, notFoundFields, profilesValidation} = report
  const [profile, setProfile] = useState('1.3-etalab')
  const [profileReport, setProfileReport] = useState(null)
  const [isInfosDisplayed, setIsInfosDisplayed] = useState(false)

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
      {isInfosDisplayed ? (
        <ValidationInfos handleClose={() => setIsInfosDisplayed(false)} />
      ) : (
        <Notification style={{margin: '1em'}}>
          <div className='infos-notification'>
            <Info style={{verticalAlign: 'bottom', marginRight: '1em'}} />
            Quels sont les champs de validation et comment est validé votre fichier ?
            <Button onClick={() => setIsInfosDisplayed(true)}>
              Afficher les informations sur la validation
            </Button>
          </div>
        </Notification>
      )}

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

        .infos-notification {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        @media (max-width: ${theme.breakPoints.tablet}) {
          .infos-notification {
            flex-direction: column;
            gap: .5em;
          }
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
