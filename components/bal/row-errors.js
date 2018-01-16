import PropTypes from 'prop-types'

import theme from '../../styles/theme'

const RowErrors = ({errors, field}) => (
  <div className='abnormalities'>
    <h3>Anomalie{errors.length > 1 ? 's' : ''} :</h3>
    <div className='error-list'>
      {errors.map(err => (
        <div key={err} className={`field ${field && field.errors.includes(err) ? 'select' : ''}`}>
          {err}
        </div>))}
    </div>
    <style>{`
      .abnormalities {
        display: flex;
        flex-flow: wrap;
        align-items: center;
        justify-content: space-around;
        margin: 1em 0;
      }

      .field {
        padding: 0.5em;
        margin: 0.5em 0;
        border-radius: 3px;
        background: ${theme.errorBg};
      }

      .field.select {
        background: ${theme.errorBorder};
        color: ${theme.colors.white};
      }
      `}</style>
  </div>
)

RowErrors.propTypes = {
  errors: PropTypes.array.isRequired,
  field: PropTypes.object
}

RowErrors.default = {
  field: null
}

export default RowErrors
