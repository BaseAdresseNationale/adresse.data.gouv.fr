import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors'

function Partner({link, name, ...props}) {
  return (
    <a className='partner' href={link} target='_blank' rel='noreferrer'>
      <div className='logo'>
        <Image {...props} layout='fixed' />
      </div>
      <div className='name'><b>{name}</b></div>

      <style jsx>{`
        .partner {
          text-decoration: none;
          display: grid;
          grid-template-rows: 150px 50px;
        }
        .partner:hover {
          text-decoration: underline;
        }
        .logo {
          display: flex;
          justify-content: center;
          align-items: center;
          
        }
        .name {
          text-align: center; 
          color: ${colors.black};
          font-size: 1.1em;
        }
        `}</style>

    </a>
  )
}

Partner.propTypes = {
  link: PropTypes.string,
  name: PropTypes.string.isRequired
}

export default Partner

