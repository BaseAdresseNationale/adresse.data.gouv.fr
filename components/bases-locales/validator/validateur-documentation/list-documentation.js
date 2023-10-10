import PropTypes from 'prop-types'
import {useMemo} from 'react'
import {groupBy, pickBy} from 'lodash'
import TableDocumentation from './table-documentation'

const columns = new Set([
  'uid_adresse',
  'cle_interop',
  'commune_insee',
  'commune_nom',
  'commune_deleguee_insee',
  'commune_deleguee_nom',
  'voie_nom',
  'lieudit_complement_nom',
  'numero',
  'suffixe',
  'position',
  'x',
  'y',
  'long',
  'lat',
  'cad_parcelles',
  'source',
  'date_der_maj',
  'certification_commune',
])

function ProfileDocumentation({lines, type, className}) {
  const linesByType = useMemo(() => {
    const res = groupBy(lines, l => l.split('.')[0])
    return pickBy(res, (value, key) => type === 'field' ? columns.has(key) : !columns.has(key))
  }, [lines])

  return (
    <>
      <TableDocumentation lines={linesByType} className={className} />
      <style jsx>{`
        .title-table {
          margin-top: 10px;
          margin-bottom: 0px;
        }
      `}</style>
    </>
  )
}

ProfileDocumentation.propTypes = {
  lines: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired
}

export default ProfileDocumentation
