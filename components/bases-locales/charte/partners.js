import PropTypes from 'prop-types'
import Partner from '@/components/bases-locales/charte/partner'
import {orderBy} from 'lodash'

import colors from '@/styles/colors'

function Partners({data, isOrder, epci, companies, shuffledPartners}) {
  const _data = data || epci || companies || shuffledPartners
  const _isOrder = isOrder || data || epci || companies
  const items = _isOrder ? orderBy(_data, 'name', 'asc') : _data

  return (
    <>
      <div className='partners-container'>
        {items.map(item => <Partner key={item.name} partnerInfos={item} isCommune={item.echelon === 0} />)}
      </div>

      <style jsx>{`
        .partners-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          justify-items: center;
          margin-top: 4em;
          gap: 8em;
        }

        .compagny {
          margin-top: 8em;
          border-top: ${colors.lighterGrey} solid;
          display: grid;
          grid-template-rows: 50px 1fr;
        }

        .subtitle {
          margin-top: 2em;
          color: ${colors.black};
          font-weight: bold;
          align-self: center;
        }
      `}</style>
    </>
  )
}

Partners.propTypes = {
  data: PropTypes.array,
  isOrder: PropTypes.bool,
  epci: PropTypes.array,
  companies: PropTypes.array,
  shuffledPartners: PropTypes.array
}

export default Partners
