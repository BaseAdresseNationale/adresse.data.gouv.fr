import PropTypes from 'prop-types'
import {useMemo} from 'react'
import {Check} from 'react-feather'

import ValidatorSectionTitle from '../../validator-section-title'
import TableProfileValidation from './table-profile-validation'

function ProileValidation({profilErrors}) {
  const {errors, warnings} = useMemo(() => {
    return {
      errors: profilErrors.filter(pe => pe.level === 'E'),
      warnings: profilErrors.filter(pe => pe.level !== 'E')
    }
  }, [profilErrors])

  return (
    <>
      <ValidatorSectionTitle>Validation générale</ValidatorSectionTitle>
      { profilErrors.length <= 0 ? (
        <h3>
          Aucune erreur ou alerte n’a été trouvée
          <Check alt='' aria-hidden='true' />
        </h3>
      ) : (
        <>
          <TableProfileValidation profilErrors={warnings} />
          <TableProfileValidation profilErrors={errors} />
        </>
      )}
      <style jsx>{`
        h3 {
          display: flex;
          gap: 10px;
          margin: 1em 0;
          font-size: 16px;
        }
      `}</style>
    </>
  )
}

ProileValidation.propTypes = {
  profilErrors: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired
    })
  ),
}

export default ProileValidation
