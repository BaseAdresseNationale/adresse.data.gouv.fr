import PropTypes from 'prop-types'
import Partner from '@/components/bases-locales/charte/partner'
import {orderBy} from 'lodash'

import colors from '@/styles/colors'

function Partners({data}) {
  const items = orderBy(data, 'name', 'asc')

  return (
    <>
      <div className='partners-container'>
        {items.map(item => <Partner key={item.name} partnerInfos={item} isCommune={item.type === 'commune'} />)}
      </div>

      <style jsx>{`
        .partners-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          justify-items: center;
          align-items: flex-start;
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
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  }))
}

export default Partners
