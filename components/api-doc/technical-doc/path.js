import React from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import ExpandableMenu from '../expandable-menu'
import ParamsTable from './params-table'

const getMethodColor = method => {
  switch (method) {
    case 'post':
      return theme.colors.green
    case 'put':
      return theme.colors.orange
    default:
      return theme.primary
  }
}

function Path({name, description, params, method, body}) {
  const title = (
    <div className='get'>
      <div className='method'>{method}</div>
      <div className='description'>
        <div><b>{name}</b></div>
        <div>{description}</div>
      </div>
      <style jsx>{`
        .get {
          display: flex;
          align-items: center;
        }

        .method {
          background-color: ${getMethodColor(method)};
          color: ${theme.colors.white};
          font-weight: 600;
          border-radius: 3px;
          padding: 0.3em 1em;
          margin-right: 1em;
          width: 75px;
          text-align: center;
          text-transform: uppercase;
        }

        .description {
          width: 100%;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          font-weight: 500;
        }
        `}</style>
    </div>
  )

  return (
    <ExpandableMenu title={title}>
      <ParamsTable params={params} />
      {body && <ParamsTable label='body' params={[body]} />}
    </ExpandableMenu>
  )
}

Path.defaultProps = {
  method: 'get',
  body: null
}

Path.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  params: PropTypes.array.isRequired,
  method: PropTypes.oneOf(['get', 'post', 'put']),
  body: PropTypes.object
}

export default Path
