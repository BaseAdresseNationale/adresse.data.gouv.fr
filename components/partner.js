import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import colors from '@/styles/colors'

function Partner({link, name, ...props}) {
  return (
    <div className='partner' href={link}>
      <div>
        <Image {...props} layout='fixed' />
      </div>
      <div style={{marginTop: '1.5em'}}> {link ? <a href={link} target='_blank' rel='noreferrer' className='partner-link'><b>{name}</b></a> : <b>{name}</b>} </div>
      <style jsx>{`
        .partner {
          display: grid;
          grid-template-rows: 1fr 1fr;
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

