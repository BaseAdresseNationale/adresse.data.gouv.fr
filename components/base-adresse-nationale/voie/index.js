import PropTypes from 'prop-types'
import Link from 'next/link'
import colors from '@/styles/colors'

import {getNumeroComplet} from '@/lib/ban'

import Tag from '@/components/tag'

import AddressesList from '../addresses-list'
import ParcellesList from '../parcelles-list'
import Numero from './numero'
import Notification from '@/components/notification'
import RegionInfos from '../region-infos'
import LanguagesPreview from '../languages-preview'

function Voie({type, nomVoie, nomVoieAlt, commune, numeros, parcelles, displayBBox, nbNumeros}) {
  const isToponyme = type === 'lieu-dit'
  const {region, departement} = commune

  return (
    <>
      <div className='heading'>
        <div>
          <h2>{nomVoie}</h2>
          {nomVoieAlt && <LanguagesPreview nomAlt={nomVoieAlt} />}
        </div>

        {commune && <h4><Link href={`/base-adresse-nationale?id=${commune.id}`} as={`/base-adresse-nationale/${commune.id}`}><a>{commune.nom} - {commune.code}</a></Link></h4>}
        {region && departement && (
          <RegionInfos codeCommune={commune.code} region={region} departement={departement} />
        )}
        <div className='number-of-numeros'>{nbNumeros > 0 ? (nbNumeros > 1 ? `${nbNumeros} numéros répertoriés` : '1 numéro répertorié') : 'Aucun numéros répertorié'}</div>
      </div>

      {!displayBBox && (
        <Notification type='warning' message='Aucune position n’est connue pour cette adresse, elle ne peut donc pas être affichée sur la carte.' />
      )}

      {isToponyme ? (
        <Tag type='lieu-dit' />
      ) : (
        <div className='numeros-list'>
          <AddressesList
            title='Numéros de la voie'
            addresses={numeros}
            placeholder='Rechercher un numéro'
            getLabel={getNumeroComplet}
            addressComponent={numero => (
              <Numero isCertified={numero.certifie} {...numero} />
            )}
          />
        </div>
      )}

      {parcelles && <div style={{marginTop: '1em'}}>Parcelles cadastrales : <ParcellesList parcelles={parcelles} /></div>}

      <style jsx>{`
        .heading {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1em;
          margin: 1.2em 0;
          border-bottom: solid 1px ${colors.lightGrey}
        }

        .heading h2 {
          margin: 0;
        }

        .heading h4 {
          margin-bottom: 0.2em;
        }

        .number-of-numeros {
          font-weight: bolder;
          margin: 2em 0 0.7em 0;
        }
        `}</style>
    </>
  )
}

Voie.propTypes = {
  nomVoieAlt: null,
  commune: null,
  numeros: null,
  nbNumeros: null,
  parcelles: null,
  displayBBox: null
}

Voie.propTypes = {
  nomVoie: PropTypes.string.isRequired,
  nomVoieAlt: PropTypes.object,
  type: PropTypes.oneOf(['voie', 'lieu-dit']),
  commune: PropTypes.shape({
    id: PropTypes.string,
    nom: PropTypes.string,
    code: PropTypes.string,
    region: PropTypes.object,
    departement: PropTypes.object
  }),
  displayBBox: PropTypes.array,
  nbNumeros: PropTypes.number,
  numeros: PropTypes.array,
  parcelles: PropTypes.array
}

export default Voie
