import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors'

function Partner({link, name, ...props}) {
  return (
    <div className='partner' href={link}>
      <div className='item-a'>
        <Image {...props} layout='fixed' />
      </div>
      <div className='item-b'> {link ? <a href={link} target='_blank' rel='noreferrer' className='partner-link'><b>{name}</b></a> : <b>{name}</b>} </div>
      <style jsx>{`
        .partner {
          display: grid;
          grid-template-rows: 150px 50px;
        }
        .item-a {
          display: flex;
          justify-content: center;
          align-items: center;
          
        }
        .item-b {
          text-align: center; 
        }
        .partner-link{
          color: ${colors.black};
          text-decoration: none;
          font-size: 1.1em;
        }
        `}</style>
    </div>
  )
}

Partner.propTypes = {
  link: PropTypes.string,
  name: PropTypes.string.isRequired
}

export default Partner

