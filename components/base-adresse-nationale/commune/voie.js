import PropTypes from 'prop-types'
import Link from 'next/link'

import theme from '@/styles/theme'

import Tag from '@/components/tag'
import LanguagesPreview from '../languages-preview'

function Voie({id, type, nomVoie, nomVoieAlt, nbNumeros}) {
  return (
    <Link href={`/base-adresse-nationale?id=${id}`} as={`/base-adresse-nationale/${id}`}>
      <a>
        <div className='voie'>
          <div className='voie-names'>
            <div className='voie-default-name'>
              <div><b>{nomVoie}</b></div>
              {nbNumeros > 0 && <div className='numeros'>{nbNumeros} numéros</div>}
            </div>
            <LanguagesPreview nomAlt={nomVoieAlt} />
          </div>
          {type === 'lieu-dit' && <Tag type='lieu-dit' />}
        </div>

        <style jsx>{`
          a {
            text-decoration: none;
            color: ${theme.darkText};
          }

          .voie {
            width: 100%;
            display: grid;
            grid-template-columns: ${type === 'lieu-dit' ? '2fr 1fr 24px' : '1fr 24px'};
            align-items: center;
            grid-gap: 0.5em;
            padding: 0.2em;
            cursor: pointer;
          }

          .voie-default-name {
            display: flex;
            flex-direction: ${Object.keys(nomVoieAlt).length > 0 ? 'row' : 'column'};
            justify-content: space-between;
          }

          .voie:hover {
            background-color: ${theme.primary};
            color: #fff;
          }

          .numeros {
            font-size: small;
          }
          `}</style>
      </a>
    </Link>
  )
}

Voie.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['voie', 'lieu-dit']),
  nomVoie: PropTypes.string.isRequired,
  nbNumeros: PropTypes.number.isRequired,
  nomVoieAlt: PropTypes.object.isRequired
}

export default Voie
