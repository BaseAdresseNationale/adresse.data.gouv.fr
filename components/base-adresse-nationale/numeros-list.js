import React from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {ChevronDown} from 'react-feather'

import theme from '@/styles/theme'
import Certification from './certification'

function NumerosList({numeros}) {
  const router = useRouter()

  const handleSelect = idNumero => {
    const [codeCommune, idVoie] = idNumero.split('_')
    router.push(
      `/base-adresse-nationale?codeCommune=${codeCommune}&idVoie=${codeCommune}_${idVoie}&idNumero=${idNumero}`,
      `/base-adresse-nationale/commune/${codeCommune}/voie/${codeCommune}_${idVoie}/numero/${idNumero}`
    )
  }

  return (
    <div>
      <div className='numeros-list'>
        {numeros.map(({id, numero, suffixe, sourcePosition}) => (
          <div key={id} className='numero' onClick={() => handleSelect(id)}>
            <div><b>{numero}{suffixe}</b></div>
            <div>
              <Certification isCertified={sourcePosition === 'bal'} subject='Ce numéro' iconSize={16} />
            </div>
            <div><ChevronDown /></div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .heading {
          display: grid;
          grid-template-columns: 2fr 1fr 24px;
          align-items: center;
          grid-gap: 0.5em;
          padding: 0.2em 0 0 0.2em;
        }

        .numeros-list .numero {
          display: grid;
          grid-template-columns: 2fr 1fr 24px;
          align-items: center;
          grid-gap: 0.5em;
          padding: 0.2em 0 0 0.2em;
          cursor: pointer;
          background-color: #fff;
        }

        .numeros-list .numero:nth-child(even) {
          background-color: ${theme.backgroundGrey};
        }

        .numeros-list .numero:nth-child(even):hover, .numeros-list  .numero:hover {
          background-color: ${theme.primary};
          color: #fff;
        }
      `}</style>
    </div>
  )
}

NumerosList.propTypes = {
  numeros: PropTypes.array.isRequired
}

export default NumerosList
