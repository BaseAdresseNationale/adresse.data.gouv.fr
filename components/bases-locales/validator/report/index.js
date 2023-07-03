import PropTypes from 'prop-types'

import Fields from './fields'
import Summary from './summary'

import theme from '@/styles/theme'
import FileValidation from './file-validation'
import ProfileValidation from './profile-validation/profile-validation'

function Report({report}) {
  const {fileValidation, rows, fields, notFoundFields, profilErrors} = report

  return (
    <>
      <div className='report-container'>
        <FileValidation {...fileValidation} rowsCount={rows.length} />
      </div>

      <div className='report-container'>
        <ProfileValidation profilErrors={profilErrors} />
      </div>

      <div className='report-container'>
        <Fields fields={fields} notFound={notFoundFields} />
      </div>

      <div className='report-container'>
        <Summary rows={report.rows} fields={report.fields} />
      </div>

      <style jsx>{`
        .report-container {
          margin: 2em 0;
          padding: 2em 1em;
          box-shadow: 0 1px 4px ${theme.boxShadow};
          background: ${theme.colors.white};
        }
      `}</style>
    </>
  )
}

Report.propTypes = {
  report: PropTypes.shape({
    fields: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    notFoundFields: PropTypes.array.isRequired,
    uniqueErrors: PropTypes.array.isRequired,
    fileValidation: PropTypes.shape({
      encoding: PropTypes.object.isRequired,
      delimiter: PropTypes.object.isRequired,
      linebreak: PropTypes.object.isRequired
    }),
    profilErrors: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string.isRequired,
        level: PropTypes.string.isRequired
      })
    ),
  }).isRequired
}

export default Report
