import {useMemo} from 'react'
import PropTypes from 'prop-types'

import colors from '@/styles/colors'

import {isCOM} from '@/lib/ban'

function RegionInfos({codeCommune, region, departement}) {
  const sortInfoToDisplay = useMemo(() => {
    if (isCOM(codeCommune)) {
      return `Collectivité d’outremer - ${departement.nom} (${departement.code})`
    }

    if (region.nom === departement.nom) {
      return `${departement.nom} (${departement.code})`
    }

    return `${region.nom} - ${departement.nom} (${departement.code})`
  }, [codeCommune, region, departement])

  return (
    <div className='region'>
      {sortInfoToDisplay}

      <style jsx>{`
        .region {
          font-style: italic;
          font-size: 17px;
          color: ${colors.almostBlack};
          margin-top: .5em;
        }
      `}</style>
    </div>
  )
}

RegionInfos.propTypes = {
  codeCommune: PropTypes.string.isRequired,
  region: PropTypes.object.isRequired,
  departement: PropTypes.object.isRequired
}

export default RegionInfos
