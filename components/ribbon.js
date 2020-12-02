import React from 'react'
import Link from 'next/link'
import theme from '@/styles/theme'

function Ribbon() {
  return (
    <div>
      <div className='ribbon'>
        <strong>Nouveautés</strong> : consultez nos <Link href='/guides'>guides de l’adressage</Link> à destination des collectivités.
      </div>
      <style jsx>{`
      .ribbon {
        text-align: center;
        background-color: rgb(180,225,250);
        color: ${theme.colors.almostBlack};
        font-size: 19px;
        padding: 1em;
      }

      @media (max-width: 700px) {
        img {
          display: none;
        }
      }
    `}</style>
    </div>
  )
}

export default Ribbon
