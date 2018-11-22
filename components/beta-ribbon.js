import React from 'react'
import theme from '../styles/theme'

const BetaRibbon = () => (
  <div className='ribbon'>
    <style jsx>{`
      .ribbon:after {
        content: "beta";
        display: inline-block;
        width: 50px;
        height: 20px;
        background-color: ${theme.colors.white};
        text-align: center;
        font-size: 13px;
        text-transform: uppercase;
        font-weight: bold;
        color: ${theme.primary};
        line-height: 20px;
        box-shadow: 0 3px 10px -5px #C9D3DF;
        -ms-transform:rotate(45deg);
        -webkit-transform:rotate(45deg);
        transform:rotate(45deg);
      }

      @media (max-width: 420px) {
        .ribbon:after {
          width: 40px;
          height: 20px;
          top: 50px;
          right: 20px;
          font-size: 12px;
          line-height: 20px;
        }
      }

      @media (max-width: 400px) {
        .ribbon:after {
          right: 25px;
        }
      }
      `}</style>
  </div>
)

export default BetaRibbon
